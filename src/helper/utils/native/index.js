import zzc from '../zzc';
import Detector from '../detector';
import { getUserId } from '../cookie';
import { jumpLink } from '../url';
import { versionCompare } from '../tools';
import DateUitl from '../date';

const defaulHost = 'https://m.zuzuche.net';
const prodHost = 'https://m.zuzuche.com';
const netHost = 'https://m_cn_rental.zuzuche.net';

const env = process.env.EGG_SERVER_ENV;

const { protocol, hostname, port } = window.location;

// 除正是环境使用.com外，其他环境均跳转值.net

const isProd = hostname.includes('.com');
export const baseHost = isProd ? prodHost : defaulHost;
export const orderHost = isProd ? prodHost : netHost;
/**
 * 是否为原生应用
 */
export function isApp() {
    return Detector.browser.black || Detector.browser.zuzuche || Detector.browser.crc || Detector.browser.rewards;
}

/**
 * 用于区分原生应用是租租车还是骑士卡app
 * 是否为租租车app
 */
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

export function isRewardsApp() {
    return Detector.browser.rewards;
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

export function isAlipay() {
    return Detector.browser.alipay;
}

export function isWeiXin() {
    return Detector.browser.weixin;
}

// 微信小程序
export function isMiniprogram() {
    return Detector.browser.miniprogram;
}
// 支付宝小程序
export function isAliPayMiniprogram() {
    return Detector.browser.alipaymini;
}
// 字节跳动小程序
export function isByteDanceMiniprogram() {
    return Detector.browser.toutiaomicroapp;
}

// 是小程序
export function isOneOfMiniprograms() {
    return isMiniprogram() || isAliPayMiniprogram() || isByteDanceMiniprogram()
}
/**
 * @desc 探测App是否支持某插件
 */
export function isAppSupportPlugin(pluginName) {
    if (pluginName == null || pluginName == undefined || '') {
        return false;
    }
    return !!window.zzcjsbridge && !!window.zzcjsbridge[pluginName];
}

/**
 * 登陆处理函数封装，包括原生和H5登陆
 * 由于ios和安卓兼容问题 使用/login/v2sourceUrl和/login/?sourceUrl，在调用onLoginStatusChange监听时
 * 得到的gourl会表现不一致，为了ios和安卓的表现一致性，不采用推荐的/v2
 * @param {string} uri 登陆后需要返回的页面uri，用于登陆返回
 */
export function handleLogin(uri) {
    const url = generateLink(uri);
    let login = `${baseHost}/account/login.php?goback=1`;
    if (isZZCApp() || isCrcApp() || isRewardsApp()) {
        login = `${login}&ref=${url}`
        zzc.call('page_linkTo', {
            url: `/login/v2/?sourceUrl=${encodeURIComponent(`${login}`)}`,
            success: function() {},
        });
    } else if (isMiniprogram()) {
        wx.miniProgram.navigateTo({
            url: `/pages/login/index?goback=${encodeURIComponent(`${url}`)}`,
        });
    } else if (isAliPayMiniprogram()) {
        my.navigateTo({
            url: `/pages/login/index?goback=${encodeURIComponent(`${url}`)}`,
        });
    } else if (isByteDanceMiniprogram()) {
        tt.miniProgram.navigateTo({
            url: `/pages/login/index?goback=${encodeURIComponent(`${url}`)}`,
        });
    } else {
        window.location.href = `${login}&ref=${encodeURIComponent(url)}`;
    }
}

/**
 * 小程序webview跳转到小程序原生
 * @param {object} option
 * @param {string} option.url 地址可带参数
 * @param {string} option.success 跳转成功回调
 * @param {string} option.fail 跳转失败回调
 * @param {string} option.complete 无论成功失败都回调
 * 
 */
export function handleNavigateToLink(option = {}) {
    const {
        url, success, fail, complete
    } = option;
    if (isMiniprogram()) {
        wx.miniProgram.navigateTo({
            url, // 跳回小程序的页面
            success: success || function (res) {
                console.log(res);
            },
            fail: fail || function (rej) {
                console.log(rej);
            },
            complete: complete || function (res) {
                console.log(res);
            }
        });
    } else if (isAliPayMiniprogram()) {
        my.navigateTo({
            url, // 跳回小程序的页面
            success: success || function (res) {
                console.log(res);
            },
            fail: fail || function (rej) {
                console.log(rej);
            },
            complete: complete || function (res) {
                console.log(res);
            }
        });
    } else if (isByteDanceMiniprogram()) {
        tt.miniProgram.navigateTo({
            url: `/pages/login/index?goback=${encodeURIComponent(`${url}`)}`,
        });
    }
}

export function handleToAccount() {
    if (hasLogin()) {
        window.location.href = `${baseHost}/v2/?m=account`;
    } else {
        handleLogin(`${baseHost}/v2/?m=account`);
    }
}

export function handleToOrder() {
    // 国内订单列表页
    // if (hasLogin()) {
    //     jumpLink({
    //         url: '/mine/order',
    //         noBook: true,
    //     });
    // } else {
    //     handleLogin(`/zijia/mine/order`);
    // }

    // 国际订单列表

    if (hasLogin()) {
        jumpLink({
            url: `${orderHost}/account/order.php#show=order`
        });
    } else {
        handleLogin(`${orderHost}/account/order.php#show=order`);
    }

}

/**
 * 返回,识别原生和h5
 */
export function navBack() {
    if (isApp()) {
        // app
        zzc.call('BackToPreviousPage', {
            success: function(o) {
                console.log(o);
            },
        });
        return;
    } else {
        // h5
        window.history.go(-1);
    }
}

/**
 * 设置当前页APP标题
 * @param {*} title 标题
 * @param {*} options 选项
 */
export function setTitle(title = '国内租车', options = {}) {
    if (isApp()) {
        options = { ...options, title };
        zzc.call('webviewtitle', options);
    }
}

/**
 * 设置当前页APP右侧按钮
 * @param {object} options 按钮选项
 */
export function setRightButton(options) {
    if (isZZCApp() || isCrcApp() || isBlackApp() || isRewardsApp()) {
        zzc.call('base_customNavbarRightButton', {
            ...options,
        });
    }
}

/**
 * 隐藏右侧按钮
 * @param {*} options
 */
export function hideRightButton() {
    if (isZZCApp() || isCrcApp() || isBlackApp() || isRewardsApp()) {
        zzc &&
            zzc.call('base_customNavbarRightButton', {
                type: 'text',
                text: '  ',
                success: function(response) {
                    console.log(response);
                },
            });
    }
}

/**
 * 设置列表页标题栏
 * 目前仅租租车app支持
 * @param {*} options
 */
export function setCarListPageTitle(options) {
    if (isZZCApp() || isCrcApp() || isRewardsApp()) {
        zzc.call('CarListPageTitle', {
            ...options,
        });
    }
}

export function hideTitle() {
    if (isApp()) {
        zzc.call('base_hideTopNavbar', {
            success: function(response) {
                console.log(response);
            },
        });
    }
}

/**
 * 点击左侧按钮回退键监听函数
 * 目前骑士卡基本确定无效 在租租车上却是正常的
 * @param {*} options
 */
export function handleLeftClickBack(options) {
    if (isZZCApp() || isCrcApp() || isRewardsApp()) {
        // 请注意：IOS下必须要有Type参数，否则整个插件调用不会成功
        // 同时对应的Type后必须有对应的属性，比如type为image时，必须要有imageUrl
        // 否则listener函数也不会成功😢😢😢
        zzc.call('base_customNavbarLeftButton', {
            type: 'image',
            imageUrl: 'back',
            listener: function() {
                options.cb && options.cb();
            },
            success: function(response) {
                console.log(response)
            },
        });
    }
}

function generateLink(uri) {
    const httpReg = /^((https|http|ftp|rtsp|mms)?:\/\/)/gi;
    let link = uri;
    if (!httpReg.test(uri)) {
        // 完整的url
        const url =
            env === 'local' || env === 'undefined'
                ? `${protocol}//${hostname}:${port}${uri}`
                : `${protocol}//${hostname}${uri}`;
        link = url;
    }
    return link;
}

// 分享
function share(options) {
    console.log(options);
    return zzc.call('share', options);
}

// 分享到小程序
export function shareToWx({
    title = '',
    content = '',
    photo = '',
    shareUrl = '',
    userName = 'gh_1a50e5f758ff',
    path = '',
}) {
    share({
        title,
        content,
        photo,
        userName,
        path,
        shareUrl,
        sharePlatform: ['miniProgram', 'wxtimeline'],
        success: function(response) {
            console.log(response);
        },
    });
}

// 检测是否安装某应用
export function checkPhoneIsExistApp(appName) {
    if (isApp()) {
        console.log('app内' + appName);
        return new Promise(res => {
            zzc.call('base_phoneIsExistApp', {
                appName: appName, // android 传包名 ，ios 用协议头
                success: function(response) {
                    res(response.data);
                },
            });
        });
    }
}

/**
 * 底部弹窗
 * options：数组，titles
   cancelButtonIndex：可选，取消按钮index
   destructiveButtonIndex：可选，红色按钮index
   title：标题
 */
export function handleShowActionSheet(options) {
    if (isApp()) {
        zzc.call('base_showNativeActionSheet', {
            options: options.titleArr,
            cancelButtonIndex: options.optionsArr.length,
            destructiveButtonIndex: options.optionsArr.length,
            title: '请选择地图',
            success: function(response) {
                options.optionsArr.forEach((item, i) => {
                    if (i === response.data) {
                        window.location.href = item;
                    }
                });
            },
        });
    }
}

export function getAppVersion() {
    return new Promise(resolve => {
        if (isApp()) {
            zzc.call('getAppVersion', {
                success: function(response) {
                    resolve(response.data);
                },
            });
        } else {
            resolve('0.0.0');
        }
    });
}

/**
 * 根据UA同步获取App版本
 */
export function getAppVersionByUa() {
    return Detector.browser.fullVersion;
}

/**
 * 页面退场操作
 * @param {object} options 配置项
 * @param {object} options.appOptions 使用原生后退配置项
 * @param {object} options.webOptions 使用h5后退配置项
 * @param {func} options.webOptions.handler 使用h5后退的处理句柄
 */

export async function handleBackToPrevious(options = {}) {
    const { appOptions, webOptions, useStep } = options;
    if (isApp()) {
        try {
            // app原生返回
            const version = await getAppVersion();

            if (useStep) {
                // 骑士卡ios传正值
                if (
                    isBlackApp() &&
                    Detector.os.ios &&
                    (version === '1.15.0' || version === '1.15.1' || version === '1.15.2')
                ) {
                    appOptions.step = Math.abs(appOptions.step);
                }
                zzc.call('base_goBackPage', {
                    // 返回n页
                    ...appOptions,
                });
                return;
            } else {
                zzc.call('base_backToPreviousPage', {
                    // 返回上一页
                    ...appOptions,
                });
                return;
            }
        } catch (error) {
            // 如果原生插件报错，则使用H5方法返回
            // h5处理句柄
            if (webOptions && webOptions.handler) {
                webOptions.handler();
            } else if (window.history.length > 1) {
                window.history.go(-1);
            } else {
                window.location.href = '/zijia/';
            }
        }
    } else {
        // h5处理句柄
        if (webOptions && webOptions.handler) {
            webOptions.handler();
        } else if (window.history.length > 1) {
            window.history.go(-1);
        } else {
            window.location.href = '/zijia/';
        }
    }
}

/**
 * 设置标题栏右侧按钮菜单
 * @param {*} options
 */
export function setAppRightBarList(options = {}) {
    if (isApp()) {
        zzc.call('appCustomRightBarList', {
            ...options,
        });
    }
}

/**
 * 下拉刷新
 * @param {function} callback
 */
export async function pullToRefresh(callback) {
    if (isApp()) {
        async function handler(response) {
            try {
                return await callback(response);
            } catch (e) {
                throw e;
            } finally {
                zzc.call('base_finishPullToRefresh');
            }
        }

        zzc.call('base_addPullToRefresh', {
            endPull: handler,
            listener: handler,
        });
    }
}

/**
 * 返回app首页
 * @param {*} handle
 */
export function backToBlackHome(options = {}) {
    const { tabIndex = 'home', handle } = options;
    if (isApp()) {
        try {
            if (isZZCApp()) {
                // 租租车原生首页
                zzc.call('page_linkTo', {
                    url: '/main/index/crc',
                    success: function() {},
                });
                return;
            }
            zzc.call('base_backToHome', {
                tabIndex,
                success: function(response) {
                    console.log(response);
                },
            });
        } catch (error) {
            handle && handle();
        }
    } else {
        handle && handle();
    }
}

/**
 * 是否已登陆
 */
export function hasLogin() {
    return getUserId() ? true : false;
}

/**
 * 手势控制
 * @param {*} options
 */

export function handleControlLeftPanGesture(options = {}) {
    if (isApp()) {
        zzc.call('base_controlLeftPanGesture', {
            off: options.off || 1,
            listener: options.listener || function(rs) {}, //当off==3时候有效
            success: options.success || function(response) {},
        });
    }
}

/**
 * 关闭下拉刷新 => 只对android起作用
 */
export function handleRemovePullToRefresh() {
    if (isApp()) {
        zzc.call('base_removePullToRefresh', {
            success: function(response) {},
        });
    }
}

export async function handleLogout(jmmp, jump_url) {
    const version = await getAppVersion();
    if (isCrcApp()) {
        if (versionCompare(version, '1.0.1', 3) === 1) {
            try {
                zzc.call('logout', {
                    success: function(response) {
                        zzc.call('base_backToHome', {
                            tabIndex: 'account',
                            success: function(res) {
                                console.log(res);
                            },
                        });
                    },
                });
            } catch (error) {
                jmmp = false;
                jumpLink({
                    url: jump_url,
                });
            }
        } else {
            jumpLink({
                url: jump_url,
            });
        }
    } else {
        if (jmmp) {
            jumpLink({
                url: jump_url,
            });
        }
    }
}

/**
 * 
 * @param {*} callback 
 * 描述：监听原生登陆状态的改变，

type: 0 : 退出登陆, 1:登陆* userId：用户id
* isLogined：是否登陆
* gourl：referurl
 */
export async function devicereadyCallback(callback) {
    if (isZZCApp() || isCrcApp() || isRewardsApp()) {
        zzc.call('onLoginStatusChange', {
            success: function(res) {
                console.log(res);
            },
            listener: function(response) {
                callback(response);
            },
        });
    }
}

/**
 * @description：由App跳转到微信小程序中
 * @param {*} userName：拉起的小程序的userName，必填
 * @param {*} path：拉起小程序页面的路径，不填默认拉起小程序首页
 * @param {*} miniProgramType：拉起小程序的类型，0：正式，1：开发，2：体验，默认0
 * @param {*} extMsg: APP传递给微信小程序的额外数据，要求json格式，选填，视需求而定
 */
export async function openWXMiniProgram(props) {
    const { userName, path, miniProgramType, extMsg, success, listener } = props
    if (isZZCApp() || isCrcApp() || isRewardsApp()) {
        zzc.call('openWXMiniProgram', {
            userName,
            path,
            miniProgramType,
            extMsg,
            success: success || function(res) {
                console.log(res);
            },
            listener: listener || function(response) {
                console.log(response);
            },
        });
    }
}

/**
 * 日历组件，仅国内租车有
 */
export function handleShowNativeCalendar(options = {}, handle) {
    try {
        const maxTimestamp = options.maxTimestamp || DateUitl.ToTimeStamp(DateUitl.addTime(90, 'day'));
        zzc.call('book_calendar', {
            minTimestamp: new Date().getTime(), //时间戳，单位毫秒（日历开始的时间，比如今天。2020.1.3）
            maxTimestamp, //时间戳，单位毫秒（日历结束的时间，比如最多180天。2020.7.3）
            pickUpTimestamp: options.pickUpTimestamp, //时间戳，单位毫秒（用户选的取车时间）
            dropOffTimestamp: options.dropOffTimestamp, //时间戳，单位毫秒（用户选的还车时间）
            pickUpMaxSelectedSpace: 90, //可选最大取车天数，距离minTimestamp多少天（取车最大多少天，现在是180天）
            pickUpAndDropOffMaxDays: 90, //取还车最大租期，（取还车最大租期，现在是90天）
            pickUpAndDropOffMinHours: 1, //取还车之间最小间隔，小时（取还车最小间隔多少小时，比如，现在是1小时）
            landmarkPrompt: options.landmarkPrompt, //提示（提示语，比如，现在是“取还车时间在夜间或凌晨可能会被收取夜间服务费”）
            success: options.success,
        });
    } catch (err) {
        handle && handle();
    }
}

/**
 * 地标&时间选择插件，国际租车App和国内租车App（准备接入）
 */
export function handleAppDateSettingTool(options = {}, handle) {
    if (!isAppSupportPlugin('crcRentCarSettingAlert')) {
        return false;
    }

    const minTimestamp = options.minTimestamp || DateUitl.ToTimeStamp(DateUitl.addTime(59, 'minute'));
    const maxTimestamp = options.maxTimestamp || DateUitl.ToTimeStamp(DateUitl.addTime(90, 'day'));
    // debugger;

    // 字段信息详见；http://wiki.int.zuzuche.info/pages/viewpage.action?pageId=7668275
    zzc.call('crcRentCarSettingAlert', {
        pickUpCityId: options.pickUpCityId, //取车城市id
        pickUpCityName: options.pickUpCityName,//取车城市名称
        pickUpLandmarkId: options.pickUpLandmarkId, //取车地标id
        pickUpLandmarkName: options.pickUpLandmarkName,//取车地标名称
        pickUpLandmarkLat: options.pickUpLandmarkLat, //如果id为-1时，为谷歌地标，传取车地标经纬度
        pickUpLandmarkLng: options.pickUpLandmarkLng, //如果id为-1时，为谷歌地标，传取车地标经纬度
        pickUpTimeStamp: options.pickUpTimeStamp, // 取车时间戳
        dropOffCityId: options.dropOffCityId, //还车城市id
        dropOffCityName: options.dropOffCityName,//还车城市名称
        dropOffLandmarkId: options.dropOffLandmarkId, //还车地标id
        dropOffLandmarkName: options.dropOffLandmarkName,//还车地标名称
        dropOffLandmarkLat: options.dropOffLandmarkLat, //如果id为-1时，为谷歌地标，传还车地标经纬度
        dropOffLandmarkLng: options.dropOffLandmarkLng,//如果id为-1时，为谷歌地标，传还车地标经纬度
        dropOffTimeStamp: options.dropOffTimeStamp, // 还车时间戳

        minTimestamp: minTimestamp,
        maxTimestamp: maxTimestamp,
        pickUpMaxSelectedSpace: '90',
        pickUpAndDropOffMaxDays: '90',
        pickUpAndDropOffMinHours: '1',
        pickUpAndDropOffDefaultHours: '48', // 默认取还车时间间隔，两天。
        diffPlace: options.diffPlace,

        actionType: options.actionType,
        // pickUpMinHour: string,
        // pickUpMaxHour: string,
        // dropOffMinHour: string,
        // dropOffMaxHour: string,
        listener: function (response) {
            // 时间戳毫秒转为秒
            if(!Number.isNaN(response.data.pickUpTimeStamp) && `${response.data.pickUpTimeStamp}`.length > 10) {
                response.data.pickUpTimeStamp = Number(response.data.pickUpTimeStamp) / 1000;
            }
            if(!Number.isNaN(response.data.dropOffTimeStamp) &&`${response.data.dropOffTimeStamp}`.length > 10) {
                response.data.dropOffTimeStamp = Number(response.data.dropOffTimeStamp) / 1000;
            }

            //点击取车城市和还车城市回调
            handle && handle(response);
        }
    });
    return true;
}

export { onPageShow, offPageShow } from './page-show-event';

export { onPageHide, offPageHide } from './page-hide-event';
