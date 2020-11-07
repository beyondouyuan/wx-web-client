import axios from 'axios'
import { getToken } from './storage'


const localToken = getToken()

/**
 * [创建axios 实例]
 * @type {[type]}
 */
// 初始化请求配置
const service = axios.create({
    baseURL: '/'
    // baseURL: baseAPI,
})

/**
 * [统一拦截请求]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
service.interceptors.request.use(config => {
    console.log(config)
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers = {
        ...config.headers,
        ...config.header
    }
    config.data.code = localToken.code;
    config.data.state = localToken.state
    return config
}, error => {
    // console.log(error) // 打印测试
    return Promise.reject(error)
})
/**
 * [统一拦截响应]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
service.interceptors.response.use(
    response => {
        const body = response ? response.data : {};
        return body;
    },
    error => {
        return Promise.reject(error)
    }

)



/**
 * get请求
 * @param {string} url 请求路径
 * @param {object} params 请求参数
 * @param {object} options 配置参数
 */
const apiGet = (url, params, options) => {
    return service({
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
    return service({
        url,
        method: 'POST',
        data,
        ...options,
    });
};


/**
 * put请求
 * @param {string} url 请求路径
 * @param {object} data 提交数据
 * @param {object} options 配置参数参数
 */
const apiPut = (url, data, options) => {
    return service({
        url,
        method: 'PUT',
        data,
        ...options,
    });
};

/**
 * delete请求
 * @param {string} url 请求路径
 * @param {object} data 提交数据
 * @param {object} options 配置参数参数
 */
const apiDelete = (url, data, options) => {
    return service({
        url,
        method: 'DELETE',
        data,
        ...options,
    });
};

export { apiGet, apiPost, apiPut, apiDelete };

export default service;