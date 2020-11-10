/**
 * 客户端环境识别模块
 */
import { isFunction, isString, isRegExp, isObject } from './type';

const win = window;
const navigator = win.navigator;
const userAgent = navigator.userAgent || '';
const appVersion = navigator.appVersion || '';
const vendor = navigator.vendor || '';
const UA = `${userAgent} ${appVersion} ${vendor}`.toLowerCase();

const NA_VERSION = '-1';

const NA = {
    name: 'na',
    version: NA_VERSION,
};

const REG_DEVICES = [
    ['ipad', 'ipad'],
    // ipod 规则应置于 iphone 之前。
    ['ipod', 'ipod'],
    ['iphone', /\biphone\b|\biph(\d)/],
    [
        'samsung',
        ua => {
            if (ua.indexOf('samsung') !== -1) {
                return /\bsamsung(?:[-](?:sgh|gt|sm))?-([a-z0-9]+)/;
            }
            return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/;
        },
    ],
    ['android', /\bandroid\b|\badr\b/],
    // 小米
    ['mi', /\bmi[ -]?([a-z0-9 ]+(?= build|\)))/],
    // 红米
    ['hongmi', /\bhm[ -]?([a-z0-9]+)/],
    [
        'meizu',
        ua => {
            return ua.indexOf('meizu') >= 0
                ? /\bmeizu[/ ]([a-z0-9]+)\b/
                : /\bm([0-9cx]{1,4})\b/;
        },
    ],
    ['nexus', /\bnexus ([0-9s.]+)/],
    [
        'huawei',
        ua => {
            const RE_MEDIAPAD = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
            if (ua.indexOf('huawei-huawei') !== -1) {
                return /\bhuawei-huawei-([a-z0-9-]+)/;
            }
            if (RE_MEDIAPAD.test(ua)) {
                return RE_MEDIAPAD;
            }
            return /\bhuawei[ _-]?([a-z0-9]+)/;
        },
    ],
    ['oppo', /\boppo[_ ]([a-z0-9]+)/],
];

const REG_BROWSER = [
    // 探途旅行
    ['tantutravel', /\/com\.tantu\.travel\/([0-9.]+)/],
    // 探途地图
    ['tantumap', /\/com\.tantu\.map(?:[\w\d.]+|)\/([0-9.]+)/],
    // 租租车
    ['zuzuche', /zzc(?:ios|android)\/([0-9.]+)/],
    // 租租车福利版
    ['rewards', /zzc(?:ios|android)\/rewards\/([0-9.]+)/],
    // 骑士卡
    ['black', /zzc(?:ios|android)\/black\/([0-9.]+)/],
    // 国内租车
    ['crc', /zzc(?:ios|android)\/crc\/([0-9.]+)/],
    // 头条小程序
    [
        'toutiaomicroapp',
        function (ua) {
            if (ua.toLowerCase().indexOf('toutiaomicroapp') >= 0) {
                return /\bToutiaoMicroApp\/([0-9.]+)/i;
            } else if (ua.toLowerCase().indexOf('bytedanceide') >= 0) {
                return /\bbytedanceide\/([0-9.]+)/;
            }
        },
    ],
    // 支付宝小程序
    [
        'alipaymini',
        function (ua) {
            // channelid是支付宝开发工具得到的小程序特有ua标示
            // alipayide/webview/是针对于支付宝开发工具IDE的适配
            if (ua.indexOf('miniprogram') >= 0 || ua.indexOf('alipayide/webview/') >= 0) {
                return /alipayclient\/([0-9.]+)/;
            }
        },
    ],
    // 支付宝 需要放在chrome等浏览器前
    [
        'alipay',
        function (ua) {
            if (ua.indexOf('alipayclient/') >= 0 && ua.indexOf('aliapp') >= 0) {
                return /alipayclient\/([0-9.]+)/;
            }
        },
    ],
    // 微信小程序
    [
        'miniprogram',
        ua => {
            if (
                window.isMiniProgram ||
                ua.indexOf('miniProgram') >= 0 || // 官方文档说明是这个
                ua.indexOf('miniprogram') >= 0 || // 实际浏览器包含的是这个
                window.__wxjs_environment === 'miniprogram'
            ) {
                return /micromessenger\/([0-9.]+)/;
            }
        },
    ],
    // 微信
    [
        'weixin',
        ua => {
            return /\bmicromessenger\/([\d.]+)/.test(ua) && ua.indexOf('wxwork/') === -1;
        },
    ],
    // 企业微信
    [
        'weixinwork',
        ua => {
            return /\bmicromessenger\/([\d.]+)/.test(ua) && ua.indexOf('wxwork/') !== -1;
        },
    ],
    ['qq', /\bm?qqbrowser\/([0-9.]+)/],
    // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
    // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
    [
        'uc',
        ua => {
            if (ua.indexOf('ucbrowser/') >= 0) {
                return /\bucbrowser\/([0-9.]+)/;
            }
            if (ua.indexOf('ubrowser/') >= 0) {
                return /\bubrowser\/([0-9.]+)/;
            }
            if (/\buc\/[0-9]/.test(ua)) {
                return /\buc\/([0-9.]+)/;
            }
            if (ua.indexOf('ucweb') >= 0) {
                // `ucweb/2.0` is compony info.
                // `UCWEB8.7.2.214/145/800` is browser info.
                return /\bucweb([0-9.]+)?/;
            }
            return /\b(?:ucbrowser|uc)\b/;
        },
    ],
    ['weibo', /weibo/],
    ['oppobrowser', /\boppobrowser\/([0-9.]+)/],
    ['chrome', / (?:chrome|crios|crmo)\/([0-9.]+)/],
    // Android 默认浏览器。该规则需要在 safari 之前。
    [
        'android',
        ua => {
            if (ua.indexOf('android') === -1) {
                return false;
            }
            return /\bversion\/([0-9.]+(?: beta)?)/;
        },
    ],
    ['safari', /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
    // 如果不能被识别为 Safari，则猜测是 WebView。
    ['webview', /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
    ['firefox', /\bfirefox\/([0-9.ab]+)/],
];

const REG_ENGINE = [
    [
        'blink',
        () => {
            return 'chrome' in win && 'CSS' in win && /\bapplewebkit[/]?([0-9.+]+)/;
        },
    ],
    ['webkit', /\bapplewebkit[/]?([0-9.+]+)/],
    ['u2', /\bu2\/([0-9.]+)/],
    ['u3', /\bu3\/([0-9.]+)/],
];

// 操作系统信息识别表达式
const REG_OS = [
    [
        'ios',
        ua => {
            if (/\bcpu(?: iphone)? os /.test(ua)) {
                return /\bcpu(?: iphone)? os ([0-9._]+)/;
            }
            if (ua.indexOf('iph os ') !== -1) {
                return /\biph os ([0-9_]+)/;
            }
            return /\bios\b/;
        },
    ],
    [
        'android',
        ua => {
            if (ua.indexOf('android') >= 0) {
                return /\bandroid[ /-]?([0-9.x]+)?/;
            }
            if (ua.indexOf('adr') >= 0) {
                if (ua.indexOf('mqqbrowser') >= 0) {
                    return /\badr[ ]\(linux; u; ([0-9.]+)?/;
                }
                return /\badr(?:[ ]([0-9.]+))?/;
            }
            return 'android';
        },
    ],
];

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression) {
    const expr = isFunction(expression) ? expression.call(null, UA) : expression;
    if (!expr) {
        return null;
    }
    const info = {
        name,
        version: NA_VERSION,
        codename: '',
    };
    if (expr === true) {
        return info;
    }
    if (isString(expr)) {
        if (UA.indexOf(expr) !== -1) {
            return info;
        }
    } else if (isObject(expr)) {
        if (Object.prototype.hasOwnProperty.call(expr, 'version')) {
            info.version = expr.version;
        }
        return info;
    } else if (isRegExp(expr)) {
        const m = expr.exec(UA);
        if (m) {
            if (m.length >= 2 && m[1]) {
                info.version = m[1].replace(/_/g, '.');
            } else {
                info.version = NA_VERSION;
            }
            return info;
        }
    }
    return null;
}

function each(object, factory) {
    for (let i = 0, l = object.length; i < l; i += 1) {
        if (factory.call(object, object[i], i) === false) {
            break;
        }
    }
}

const Detector = {};

Detector.device = (() => {
    let result = NA;
    each(REG_DEVICES, pattern => {
        const d = detect(pattern[0], pattern[1]);
        if (d) {
            const v = parseFloat(d.version);
            result = {
                name: d.name,
                version: v,
                fullVersion: d.version,
            };
            result[d.name] = true;
            return false;
        }
        return true;
    });
    return result;
})();

Detector.os = (() => {
    let result = NA;
    each(REG_OS, pattern => {
        const d = detect(pattern[0], pattern[1]);
        if (d) {
            const v = parseFloat(d.version);
            result = {
                name: d.name,
                version: v,
                fullVersion: d.version,
            };
            result[d.name] = true;
            return false;
        }
        return true;
    });
    return result;
})();

Detector.browser = (() => {
    let result = NA;
    each(REG_BROWSER, pattern => {
        const d = detect(pattern[0], pattern[1]);
        if (d) {
            const v = parseFloat(d.version);
            result = {
                name: d.name,
                version: v,
                fullVersion: d.version,
            };
            result[d.name] = true;
            return false;
        }
        return true;
    });
    return result;
})();

Detector.engine = (() => {
    let result = NA;
    each(REG_ENGINE, pattern => {
        const d = detect(pattern[0], pattern[1]);
        if (d) {
            const v = parseFloat(d.version);
            result = {
                name: d.name,
                version: v,
                fullVersion: d.version,
            };
            result[d.name] = true;
            return false;
        }
        return true;
    });
    return result;
})();

export default Detector;
