/**
 * ea 日志上报
 * 本地不上报
 */

import { isFunction } from '../type';

const ea = window.ea;
const ENV = process.env;
const EGG_SERVER_ENV = ENV.EGG_SERVER_ENV || 'local';

const USE_EA_LOG =
    EGG_SERVER_ENV === 'local' || EGG_SERVER_ENV === 'undefined' ? false : true;

export function error(errTitle, options) {
    if (isFunction(ea)) {
        ea('log', errTitle, {
            level: 'error',
            tags: {
                ...options,
            },
        });
    } else {
        console.error(errTitle, JSON.stringify(options));
    }
}

export function warn(errTitle, options) {
    if (isFunction(ea)) {
        ea('log', errTitle, {
            level: 'warning',
            tags: {
                ...options,
            },
        });
    } else {
        console.warn(errTitle, JSON.stringify(options));
    }
}

export function info(errTitle, options) {
    if (isFunction(ea)) {
        ea('log', errTitle, {
            level: 'info',
            tags: {
                ...options,
            },
        });
    } else {
        console.info(errTitle, JSON.stringify(options));
    }
}

export function debug(errTitle, options) {
    if (isFunction(ea)) {
        ea('log', errTitle, {
            level: 'debug',
            tags: {
                ...options,
            },
        });
    } else {
        console.debug(errTitle, JSON.stringify(options));
    }
}

export function eaCatch(errTitle) {
    if (isFunction(ea)) {
        ea('catch', errTitle);
    } else {
        console.log(errTitle);
    }
}


export { feLinkReport, apiLinkReport} from './eaLink';