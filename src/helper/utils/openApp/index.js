
import download from './download';
import open from './open';
import { locationHref } from './utils/index';
import { adaptor } from './adaptor';
import {
    isApp,
    isWeixin,
    isIos,
    isAndroid
} from './utils/detector';

export default class OpenApp {
    constructor(options) {
        const {
            ios = {},
            android = {},
            landUrl,
            timeout
        } = {
            ...OpenApp.defaultOptions,
            ...adaptor(options)
        };
        let device;
        if (isIos()) {
            device = ios;
        } else if (isAndroid()) {
            device = android;
        } else {
            const nonMobileDeviceUrls = {
                targetUrl: landUrl,
                storeUrl: landUrl,
            };
            device = {
                app: nonMobileDeviceUrls,
                weixin: nonMobileDeviceUrls,
                browser: nonMobileDeviceUrls,
            };
        }
        const {
            app = {},
            weixin = {},
            browser = {},
        } = device;


        this.config = (async () => {
            let config;
            if (isApp()) {
                config = this._getAppConfig(app);
            } else if (isWeixin()) {
                const {
                    targetUrl,
                    storeUrl
                } = weixin;
                config = {
                    targetUrl,
                    storeUrl
                }
            } else {
                const {
                    targetUrl,
                    storeUrl
                } = browser;
                config = {
                    targetUrl,
                    storeUrl
                };
            }
            return {
                ...await config,
                timeout,
                landUrl
            };
        })();
    }

    static defaultOptions = {
        storeUrl: 'https://oia.zuzuche.com/zijia/',
        targetUrl: 'https://oia.zuzuche.com/zijia/',
        landUrl: 'https://oia.zuzuche.com/zijia/',
        ios: {
            app: [{
                key: 'zzczijia',
                get targetUrl() {
                    return this.targetUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            }],
            browser: {
                get targetUrl() {
                    return this.targetUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            },
            weixin: {
                get targetUrl() {
                    return this.targetUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            }
        },
        android: {
            app: [{
                key: 'com.zuzuche.crc',
                get targetUrl() {
                    return this.targetUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            }],
            browser: {
                get targetUrl() {
                    return this.targetUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            },
            weixin: {
                get targetUrl() {
                    return this.storeUrl;
                },
                get storeUrl() {
                    return this.storeUrl;
                }
            }
        }
    };

    open = async () => {
        const {
            targetUrl,
            landUrl,
            timeout,
        } = await this.config;
        try {
            if (targetUrl) {
                await open(targetUrl, timeout);
            } else {
                throw new Error(`targetUrl=${targetUrl}，将跳转落地页`);
            }
        } catch (e) {
            console.error(e);
            locationHref(landUrl);
        }
    }

    download = async () => {
        const {
            storeUrl,
            landUrl,
            timeout
        } = await this.config;

        try {
            if (storeUrl) {
                await open(storeUrl, timeout);
            } else {
                throw new Error('storeUrl没配置，将跳转落地页');
            }
        } catch (e) {
            console.error(e)
            locationHref(landUrl);
        }
    }

    floor = async () => {
        const {
            landUrl
        } = await this.config;

        return locationHref(landUrl);
    }

    async _getAppConfig(apps) {
        try {
            const timeout = 200; // 如果原生调用api失败则进入超时处理逻辑
            const phoneIsExistAppResult = await new Promise((resolve, reject) => {
                const appNames = apps.map(app => app.key);
                zzc.call('phoneIsExistApp', {
                    appNames,
                    success: (data) => {
                        resolve(data?.data ?? data)
                    }
                });
                setTimeout(() => reject('检测已安装App失败, 返回第一个传入app的配置'), timeout);
            });
            let installedApp = phoneIsExistAppResult.find(app => {
                return app.installed;
            });
            if (installedApp) {
                const target = appNames.find(app => app.key == installedApp.appName);
                if (target) {
                    const {
                        targetUrl = '',
                        storeUrl = ''
                    } = target;
                    return {
                        targetUrl,
                        storeUrl
                    };
                }
            } else {
                throw new Error('无已安装app, 返回第一个传入app的配置');
            }
        } catch (e) {
            console.error(e);
            const {
                targetUrl,
                storeUrl
            } = apps[0];
            return {
                targetUrl,
                storeUrl
            };
        }
    }
}
