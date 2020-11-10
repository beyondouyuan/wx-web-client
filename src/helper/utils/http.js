/**
 * 注意：当前axios封装只是初步版本，尚未定制化
 * HTTP
 * 只能通过本模块接口发起http请求
 */

import axios from 'axios';
import { getToken } from './cookie';
import { handleLogin, isOneOfMiniprograms } from './native';

const {
    prefix: { PREFIX_API },
} = projectConfig;

const CancelToken = axios.CancelToken;
const pending = {};
/**
 * 生成请求标识
 * @param {object} config
 */
const generateIdentify = config => {
    const { url, method } = config;
    const slashReg = /^(\/)/gi;
    const slash = slashReg.test(url);
    return url.includes(`${PREFIX_API}`)
        ? `${url}&${method}`
        : slash
            ? `${PREFIX_API}${url}&${method}`
            : `${PREFIX_API}/${url}&${method}`;
};

/**
 * 从队列中移除重复的请求
 * @param {string} key
 * @param {boolena} isRequest
 */
const removePending = (key, isRequest = false) => {
    if (pending[key] && isRequest) {
        pending[key]('取消重复请求');
        delete pending[key];
    }
};

const interceptors = {
    enctypeRequestData(config) {
        const { useCancel } = config;
        // 拦截重复请求(即当前正在进行的相同请求)
        let requestData = generateIdentify(config);
        useCancel && removePending(requestData, useCancel);
        config.cancelToken = new CancelToken(c => {
            pending[requestData] = c;
        });
        config.headers['x-csrf-token'] = getToken();
        return config;
    },

    checkApiResponse(response) {
        const body = response ? response.data : {};
        const config = response ? response.config : undefined;
        if (!body) {
            throw new ApiServiceError(config, '没响应数据', 500);
        }
        if (body.code !== 0) {
            // 未登录
            if (body.code === 106) {
                handleLogin(window.location.href);
            } else {
                if (!config.extraCode) {
                    // 抛出body.data是为了应对诸如验价时，返回的code是非0时，同时data又不为空，且需要取出此时的data
                    throw new ApiPHPError(config, `${body.msg}`, body.code, body.data);
                }
            }
        }
        // 把已经完成的请求从 pending 中移除
        const requestData = generateIdentify(config);
        removePending(requestData);
        return body;
    },

    /**
     * ⚠：仅用于开发环境！
     * 缓存接口响应数据
     * 开发时用于后端接口异常
     * 前端页面依赖接口数据
     **/
    cacheResponse(response) {
        const body = response ? response.data : {};
        const config = response ? response.config : undefined;
        const DB_NAME = 'resCache';
        const TABLE_NAME = 'index';
        const DB_VERSION = 1;
        const openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

        /**
         * 将数据保存到数据库, 有则替换，没有则新建
         * @param {} db -
         */
        function put(db) {
            return new Promise((res, rej) => {
                const result = db
                    .transaction(TABLE_NAME, 'readwrite')
                    .objectStore(TABLE_NAME)
                    .put({
                        path: config.url,
                        data: body,
                    });

                result.onsuccess = function (e) {
                    console.log(
                        `${config.url} 的请求结果已加入数据库${DB_NAME}的${TABLE_NAME}表中\n`,
                        e
                    );
                    res(e);
                };

                result.onerror = function (e) {
                    console.error(
                        `${config.url} 的请求结果未能加入数据库${DB_NAME}的${TABLE_NAME}表中，原因：\n`
                    );
                    console.dir(result.error);
                    rej(e);
                };
            });
        }

        // 从数据库读取数据
        function get(db) {
            return new Promise(res => {
                const result = db
                    .transaction([TABLE_NAME], 'readwrite')
                    .objectStore(TABLE_NAME)
                    .get(config.url);

                result.onsuccess = e => {
                    const result = e.target.result;

                    if (result) {
                        alert(
                            `由于${config.url}接口异常，该响应是从IndexedDB中读取的，请查看network进行排错`
                        );
                        res({
                            ...response,
                            status: 200,
                            data: result.data,
                        });
                    }
                    res(response);
                };

                result.onerror = () => {
                    res(response);
                };
            });
        }

        return new Promise(res => {
            openRequest.onsuccess = function (e) {
                const db = e.target.result;

                if (body && body.code === 0) {
                    // 正常数据返回则保存到数据库
                    put(db);
                    res(response);
                } else {
                    // 否则从数据库中取出数据
                    res(get(db));
                }
            };

            openRequest.onupgradeneeded = function (e) {
                const db = e.target.result;

                // 建表
                if (!db.objectStoreNames.contains(TABLE_NAME)) {
                    const objectStore = db.createObjectStore(TABLE_NAME, {
                        keyPath: 'path',
                    });
                    objectStore.createIndex('path', 'path', { unique: true });
                }
            };
        });
    },
};

/**
 * 重试请求。依赖配置：
 * `config.retry = 1`
 * `config.retryDelay`
 * @param {*} instance axios实例
 */
function createRetryInterceptor(instance = axios) {
    return function retryInterceptor(error) {
        const { config } = error;
        if (axios.isCancel(error)) {
            return Promise.reject(new CancelError(config, error.message));
        }
        if (!config || !config.retry) {
            return Promise.reject(error);
        }

        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount >= config.retry) {
            return Promise.reject(error);
        }

        config.__retryCount += 1;
        const delay = new Promise(resolve => {
            setTimeout(resolve, config.retryDelay);
        });
        config.url = config.url.replace(config.baseURL, '/');
        return delay.then(() => instance(config));
    };
}

const baseHeaders = {
    'Content-Type': 'application/json',
};

const $traceId = document.querySelector('meta[name="ea-trace-id"]');
let traceId = '';
if ($traceId) {
    traceId = $traceId.getAttribute('content') || '';
}
if (traceId) {
    baseHeaders['x-trace-id'] = traceId;
}
if (isOneOfMiniprograms()) {
    baseHeaders['ua'] = 'miniprogram';
}
const apiService = axios.create({
    baseURL: `${PREFIX_API}/`,
    headers: baseHeaders,
    method: 'GET',
    retry: 0,
    retryDelay: 600,
    useCancel: false,
    // extraCode针对调用外部系统响应参数code与本系统不一致的问题
    extraCode: false,
});

apiService.interceptors.request.use(interceptors.enctypeRequestData);
// 启用后，当后端异常将会响应indexedDB中的缓存。
// apiService.interceptors.response.use(interceptors.cacheResponse);
// 这个拦截器要放在响应拦截器的最后，因为它返回的response是response.data
apiService.interceptors.response.use(interceptors.checkApiResponse);
// apiService.interceptors.response.use(undefined, createRetryInterceptor(apiService));

/**
 * 错误源：
 * 1. nodeAPI 代理：ApiServiceError
 * 2. PHP网关代理：ApiPHPError
 * 3. 取消请求：CancelError
 */
class AxiosInterceptorError extends Error {
    constructor(config, message, code = 666) {
        super(message);
        this.name = 'AxiosInterceptorError';
        this.code = code;
        this.config = config;
    }
}

class ApiServiceError extends AxiosInterceptorError {
    constructor(config, message, code) {
        super(config, message, code);
        this.name = 'ApiServiceError';
        this.message = message;
    }
}

export class ApiPHPError extends AxiosInterceptorError {
    constructor(config, message, code, data) {
        super(config, message, code);
        this.name = 'ApiPHPError';
        this.code = code;
        this.message = message;
        this.data = data
    }
}

export class CancelError extends AxiosInterceptorError {
    constructor(config, message = '取消', code = 666) {
        super(config, message, code);
        this.name = 'CancelError';
    }
}

/**
 * get请求
 * @param {string} url 请求路径
 * @param {object} params 请求参数
 * @param {object} options 配置参数
 */
const apiGet = (url, params, options) => {
    return apiService({
        url,
        method: 'GET',
        params,
        ...options,
    });
};

/**
 * post请求
 * @param {string} url 请求路径
 * @param {object} data 提交数据
 * @param {object} options 配置参数参数
 */
const apiPost = (url, data, options) => {
    return apiService({
        url,
        method: 'POST',
        data,
        ...options,
    });
};

/**
 * apiProxy用于请求其他系统的ajax
 */
const apiProxy = axios.create({
    baseURL: `${PREFIX_API}/`,
    timeout: 5000,
    method: 'POST',
    withCredentials: true,
});

/**
 * request
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
apiProxy.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
/**
 * response
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
apiProxy.interceptors.response.use(
    response => {
        return Promise.resolve(response.data);
    },
    error => {
        return Promise.reject(error);
    }
);

const proxyGet = (url, params, options) => {
    return apiProxy({
        url,
        method: 'GET',
        params,
        ...options,
    });
};

const proxyPost = (url, data, options) => {
    return apiProxy({
        url,
        method: 'POST',
        data,
        ...options,
    });
};

export { apiService, apiGet, apiPost, proxyGet, proxyPost };
