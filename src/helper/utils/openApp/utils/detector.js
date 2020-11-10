import Detector from '@/utils/detector';

export function isApp() {
    return Detector.browser.black ||
        Detector.browser.zuzuche ||
        Detector.browser.crc;
}

export function isZZCApp() {
    return Detector.browser.zuzuche;
}

/**
 * 是否为骑士卡app
 */
export function isBlackApp() {
    return Detector.browser.black;
}

/**
 * 是否为国内租租车app
 */
export function isCrcApp() {
    return Detector.browser.crc;
}

/*
 * 是否位微信app
 */
export function isWeixin() {
    return Detector.browser.weixin
}

/**
 * 是否IOS
 */
export function isIos() {
    return Detector.os.ios;
}

/**
 * 是否android
 */
export function isAndroid() {
    return Detector.os.android;
}

// const ua = window.navigator ? window.navigator.userAgent.toLowerCase() : '';

// export const iOSWebView = isIOS && !/version.+safari/.test(ua);
// export const iOSSafari = isIOS && !iOSWebView;

// export const QQBrowser = /qqbrowser/.test(ua);
// export const isWeiXin = /\bmicromessenger\/([\d.]+)/.test(ua) && ua.indexOf('wxwork/') === -1;
// export const isWeiXinWork = /\bmicromessenger\/([\d.]+)/.test(ua) && ua.indexOf('wxwork/') !== -1;
