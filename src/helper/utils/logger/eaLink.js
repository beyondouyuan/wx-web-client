
/**
 * ea feLink 日志上报
 */
import { isFunction } from '../type';

const ea = window.ea;

export function feLinkReport(data = {}) {
    const setting = {
        level: 1,
        ...data
    };
    if (isFunction(ea)) {
        ea('log', 'feLink', setting);
    } else {
        console.log(`tj:${setting?.category} ${setting?.action} ${setting?.label}`)
    }
}

export function apiLinkReport(data = {}) {
    const setting = {
        level: 1,
        platform: 'h5',
        ...data
    };
    if (isFunction(ea)) {
        ea('log', 'apiLink', setting);
    } else {
        console.log(`apiTJ:${setting?.category} ${setting?.action} ${setting?.label}`)
    }
}