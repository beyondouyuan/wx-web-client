import * as utilLogger from './logger';
import { isJsonString } from './type';

/**
 * 封装LocalStorage
 */
class Storage {
    constructor() {
        this.local = window.localStorage;
        this.init();
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

        try {
            this.local.setItem(key, value);
            if (expired) {
                this.local[`${key}__expires__`] =
                    Date.now() + 1000 * 60 * Number(expired);
            }
        } catch (error) {
            if (
                error.name === 'QuotaExceededError' ||
                error.name === 'QUOTA_EXCEEDED_ERR'
            ) {
                utilLogger.error('localStorage超过存储限制！', {
                    error: JSON.stringify(error)
                });

                const data = this.local;
                for (const item in data) {
                    // 若key是CRD_ZZC开头（国内租车，则remove该key的缓存后继续存储）
                    if (data.hasOwnProperty(item) && item.includes('CRD_ZZC_')) {
                        this.local.removeItem(item);
                    }
                }
                // 再试一次
                try {
                    this.local.setItem(key, value);
                    if (expired) {
                        this.local[`${key}__expires__`] =
                            Date.now() + 1000 * 60 * Number(expired);
                    }
                } catch (error) {}
            }
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
        const expired = this.local[`${key}__expires__`] || Date.now + 1;
        const now = Date.now();
        if (now > expired) {
            this.remove(key);
            return;
        }
        const res = this.local.getItem(key)
        return isJsonString(res) ? JSON.parse(res) : res;
    }

    /**
     * 删除数据
     * @param {*} key 删除数据键名
     */
    remove(key) {
        if (!key || !this.isSupport()) return;
        const data = this.local;
        delete data[key];
        delete data[`${key}__expires__`];
        this.local.removeItem(key);
    }

    /**
     * 清除缓存
     */
    clear() {
        this.local.clear();
    }

    init() {
        const reg = new RegExp('__expires__');
        const data = this.local;
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

    /**
     * 是否支持localStorage
     */
    isSupport() {
        return 'localStorage' in window && window.localStorage !== null;
    }
}

/**
 * 导出单例
 */
const Local = new Storage();

export default Local;
