import { isEmptyObject, isArray } from '../type';
import { formatParams } from './utils';
import appConfig from './app.config';

// scheme方式 ,将🔗的替换成传入的protocol
function reduceUrl({
    scheme = '',
    path = '',
    useScheme,
    params = {}
}) {
    let query = '';
    let protocol = '';
    path = path.replace(/^(.+):\/\/(.+)/, (match, p1 = '', p2 = '') => {
        protocol = `${p1}://`;
        return p2;
    });

    if (!protocol) {
        protocol = 'https://';
    }

    if (useScheme && scheme) {
        protocol = `${scheme}://`;
    }

    if (params && !isEmptyObject(params)) {
        query = location.search
            ? `${location.search}&${formatParams(params)}`
            : `?${formatParams(params)}`
    }
    return `${protocol}${path}${query}`
}

export function adaptor(options) {
    if (options && !isEmptyObject(options)) {
        const {
            app = [],
            target = {},
            store = {},
            land = {},
            timeout
        } = options;

        // 根据原配置拓展开
        const newOptions = {
            ios: {
                app: [],
                browser: [],
                weixin: {}
            },
            android: {
                app: [],
                browser: [],
                weixin: {}
            },
        };

        // 处理ios和android设备的 app【打开】链接
        app.forEach((app, i) => {
            if (appConfig[app]) {
                const config = appConfig[app];
                const scheme = config.protocol;
                const targetUrl = reduceUrl({
                    ...target,
                    scheme,
                });
                newOptions.ios.app.push({
                    key: config.protocol, // key用以检测手机是否有安装该app
                    targetUrl,
                });
                newOptions.android.app.push({
                    key: config.pkgName,
                    targetUrl,
                });
            }
        });
        //
        const commonBrowserTargetUrl = reduceUrl(target);
        newOptions.ios.browser.targetUrl = commonBrowserTargetUrl;
        newOptions.android.browser.targetUrl = commonBrowserTargetUrl;

        // 处理ios和android的浏览器打开【应用商店】链接
        Object.keys(store).forEach(device => {
            const deviceStore = isEmptyObject(store[device])
                ? null
                : reduceUrl(store[device]);
            if (deviceStore && newOptions[device]) {
                newOptions[device].app = newOptions[device].app.map(app => {
                    app.storeUrl = deviceStore
                    return app;
                });
                newOptions[device].browser.storeUrl = deviceStore;
            }
        });
        if (!isEmptyObject(land)) {
            const landUrl = reduceUrl(land);
            Object.keys(newOptions).forEach(device => {
                newOptions[device].weixin = {
                    targetUrl: landUrl,
                    storeUrl: landUrl
                };
            });
            newOptions.landUrl = landUrl;
        }
        newOptions.timeout = timeout;
        return newOptions;
    }
    return options;
}

export default function adaptorDecorator(target) {
    target.constructor = (options) => constructor(adaptor(options));
};
