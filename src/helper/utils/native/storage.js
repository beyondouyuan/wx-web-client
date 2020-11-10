import { isApp } from './index';
import zzc from '../zzc';

/**
 * 存储到app
 * @param {*} n 命名空间
 * @param {*} k 密钥
 * @param {*} v 内容
 */
export function localStorageSetItem(n = 'ZZCCrcAppLocalStorage', k, v) {
    if (isApp()) {
        zzc.call('base_localStorageSetItem', {
            namespace: n,
            key: k,
            value: v,
        });
    }
}

export function localStorageSetItems(n = 'ZZCCrcAppLocalStorage', obj) {
    if (isApp()) {
        zzc.call('base_localStorageSetItem', {
            namespace: n,
            keyValues: obj,
            success: function(response) {
                console.log(1991, response);
            },
        });
    }
}

export function localStorageGetItem(n = 'ZZCCrcAppLocalStorage', k) {
    return new Promise(resolve => {
        if (isApp()) {
            zzc.call('base_localStorageGetItem', {
                namespace: n,
                key: k,
                success: function(response) {
                    resolve(response);
                },
            });
        }
    });
}

export function localStorageGetAllItem(n = 'ZZCCrcAppLocalStorage') {
    return new Promise(resolve => {
        if (isApp()) {
            zzc.call('base_localStorageAllItems', {
                namespace: n,
                success: function(response) {
                    console.log(899008, JSON.parse(response.data));
                    resolve(response);
                },
            });
        }
    });
}

export function localStorageRemoveItem(n = 'ZZCCrcAppLocalStorage', k) {
    if (isApp()) {
        zzc.call('base_localStorageRemoveItem', {
            namespace: n,
            key: k,
        });
    }
}
