import sessionUtils from './session-storage';

/**
 * 对于app而言，每次打开新页面都是一个新的tab
 * 当从林一个页面通过window.history.back返回时，是返回上一个tab
 * 因此对于这类缓存是可以用session的（非跨域面即非跨tab共享信息）
 * 缓存用户变更搜索条件前的搜索条件到session中
 * 【如从首页渠道城市地标页面进行更换取还车城市/地标】
 * 该session在跳转页面钱进行存入
 * 若是用户正常的更换取还车城市地标，那么得到新的取还车城市地标后
 * 只需要清除该session即可
 * 若是用户做“非正常”的骚操作：去城市列表页面看看，但是偏偏不选择城市地标
 * 那么返回时，应该从该session中读取此前的搜索条件缓存，形成记忆功能，然后清除掉
 *
 */
class SearchSessionCache {
    constructor() {
        this.key = 'CRD_ZZC_SEARCH_CONDITION_CACHE';
    }

    /**
     * 获取用户上次筛选的缓存
     */
    get() {
        return new Promise(resolve => {
            const data = sessionUtils.get(this.key) || {};
            resolve(data);
        });
    }

    /**
     * 保存用户上次查询条件
     * @param {object} data 保存数据对象
     */
    save(data) {
        sessionUtils.set(this.key, data);
    }

    remove() {
        sessionUtils.remove(this.key);
    }
}

const SearchConditionCache = new SearchSessionCache();

export default SearchConditionCache;
