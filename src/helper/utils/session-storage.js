import { isJsonString } from './type';
/**
 * 封装sessionStorage
 */
class Storage {
  constructor() {
    this.session = window.sessionStorage;
    this.init()
  }

  /**
     * 存储数据
     * @param {string} key 存储数据键
     * @param {string/object} value 存储数据
     * @param {String}     expired 过期时间，以分钟为单位，非必须
     */
  set(key, value, expired) {
    if (!key || !this.isSupport()) return;
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    this.session.setItem(key, value);
    if (expired) {
      this.session[`${key}__expires__`] =
        Date.now() + 1000 * 60 * Number(expired);
    }
  }

  /**
   * 获取数据
   * @param {*} key 获取数据键名
   */
  get(key) {
    if (!key || !this.isSupport()) {
      return false;
    }
    const expired = this.session[`${key}__expires__`] || Date.now + 1;
    const now = Date.now();
    if (now > expired) {
      this.remove(key);
      return;
    }
    const res = this.session.getItem(key)
    return isJsonString(res) ? JSON.parse(res) : res;
  }

  /**
   * 删除数据
   * @param {*} key 删除数据键名
   */
  remove(key) {
    if (!key || !this.isSupport()) return;
    const data = this.session;
    delete data[key];
    delete data[`${key}__expires__`];
    this.session.removeItem(key);
  }

  /**
   * 清除缓存
   */
  clear() {
    this.session.clear();
  }

  /**
   * 是否支持sessionStorage
   */
  isSupport() {
    return ('sessionStorage' in window) && window.sessionStorage !== null;
  }

  init() {
    const reg = new RegExp('__expires__');
    const data = this.session;
    const list = Object.keys(data);
    if (list.length > 0) {
      list.map((k, v) => {
        if (!reg.test(k)) {
          const now = Date.now();
          const expires = data[`${k}__expires__`] || Date.now + 1;
          if (now > expires) {
            this.remove(k);
          }
        }
        return k;
      });
    }
  }
}


/**
 * 导出单例
 */
const Session = new Storage();

export default Session;
