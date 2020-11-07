import { isEmptyObject } from './type';
const baseURL = '/';

function formatJump(link) {
    window.location.href = link;
}

function formatReplaceUrl(link) {
    window.location.replace(link);
}

/**
 * 页面跳转函数
 * use example
 * jumpLink({
 *  url: '/detail',
 *  params: {
 *    orderId: '1234'
 *  }
 * })
 * @param {object} param 参数
 * @param {string} param.url 跳转目标链接
 * @param {object} param.params 链接参数
 * @param {string} param.ZZCAppArg app Webview加载页面的事件方法 'jsloadingicon,nowebviewslide,selfopenpage'等
 */

export function jumpLink({ url, params }) {
    formatJump(generateLink({ url, params }));
}

/**
 * 使用replace方式跳转
 * @param {*} param0
 */
export function jumpLinkUseReplace({ url, params }) {
    formatReplaceUrl(generateLink({ url, params }));
}

// 合并参数并生成一个url
export function generateLink({ url, params }) {
    const httpReg = /^((https|http|ftp|rtsp|mms)?:\/\/)/gi;
    // 首页
    let link = '/';


    if (!httpReg.test(url)) {
        // 非首页 拼接参数
        if (url !== link && url !== '/') {
            const slashReg = /^(\/)/gi;
            // 以'/'开头
            const slash = slashReg.test(url);

            if (!isEmptyObject(params)) {
                link = slash
                    ? `${url}?${formatParams(params)}`
                    : `${baseURL}${url}?${formatParams(params)}`;
            } else {
                link = slash
                    ? `${url}`
                    : `${baseURL}${url}`;
            }
        } else {
            link = '/';
        }
    } else {
        link = url;
    }
    return link;
}

export const getQueryString = key => {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`);
    const result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
};

export const formatParams = (params, pure = true) => {
    // 先扁平化一次参数对象，以防止传入深层结构
    params = flattenObject(params);
    const arr = [];
    Object.keys(params).forEach(key => {
        if ({}.hasOwnProperty.call(params, key)) {
            if (params[key] === undefined) {
                console.error(`formatParams: 传参的键${key}的值为undefined，已丢弃`);
            } else {
                pure
                    ? arr.push(
                          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
                      )
                    : arr.push(`${key}=${params[key]}`);
            }
        }
    });
    return arr.join('&');
};

export const parseSearchParams = () => {
    const { search } = window.location;
    const result = {};
    const searchArray = search
        ? search
              .substring(1)
              .split('&')
              .map(s => s.split('='))
        : [];

    searchArray.forEach(search => {
        result[search[0]] = decodeURIComponent(search[1]);
    });

    return result;
};

export const parseQueryString = url => {
    const result = {};
    const paraString = url
        ? url
              .substring(url.indexOf('?') + 1, url.length)
              .split('&')
              .map(s => s.split('='))
        : [];

    paraString.forEach(search => {
        result[search[0]] = decodeURIComponent(search[1]);
    });
    return result;
};

export function replaceQueryString(url, params) {
    let newUrl = '';
    for (let key in params) {
        const reg = eval(`/(${key}=)([^&]*)/gi`);
        newUrl = url.replace(reg, `${key}=${params[key]}`);
        url = newUrl;
    }
    return url;
}

// 删除url种的查询字段
export function deleteQueryString(url, params) {
    params.forEach(param => {
        url = url.replace(new RegExp(`&?${param}=[^&]*`, 'g'), '');
    });
    if (/\?$/.test(url)) {
        url = url.replace('?', '');
    }
    console.log(url);
    return url;
}

export function formatReplaceParams(params = {}, pure) {
    const parseParams = pure
        ? deleteParams({
              ...parseSearchParams(),
              ...params,
          })
        : {
              ...parseSearchParams(),
              ...params,
          };
    return `?${formatParams(parseParams)}`;
}

export function deleteParams(params) {
    Object.keys(params).forEach(key => {
        if ({}.hasOwnProperty.call(params, key)) {
            if (
                params[key] === 'null' ||
                params[key] === 'undefined' ||
                params[key] === null ||
                params[key] === undefined
            ) {
                delete params[key];
            }
        }
    });
    return params;
}

/**
 * 替换url
 * @param {object} params 参数对象
 * @param {boolean} pure 是否删除值为 'null' 'undefined' 的值 默认删除 ⚠️ 注意 是字符串 'undefined' 'null'！
 */
export function replaceParams(params, pure = true) {
    const url = formatReplaceParams(params, pure);
    window.history.replaceState({}, '', url);
}

/**
 * push history state
 * @param {object} params 参数对象
 * @param {string} params.state state 默认为null
 * @param {string} params.title title 默认为空 ''
 * @param {string} params.url url
 */
export function pushState({ state = null, title = '', url = '' }) {
    window.history.pushState(state, title, url);
}

// 获取顶级域名
export function getTopDomain() {
    const regResult = /.([A-Za-z]+)$/gi.exec(location.hostname);

    return regResult ? regResult.pop().toLowerCase() : '';
}

/**
 * 扁平化对象
 * @param {Object} deepMap
 */
function flattenObject(deepMap) {
    var result = {};
    function process(key, value) {
        if (Object(value) !== value) {
            if (key) {
                result[key] = value;
            }
        } else if (Array.isArray(value)) {
            for (var i = 0, len = value.length; i < len; i++) {
                process(key + '[' + i + ']', value[i]);
            }
            if (value.length === 0 && key) {
                result[key] = [];
            }
        } else {
            var isEmpty = true;
            for (var prop in value) {
                isEmpty = false;
                process((key ? key + '.' : key) + prop, value[prop]);
            }
            if (isEmpty && key) {
                result[key] = {};
            }
        }
    }
    process('', deepMap);
    return result;
}

/**
 * 对象反扁平化
 * 将诸如my.name: 'xxx'的属性改成my: {name: 'xxx'}
 * @param {Object} data
 */
function unFlattenObject(data) {
    if (Object(data) !== data || Array.isArray(data)) {
        return data;
    }
    var result = {};
    var r = /\.?([^\.\[\]]+)|\[(\d+)\]/g;
    for (var prop in data) {
        var matchs;
        var cur = result;
        var p = '';
        while ((matchs = r.exec(prop))) {
            cur = cur[p] || (cur[p] = matchs[2] ? [] : {});
            p = matchs[2] || matchs[1];
        }
        cur[p] = data[prop];
    }
    return result[''] || result;
}
