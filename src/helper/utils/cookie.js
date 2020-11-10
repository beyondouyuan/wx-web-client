import Cookie from 'js-cookie';
import { getTopDomain } from '@/utils/url';

const COOKIE_LIST = {
    CDB_UID: 'cdb_uid',
    CDB_SSO_TOKEN: 'cdb_sso_token',
    CDB_S_TIME: 'cdb_sTime',
    CDB_CHEAT: 'cdb_ct',
    USER_ACTION_ID: 'user_action_id',
    M_BOOK_CSRF_TOKEN: 'csrfToken',
    CRD_RISK_CSESSION: '_crd_risk_id',
    CRD_RISK_TOKEN: '_crd_risk_token'
};
/**
 * 获取cookie
 * @param {string} k cookie名
 */
export function get(k) {
    return Cookie.get(k);
}

/**
 * 设置cookie
 * @param {string} k cokkie名
 * @param {string} v cookie值
 * @param {string} o  cookie选项
 */
export function set(k, v, o) {
    return Cookie.set(k, v, o);
}

export function getServerCode() {
    return Cookie.get(COOKIE_LIST.USER_ACTION_ID);
}

export function getUserId() {
    return Cookie.get(COOKIE_LIST.CDB_UID) || '';
}

export function getToken() {
    return Cookie.get(COOKIE_LIST.M_BOOK_CSRF_TOKEN);
}

export function getChartCookie() {
    return Cookie.get(COOKIE_LIST.CDB_CHEAT) === '1';
}

export function setCheatCookie(bool) {
    const topDomain = getTopDomain();
    if (bool) {
        return set(COOKIE_LIST.CDB_CHEAT, '1', {
            path: '/zijia/',
            domain: `.zuzuche.${topDomain}`,
        });
    } else {
        return removeCookie(COOKIE_LIST.CDB_CHEAT);
    }
}

export function removeCookie(n) {
    const topDomain = getTopDomain();
    return Cookie.remove(n, { path: '/zijia/', domain: `.zuzuche.${topDomain}` });
}


export function setCsession(v) {
    const topDomain = getTopDomain();
    if (v) {
        // 只缓存一小时
        const hour = new Date(new Date().getTime() + 60 * 60 * 1000)
        return set(COOKIE_LIST.CRD_RISK_CSESSION, v, {
            path: '/zijia/',
            domain: `.zuzuche.${topDomain}`,
            expires: hour
        });
    } else {
        return removeCookie(COOKIE_LIST.CRD_RISK_CSESSION);
    }
}

export function setRiskToken(v) {
    const topDomain = getTopDomain();
    if (v) {
        // 只缓存一小时
        const hour = new Date(new Date().getTime() + 60 * 60 * 1000)
        return set(COOKIE_LIST.CRD_RISK_TOKEN, v, {
            path: '/zijia/',
            domain: `.zuzuche.${topDomain}`,
            expires: hour
        });
    } else {
        return removeCookie(COOKIE_LIST.CRD_RISK_TOKEN);
    }
}

