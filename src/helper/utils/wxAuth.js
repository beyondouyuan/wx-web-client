import EasyToast from '@components/EasyToast';
import * as zhimaService from '@service/zhima';
import qs from 'qs';
import { Alert } from 'zzc-design-mobile';
import * as utilLogger from './logger';
import Local from '@/utils/local-storage';
import { WECHATSORCE } from '@/utils/const';
import {
    isAlipay,
    isAliPayMiniprogram,
    isCrcApp,
    isZZCApp,
    backToBlackHome,
    handleLogin,
    devicereadyCallback,
    isMiniprogram,
    isWeiXin
} from './native';
import { getUserId, get } from './cookie';
import { parseSearchParams } from '@/utils/url';
import { sleep } from './noop';

const urlParams = parseSearchParams();

/**
 * 封装微信支付分方法
 * 通常调用只需要authWx，resetAuthWx两个方法
 */
class WXAuth {
    constructor() {
        this.urlParams = urlParams || {};
        this.wxConfig = window.__initData.wxConfig || { };
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // // app 监听登录返回
        // devicereadyCallback((response) => {
        //     const {
        //         data: {
        //             isLogined,
        //             app_login_access_token,
        //             userId,
        //             gourl
        //         }
        //     } = response;
        //     if (isLogined || userId || app_login_access_token) {
        //         // 因为登录状态修改后setUserId需要时间，所以用了setTimeout
        //         setTimeout(() => {
        //             window.location.href = window.location.href;
        //         }, 1000);
        //     }
        // });

    }

    _compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i]);
            const num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return 1;
            } if (num1 < num2) {
                return -1;
            }
        }

        return 0;
    }

    _weixinAuth({ businessType, queryString }, cb) {
        const wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
        const wechatVersion = wechatInfo[1];
        if (this._compareVersion(wechatVersion, '7.0.5') >= 0) {
            window.wx.checkJsApi({
                jsApiList: ['openBusinessView'], // 需要检测的JS接口列表
                success(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"openBusinessView":true},"errMsg":"checkJsApi:ok"}
                    if (res.checkResult.openBusinessView) {
                        wx.invoke(

                            'openBusinessView',
                            { businessType, queryString },
                            (res) => {
                                // 从微信侧小程序返回时会执行这个回调函数
                                if (parseInt(res.err_code) === 0) {
                                    console.log('resSuccess', res);
                                    // 返回成功
                                } else {
                                    // 返回失败
                                    console.log('resError', res);
                                }
                            }
                        );
                    }
                }
            });
        } else {
            EasyToast.info('微信版本过低，请升级到7.0.5及以上版本');
            cb();
        }
    }

    _weixinCommonAuth(orderStr, cb) {
        if (!orderStr) {
            EasyToast.info('授权参数有误');
            cb();
            return false;
        }
        try {
            const { timestamp, signature, nonceStr } = this.wxConfig;
            const {
                queryString, businessType, path, appId, extraData
            } = orderStr.guideData;

            location.pathname.indexOf('/book/views') != -1 && Local.set(WECHATSORCE, 'auth');
            if (isMiniprogram()) {
                this._weixinMiniProgramAuth({
                    businessType, path, appId, ...extraData
                }, cb);
                return false;
            }
            window.wx.config({
                debug: true,
                appId,
                timestamp,
                signature,
                nonceStr,
                jsApiList: ['openBusinessView', 'checkJsApi']
            });

            window.wx.ready(() => {
                this._weixinAuth({ businessType, queryString }, cb);
            });
        } catch (err) {
            console.log(err);
        }
    }

    _weixinMiniProgramAuth(params, cb) {
        console.log('_weixinMiniProgramAuth', qs.stringify(params), location.href);
        const backUrl = location.href.indexOf('?') >= 0 ? `${location.href}&hash=${new Date().getTime()}` : `${location.href}?hash=${new Date().getTime()}`;
        wx.miniProgram.redirectTo({
        // wx.miniProgram.navigateTo({
            url: `/pages/wxpayScore/index?score=${encodeURIComponent(qs.stringify(params))}&miniBack=${encodeURIComponent(backUrl)}`
        });
    }

    /**
     * 支付分签约
     * callback({ wxChecked, wxAuthCode })
     * @param {*} params
     * @param {*} callback
     */
    scoreWx = async ({ isNoLoading, ...params } = {}, callback) => {
        // 检查是否登录
        const CBD_UID = getUserId();
        if (!CBD_UID) {
            handleLogin(window.location.href);
            callback();
            return;
        }

        /*  // 授权之前请求一次看看是否已经授权
         const freeTicketData = await this.fetchWxFreeTicket();
         if (freeTicketData.wxChecked) {
             EasyToast.success('已签约,已为您选择');
             callback(freeTicketData);
             return;
         } */


        try {
            const {
                data, message
            } = await zhimaService.getAuthContract({
                ...params,
                method: 2,
                openid: this.urlParams.openId || get('identification')
            });
            await sleep(2000);
            if (data) {
                !isNoLoading && EasyToast.success(message);
                callback({
                    wxChecked: data?.status > 0,
                    wxAuthStatus: data?.status,
                    wxAuthCode: data?.requestNo
                });
            } else {
                // EasyToast.error('操作失败!');
                Alert({
                    title: '温馨提示',
                    content: message,
                    buttons: [
                        {
                            text: '确认',
                            onPress: () => {
                                // callback({
                                //     // wxChecked: true,
                                //     // wxAuthCode: 'fcidnhda123',
                                //     // wxAuthStatus: 10
                                // });
                            },
                            props: {
                                type: 'special',
                                style: { color: '#254FCB', border: 'none' }
                            }
                        }
                    ]
                });
                utilLogger.error('支付分签约失败', {
                    result
                });
                callback();
            }
        } catch (error) {
            callback();
            EasyToast.error(error.message);
            utilLogger.error('支付分签约失败', {
                error
            });
        }
    }

    reTickFreeTick = async (cb) => {
        const freeTicketData = await this.fetchWxFreeTicket();
        cb(freeTicketData);
    }


    /**
     * 支付分授权
     * callback({ wxChecked, wxAuthCode })
     * wxChecked:是否授权， wxAuthCode
     */
    authWx = async (cb) => {
        try {
            // 检查是否登录
            const CBD_UID = getUserId();
            if (!CBD_UID) {
                handleLogin(window.location.href);
                cb();
                return;
            }

            // 授权之前请求一次看看是否已经授权
            const freeTicketData = await this.fetchWxFreeTicket();
            if (freeTicketData.wxChecked) {
                EasyToast.success('已签约,已为您选择');
                cb(freeTicketData);
                return;
            }

            const {
                data: { orderStr }
            } = await zhimaService.getOrderStr({
                openid: this.urlParams.openId || get('identification'),
                method: 2
            });

            if (!orderStr) {
                cb();
                EasyToast.info('授权信息获取错误');
                return;
            }
            console.log('getOrderStr', orderStr);

            this._weixinCommonAuth(orderStr, cb);
        } catch (error) {
            EasyToast.error(error.msg || error.message);
            cb();
        }
    }

    fetchWxFreeTicket = async () => {
        const { data } = await zhimaService.getFreeTicket({
            inTerminal: 'wechat'
        });
        if (data?.requestNoArr?.wechat?.requestNo || data?.requestNoArr?.wechat?.status > 0) {
            return {
                wxChecked: true,
                wxAuthCode: data?.requestNoArr?.wechat?.requestNo,
                wxAuthStatus: data?.requestNoArr?.wechat?.status,
                disAuthClose: data?.requestNoArr?.wechat?.status == 15
            };
        }
        return {
            wxChecked: false
        };
    }

    /**
     * 支付分解冻
     * callback({ wxChecked, wxAuthCode })
     */
    resetAuthWx = async (requestNo, callback) => {
        const _self = this;
        try {
            const {
                data: { result }
            } = await zhimaService.zhimaUnfreeze({
                requestNo,
                method: 2
            });
            Local.remove(WECHATSORCE);
            if (result) {
                EasyToast.success('操作成功!');
                _self.reTickFreeTick(callback);
                // callback({
                //     wxChecked: !!requestNo, // 有签约单时只提示结果 不去掉授权态
                //     wxAuthCode: ''
                // });
            } else {
                EasyToast.error('操作失败!');
                utilLogger.error('支付分解绑授权失败', {
                    result
                });
                callback();
            }
        } catch (error) {
            callback();
            EasyToast.error(error.message);
            utilLogger.error('支付分解绑授权失败', {
                error
            });
        }
    };
}

/**
 * 导出单例
 */
const WXAuthUtils = new WXAuth();

export default WXAuthUtils;
