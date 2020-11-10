/**
 * url拦截
 */

import { parseSearchParams } from '@utils/url';

export function hideCRCTopBar() {
    // CRCAppArg需要encode。。。。
    const { CRCAppArg } = parseSearchParams();
    let hide = false;
    if (CRCAppArg) {
        const args = CRCAppArg.split(',');
        hide = args.some(item => item === 'hideTopBar=true');
    }
    return hide;
}

export function hideOpenApp() {
    // CRCAppArg需要encode。。。。
    const { CRCAppArg } = parseSearchParams();
    let hide = false;
    if (CRCAppArg) {
        const args = CRCAppArg.split(',');
        hide = args.some(item => item === 'hideOpenApp=true');
    }
    return hide;
}

/**
 * 驼峰转下划线
 * @param {string} name 需要变更的字符串
 */
export function humpToLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 版本号转换为数值
 * @param {*} version
 * @param {*} length
 * @param {*} exponent
 */
export function versionToNumber(version, length, exponent) {
    let arr = [];
    if (arguments.length < 3) {
        return 0;
    }
    arr = version.split('.');
    version = 0;
    arr.forEach(function(value, index, array) {
        version += value * Math.pow(10, length * exponent - 1);
        length--;
    });
    return version;
}

/*
 * compare version
 * 比较版本号
 * 仅适用数字型的版本号
 * 0: 相等
 * 1: 大于
 * -1: 小于
 */
/**
 *
 * @param {*} version 当前版本号
 * @param {*} targetVersion 目标版本号
 * @param {*} exponent
 */
export function versionCompare(version, targetVersion, exponent) {
    let getVersionNumber, length;
    exponent = exponent || 2;
    if (!version || !targetVersion) {
        throw new Error('Need two versions to compare!');
    }
    if (version === targetVersion) {
        return 0;
    }
    length = Math.max(version.split('.').length, targetVersion.split('.').length);
    getVersionNumber = (function(length, exponent) {
        return function(version) {
            return versionToNumber(version, length, exponent);
        };
    })(length, exponent);
    version = getVersionNumber(version);
    targetVersion = getVersionNumber(targetVersion);
    return version > targetVersion ? 1 : version < targetVersion ? -1 : 0;
}

// console.log(versionCompare('1.0.4', '1.0.3', 3))
