import { locationHref } from './utils/index';
import detector from '@/utils/detector';
import { isIos, isAndroid } from './utils/detector';

export function iframeCall(url) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('style', 'display:none');
    document.body.appendChild(iframe);
    setTimeout(function () {
        document.body.removeChild(iframe);
    }, 200);
}

export const setTimeEvent = (() => {
    let timer;
    return (timeout = 1000) => new Promise((resolve, reject) => {
        let haveChange = false;

        let property = 'hidden',
            eventName = 'visibilitychange';
        if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
            property = 'hidden';
            eventName = 'visibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            property = 'msHidden';
            eventName = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            property = 'webkitHidden';
            eventName = 'webkitvisibilitychange';
        }

        const pageChange = function (e) {
            haveChange = true;
            if (timer) clearTimeout(timer);
            if (document[property] || e.hidden || document.visibilityState == 'hidden') {
                resolve('用户界面已隐藏，调起成功');
            } else {
                reject('用户界面显示状态未知');
            }
            // document.removeEventListener('pagehide', pageChange);
            document.removeEventListener(eventName, pageChange);
            document.removeEventListener('baiduboxappvisibilitychange', pageChange);
        };
        // window.addEventListener('pagehide', pageChange, false);
        document.addEventListener(eventName, pageChange, false);
        document.addEventListener('baiduboxappvisibilitychange', pageChange, false);


        timer = setTimeout(function () {
            if (haveChange) {
                return;
            }
            // document.removeEventListener('pagehide', pageChange);
            document.removeEventListener(eventName, pageChange);
            document.removeEventListener('baiduboxappvisibilitychange', pageChange);
            if (!document.hidden && !haveChange) {
                reject('用户界面未隐藏，调起失败');
            } else {
                reject('用户界面显示状态未知');
            }
            haveChange = true;
        }, timeout);
    });
})();

export default function open(targetUrl, timeout) {
    if (!targetUrl) {
        return;
    }
    if (detector.browser.name == 'safari' && detector.os.version >= 9 && isIos) {
        locationHref(targetUrl);
    } else if (isAndroid && detector.browser.name == 'chrome' && detector.browser.version > 55) {
        locationHref(targetUrl);
    } else {
        iframeCall(targetUrl);
    }
    return setTimeEvent(timeout);
}
