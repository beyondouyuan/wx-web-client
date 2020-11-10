import Local from './local-storage';
import { isObject } from './type';
import { localStorageSetItem, localStorageSetItems } from './native/storage';
import { humpToLine } from './tools';

/**
 * 缓存用户上次筛选条件
 */
class UserCitySelect {
    constructor() {
        this.key = 'CRD_ZZC_USER_CITY_SELECT';
    }

    /**
     * 获取用户上次筛选的缓存
     */
    get() {
        return new Promise(resolve => {
            const data = Local.get(this.key) || {};
            resolve(data);
        });
    }

    /**
     * 保存用户上次查询条件
     * @param {object} data 保存数据对象
     */
    save(data) {
        this.get().then(res => {
            Local.set(
                this.key,
                {
                    ...res,
                    ...data,
                },
                60
            );
            const obj = {
                ...res,
                ...data,
            };
            localStorageSetItems('ZZCCrcAppLocalStorage', obj);
            // 格式化数据，使跟user-last-select存储的数据格式是一样的
            Object.keys(obj).forEach(objKey => {
                const innerObj = obj[objKey];
                obj.oPlace = !!innerObj.oplace;

                delete innerObj.pickTime;
                delete innerObj.dropTime;
                delete innerObj.channel;
                delete innerObj.oplace;
            });
            handleSaveToApp(obj);
        });
    }

    remove() {
        Local.remove(this.key);
    }
}

/**
 * 存储至app
 * @param {object} obj 存储到app的数据
 */
function handleSaveToApp(obj) {
    Object.keys(obj).map(key => {
        const PREFIX =
            key === 'pick'
                ? `m_zzc_crc_get_`
                : key === 'drop'
                ? `m_zzc_crc_return_`
                : `m_zzc_crc_`;
        const item = obj[key];
        if (isObject(item)) {
            for (let k in item) {
                localStorageSetItem(
                    'ZZCCrcAppLocalStorage',
                    `${PREFIX}${humpToLine(k)}`,
                    item[k].toString()
                );
            }
        } else {
            localStorageSetItem(
                'ZZCCrcAppLocalStorage',
                `${PREFIX}${humpToLine(key)}`,
                item.toString()
            );
        }
    });
}

const CitySelect = new UserCitySelect();

export default CitySelect;
