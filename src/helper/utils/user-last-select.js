
import Local from './local-storage';
import { isObject, isEmptyObject } from './type';
import { localStorageSetItem } from './native/storage';
import { humpToLine } from './tools';
import EasyToast from '@components/EasyToast';
import { isNeedUpdateSearchTime } from './update-search-time';
import { FormatSearchPickDate } from '@utils/format-search-date';
import { isApp } from './native';

/**
 * 缓存用户上次筛选条件
 */
class UserLastSelect {
  constructor() {
    this.key = 'CRD_ZZC_USER_LAST_SELECT';
  }

  /**
   * 获取用户上次筛选的缓存
   */
  get() {
    return new Promise((resolve) => {
      const data = Local.get(this.key) || {};
      if (!isEmptyObject(data)) {
        if (isNeedUpdateSearchTime(data?.pickup?.pickTime, data?.dropoff?.dropTime)) {
          // EasyToast.warning('取车时间过期，将为您重新匹配取车时间', 3)
          const defaultDate = new FormatSearchPickDate();
          const newDate = defaultDate.getFormatTime();
          data['pickup']['pickTime'] = newDate.pickTime;
          data['dropoff']['dropTime'] = newDate.dropTime;
          // 更新缓存中的数据
          this.update(data)
        }
      }
      resolve(data);
    });
  }

  /**
   * 保存用户上次查询条件
   * @param {object} data 保存数据对象
   */
  save(data) {
    // 兼容旧版
    data['oPlace'] = data['oplace'] || false;
    this.get().then((res) => {
      Local.set(this.key, {
        ...res,
        ...data
      });
      if (isApp()) {
        const obj = {
          ...res,
          ...data
        };
        handleSaveToApp(obj)
      }

    });
  }

  async update(data) {
    Local.set(this.key, {
      ...data
    });
    if (isApp()) {
      const obj = {
        ...data
      };
      handleSaveToApp(obj)
    }
  }
}

/**
 * 存储至app
 * @param {object} obj 存储到app的数据
 */
function handleSaveToApp(obj) {
  console.log(obj)
  Object.keys(obj).map(key => {
    const PREFIX = key === 'pickup' ? `m_zzc_crc_get_` : key === 'dropoff' ? `m_zzc_crc_return_` : `m_zzc_crc_`;
    const item = obj[key];
    if (isObject(item)) {
      for (let k in item) {
        localStorageSetItem('ZZCCrcAppLocalStorage', `${PREFIX}${humpToLine(k)}`, item[k]?.toString())
      }
    } else {
      localStorageSetItem('ZZCCrcAppLocalStorage', `${PREFIX}${humpToLine(key)}`, item?.toString())
    }
  });
}
const UserSelect = new UserLastSelect();

export default UserSelect;
