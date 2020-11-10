import React from 'react';
import EasyToast from '@components/EasyToast';
import * as zhimaService from '@service/zhima';
import * as utilLogger from './logger';
import {
    isAlipay,
    isAliPayMiniprogram,
    isCrcApp,
    isZZCApp,
    backToBlackHome,
    handleLogin,
    devicereadyCallback,
} from './native';
import { getUserId } from './cookie';
import { Alert } from 'zzc-design-mobile';
import alertStyle from './alert.modules.scss';

/**
 * 封装芝麻方法
 * 通常调用只需要authZhima，resetAuthZhima两个方法
 */
class Zhima {
    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // app 监听登录返回
        devicereadyCallback((response) => {
            const {
                data: {
                    isLogined,
                    app_login_access_token,
                    userId,
                    gourl
                }
            } = response;
            console.log('监听登录变化12', response);
            if (isLogined || userId || app_login_access_token) {
                // 因为登录状态修改后setUserId需要时间，所以用了setTimeout
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }
        });
    }

    /**
 * 授权
 * callback({ zmChecked, zhimaAuthCode })
 * zmChecked:是否授权， zhimaAuthCode：授权码
 */
    // authZhima = async (callback, params) => {
    authZhima = async (callback, params, type = 'nomral') => {
        // 检查是否能授权
        const shouldShowZhima = isAliPayMiniprogram() || isCrcApp() || isZZCApp();
        if (!shouldShowZhima) {
            EasyToast.info('需要在租租车app才能授权');
            callback();
            return;
        }

        // 检查是否登录
        const CBD_UID = getUserId();
        if (!CBD_UID) {
            handleLogin(window.location.href);
            callback();
            return;
        }

        // 授权之前请求一次看看是否已经授权
        const freeTicketData = await this.fetchFreeTicket(params?.amount);
        if (freeTicketData.zmChecked) {
            callback(freeTicketData);
            return;
        }

        const {
            data: { orderStr, requestNo }
        } = await zhimaService.getOrderStr(params);

        this.handleAliPay(orderStr, requestNo, callback, type);
    };

    /**
     * 芝麻解冻
     * callback({ zmChecked, zhimaAuthCode })
     */
    resetAuthZhima = async (requestNo, callback) => {
        try {
            const {
                data: { result },
            } = await zhimaService.zhimaUnfreeze({ 
                requestNo,
                method: 1 
            });
            if (result) {
                EasyToast.success('操作成功!');
                callback({
                    zmChecked: false,
                    zhimaAuthCode: ''
                });
            } else {
                EasyToast.error('操作失败!');
                utilLogger.error(`芝麻解绑授权失败`, {
                    result
                });
                callback();
            }
        } catch (error) {
            callback();
            EasyToast.error(error.message);
            utilLogger.error(`芝麻解绑授权失败`, {
                error,
            });
        }
    };

    /**
     * 获取状态
     */
    fetchFreeTicket = async (amount) => {
        const { data } = await zhimaService.getFreeTicket({
            inTerminal: 'zhima',
            amount
        });
        if (data?.requestNoArr?.zhima?.requestNo) {
            return {
                zmChecked: true,
                zhimaAuthCode: data.requestNoArr.zhima.requestNo,
                zhimaStatus: data.requestNoArr.zhima.status
            };
        }
        return {
            zmChecked: false
        };
    };

    successAlert = (type) => {
        if ( type == 'view' ) {
            Alert( {
                title: (<div className={alertStyle['auth-title']}><div className={alertStyle['succee-icon']}/><p>申请成功</p></div>),
                content: (
                    <div className={alertStyle['auth-modal']}>
                        <div className={alertStyle['auth-modal-item']}>
                            <p className={alertStyle['auth-modal-item-text']}>租车可享免车辆押金+违章押金，还车后30天无待支付费用将自动完结芝麻信用授权。</p>
                        </div>
                        <div className={alertStyle['auth-modal-item']}>
                            <p className={alertStyle['auth-modal-item-text']}>用车期间如果产生了额外费用（例如违章罚款），将从授权的支付宝账户中划扣并通知您。</p>
                        </div>
                    </div>
                ),
                maskClose: true,
                buttons: [
                    {
                        text: '我知道了',
                        onPress: () => {
    
                        },
                        props: {
                            type: 'special',
                            style: { color: '#2871F7', border: 'none' }
                        }
                    }
                ]
            } );
        } else {
            Alert( {
                title: (
                    <div className='modal-title'>
                        <div className='icon success' />
                        <p className='modal-title-text'>申请成功</p>
                    </div>
                ),
                maskClose: true,
                content: (
                    <div className='modal-content'>
                        <p className='modal-content-text'>租车可享受车辆押金+免违章押金</p>
                        <p className='modal-content-text'>本次申请3天内有效</p>
                    </div>
                ),
                buttons: [
                    {
                        text: '体验免押租车',
                        onPress: () => { },
                        props: {
                            type: 'special',
                            style: { color: '#2871F7', border: 'none' }
                        }
                    }
                ]
            } );
        }
       
    }

    errorAlert = (type) => {
        if (type == 'view') {
            Alert( {
                title: (<div className={alertStyle['auth-title']}><div className={alertStyle['error-icon']}/><p>未申请成功</p></div>),
                content: (
                    <div className={alertStyle['error-content']}>
                        <p className={alertStyle['error-content-title']}>可能原因</p>
                        <p className={alertStyle['error-content-text']}>1.芝麻分未达550分</p>
                        <p className={alertStyle['error-content-text']}>2.未通过支付宝综合风险评估</p>
                        <p className={alertStyle['error-content-text']}>3.未在支付宝完成授权申请</p>
                        <p className={alertStyle['error-content-sub-text']}>评估不通过问题请咨询支付宝客服</p>
                    </div>
                ),
                maskClose: true,
                buttons: [
                    {
                        text: '我知道了',
                        onPress: () => {
    
                        },
                        props: {
                            type: 'special',
                            style: { color: '#2871F7', border: 'none' }
                        }
                    }
                ]
            } );
        } else {
            Alert( {
                title: (
                    <div className='modal-title'>
                        <div className='icon error' />
                        <p className='modal-title-text'>未申请成功</p>
                    </div>
                ),
                maskClose: true,
                content: (
                    <div className='modal-content'>
                        <p className='error-content-title'>可能原因:</p>
                        <p className='error-content-text'>1.芝麻分未达550分</p>
                        <p className='error-content-text'>2.未通过支付宝综合风险评估</p>
                        <p className='error-content-text'>3.未在支付宝完成授权申请</p>
                        <p className='error-content-sub-text'>评估不通过问题请咨询支付宝客服</p>
                    </div>
                ),
                buttons: [
                    {
                        text: '我知道了',
                        onPress: () => { },
                        props: {
                            type: 'special',
                            style: { color: '#2871F7', border: 'none' }
                        }
                    }
                ]
            } );
        }
        
    }

    /**
     * 支付宝授权
     * 分为app跟支付宝两种授权
    * */
    handleAliPay = async (orderStr, requestNo, callback, type) => {
        const self = this;
        if (isAlipay() || isAliPayMiniprogram()) {
            this.handleAlipayOnAliApp(orderStr, requestNo, callback);
        } else {
            // 其他app
            zzc.call('alipayV2', {
                orderStr,
                complete(response) {
                    const {
                        data,
                        data: { resultStatus, memo },
                    } = response;
                    const errMsg = memo || '操作失败';
                    if (data && resultStatus === '9000') {
                        // EasyToast.success('授权成功!');
                        self.successAlert(type);
                        callback({
                            zmChecked: true,
                            zhimaAuthCode: requestNo
                        });
                    } else {
                        self.errorAlert(type);
                        callback({
                            zmChecked: false,
                            zhimaAuthCode: ''
                        });
                        utilLogger.error(`芝麻授权失败`, {
                            errMsg,
                            resultStatus,
                        });
                    }
                },
            });
        }
    };

    // 支付宝生活号中
    handleAlipayOnAliApp = (orderStr, requestNo, callback) => {
        const self = this;
        AlipayJSBridge.call(
            'tradePay',
            {
                orderStr
            },
            (response) => {
                const { resultCode, memo } = response;
                const errMsg = memo || '操作失败';
                if (resultCode === '9000') {
                    self.successAlert();
                    callback({
                        zmChecked: true,
                        zhimaAuthCode: requestNo
                    });
                } else {
                    self.errorAlert();
                    callback({
                        zmChecked: false,
                        zhimaAuthCode: ''
                    });
                    utilLogger.error(`支付宝生活号芝麻授权失败`, {
                        errMsg,
                        resultCode,
                    });
                }
            }
        );
    };
}

/**
 * 导出单例
 */
const ZhimaUtils = new Zhima();

export default ZhimaUtils;
