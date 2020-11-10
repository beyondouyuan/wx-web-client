import Local from './local-storage';

const MAX_CITY_LIMIT = 10;
const MAX_LAND_LIMT = 3;

/**
 * 缓存用户选择的城市/地标
 */
class UserSelectHistory {
    constructor(key) {
        this.key = key;
    }

    get({ type = '', name = '', slice = false } = {}) {
        return new Promise(resolve => {
            const data = Local.get(this.key) || [];
            let res = [];
            if (type === 'land') {
                res = data.filter(item => {
                    return item.cityName === name ? item : null;
                });
            } else {
                res = data.filter(item => (item.cityName ? item : null));
            }
            if (slice) {
                resolve(res.slice(0, 3));
            } else {
                resolve(res);
            }
        });
    }

    save(data, uniqueProp) {
        const HISTORY_LIST = Local.get(this.key);
        if (uniqueProp === 'cityName') {
            const DELET_LENGTH = HISTORY_LIST ? HISTORY_LIST.length - MAX_CITY_LIMIT : -1;
            if (DELET_LENGTH >= 0) {
                HISTORY_LIST.splice(MAX_CITY_LIMIT - 1, MAX_CITY_LIMIT);
                Local.set(this.key, HISTORY_LIST);
            }
        }
        if (uniqueProp === 'name') {
            const CITY_LAND_LIST = HISTORY_LIST
                ? HISTORY_LIST.filter(item => item.cityCode === data.cityCode)
                : [];
            const DELET_LENGTH = CITY_LAND_LIST
                ? CITY_LAND_LIST.length - MAX_LAND_LIMT
                : -1;
            if (DELET_LENGTH >= 0) {
                HISTORY_LIST.map((item, index) => {
                    if (item.cityCode === data.cityCode) {
                        HISTORY_LIST.splice(index, 1);
                    }
                });
                CITY_LAND_LIST.splice(MAX_LAND_LIMT - 1, MAX_LAND_LIMT);
                const NEW_HISTORY_LIST = [...HISTORY_LIST, ...CITY_LAND_LIST];
                Local.set(this.key, NEW_HISTORY_LIST);
            }
        }
        let uniquePropNmae = uniqueProp === 'name' ? uniqueProp : 'cityName';
        this.get().then(res => {
            // 只保留最近最新的三个 保存前先去重
            let result = res;
            result.unshift(data);
            result = unique(result, uniquePropNmae);
            Local.set(this.key, result, 60 * 24 * 30 * 3); // 三个月
        });
    }

    remove() {
        Local.remove(this.key);
    }

    removeById(id) {
        this.get().then(res => {
            res.splice(res.findIndex(item => item.id === id), 1);
            Local.set(this.key, res);
        });
    }
}

/**
 * 根据属性名prop去重
 * @param {*} arr 数组
 * @param {*} prop 数组对象中的属性
 */
function unique(arr, prop) {
    const hash = {};
    arr = arr.reduce((item, next) => {
        if (hash[next[`${prop}`]]) {
            hash[next[`${prop}`]] = false;
        } else {
            hash[next[`${prop}`]] = true;
            item.push(next);
        }
        return item;
    }, []);
    return arr;
}

export default UserSelectHistory;
