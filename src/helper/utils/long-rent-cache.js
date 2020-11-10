import Local from './local-storage';

/**
 * 缓存用户上次筛选条件
 */
class LongRentCache {
    constructor() {
        this.key = 'CRD_ZZC_LONG_RENT_CACHE';
    }

    /**
     * 获取用户上次筛选的缓存
     */
    get() {
        return new Promise(resolve => {
            const data = Local.get(this.key) || null;
            resolve(data);
        });
    }

    /**
     * 保存用户上次查询条件
     * @param {object} data 保存数据对象
     */
    save(data) {
        return this.get().then(res => {
            Local.set(
                this.key,
                {
                    ...res,
                    ...data,
                },
                60
            );
        });
    }

    remove() {
        Local.remove(this.key);
    }
}

const Cache = new LongRentCache();

export default Cache;
