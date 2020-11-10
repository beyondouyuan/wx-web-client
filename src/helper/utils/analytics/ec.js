/**
 * GTM增强型电子商务
 */

import { isFunction, isObject, isArray, isUndefined, isString } from '@/utils/type';

const dataLayer = window.dataLayer;
const UNKNOWN = 'unknown';
const currencyCode = 'CNY';

function clone(data = '') {
    return !isUndefined(data) && JSON.parse(JSON.stringify(data)); // clone
}

function toInt(s) {
    return parseInt(s, 10) || 0;
}
function toString(s) {
    return s + '';
}

let impressionDataMap = {};
let impressionData = [];

export function productImpressionDataPick(id) {
    if (!isUndefined(id)) {
        const cacheIndex = impressionDataMap[id];
        return cacheIndex >= 0
            ? clone(impressionData.slice(cacheIndex, cacheIndex + 1)[0])
            : null;
    }
    return clone(impressionData);
}

export function productImpressionDataSave(data, listTitle = '搜索列表', options = {}) {
    if (!isObject(data)) {
        return;
    }

    if (options.reset !== false) {
        impressionDataMap = {};
        impressionData = [];
    }

    // eslint-disable-next-line default-case
    switch (data.type) {
        case 'car':
            const condition = data.condition || {};
            data.data.forEach((item, key) => {
                let dimensions = [];
                if (!item.vehicle) {
                    return;
                }
                if (item.transmission && item.seat && item.displacement) {
                    dimensions = [item.transmission, item.seat, item.displacement];
                } else {
                    dimensions = item.vehicle.subTitle.split(' | ');
                }

                const r = {
                    id: item.price.cid,
                    name: item.vehicle.title,
                    price: toString(item.price.total),
                    brand: item.vehicle.brand || UNKNOWN,
                    category: '车型/短租',
                    variant: item.vehicle.carGroup.txt || UNKNOWN,
                    dimension6: dimensions[0] || UNKNOWN, // 档位
                    dimension7: dimensions[2] || UNKNOWN, // 排量
                    dimension8: dimensions[1] ? toInt(dimensions[1]) : UNKNOWN, // 座位
                    list: listTitle,
                    position: key + 1,
                };
                if (!isUndefined(item.quantity)) {
                    r.quantity = item.quantity;
                }
                // 取车城市
                if (condition.pickUpCity) {
                    r.dimension3 = condition.pickUpCity;
                }
                // 取车地点
                if (condition.pickUpLandMark) {
                    r.dimension10 = condition.pickUpLandMark;
                }
                // 还车城市
                if (condition.dropOffCity) {
                    r.dimension4 = condition.dropOffCity;
                }
                // 还车地点
                if (condition.dropOffLandMark) {
                    r.dimension11 = condition.dropOffLandMark;
                }
                // 租期
                if (condition.day) {
                    r.dimension5 = condition.day;
                }
                // 取车时间
                if (condition.pickUpTime) {
                    r.dimension14 = condition.pickUpTime;
                }
                // 还车时间
                if (condition.dropOffTime) {
                    r.dimension15 = condition.dropOffTime;
                }
                impressionData.push(r);

                impressionDataMap[item.price.cid] = impressionData.length - 1;
            });
            break;
        case 'ins':
            data.data.forEach(item => {
                if (item.count > -1) {
                    const r = {
                        id: item.id,
                        name: item.title,
                        price: toString(item.amount),
                        category: '增值服务/保险',
                        list: listTitle,
                        position: impressionData.length + 1,
                    };

                    if (!isUndefined(item.quantity)) {
                        r.quantity = item.quantity;
                    }

                    impressionData.push(r);
                    impressionDataMap[item.id] = impressionData.length - 1;
                }
            });
            break;
    }
}

/**
 * 衡量商品列表展示
 */
export function productImpressionsViewSend() {
    const products = productImpressionDataPick();
    if (isArray(products) && products.length > 0) {
        const maxProducts = 10;
        while (products.length) {
            const newProducts = products.splice(0, maxProducts);
            dataLayer.push({
                event: 'eec.impressionView',
                ecommerce: {
                    currencyCode,
                    impressions: newProducts,
                },
            });
        }
    }
}

/**
 * 衡量商品点击
 * @param id
 * @param dealer
 * @param actionField
 * @param callback
 */
export function productImpressionsClickSend(
    id,
    dealer = '',
    actionField = null,
    callback = null
) {
    let products = productImpressionDataPick(id);

    if (!products) {
        return;
    }

    if (!isArray(products)) {
        products = [products];
    }
    if (dealer) {
        products.map(item => {
            item.dimension1 = dealer; // 供应商名称
            return item;
        });
    }

    const pushObj = {
        event: 'eec.impressionClick',
        ecommerce: {
            click: {
                products,
            },
        },
    };

    if (isObject(actionField)) {
        pushObj.ecommerce.click.actionField = actionField;
    } else {
        pushObj.ecommerce.click.actionField = {};
    }

    if (isUndefined(pushObj.ecommerce.click.actionField.list)) {
        pushObj.ecommerce.click.actionField.list = '搜索列表';
    }

    if (isFunction(callback)) {
        pushObj.eventCallback = callback;
    }

    dataLayer.push(pushObj);
}

let detailDataCacheMap = {};
let detailDataCache = [];
export function productDetailDataSave(data, options = {}) {
    if (!isObject(data)) {
        return;
    }

    if (options.reset !== false) {
        detailDataCacheMap = {};
        detailDataCache = [];
    }

    if (!isArray(data.data)) {
        data.data = [data.data];
    }

    // eslint-disable-next-line default-case
    switch (data.type) {
        case 'car':
            data.data.forEach(item => {
                const r = {
                    id: item.cid,
                    name: item.car.title,
                    brand: item.car.brand || UNKNOWN,
                    category: '车型/短租',
                    variant: item.car.carGroup.txt || UNKNOWN,
                    price: toString(item.total.baseTotalAmount),
                    dimension1: item.dealer.name || UNKNOWN, // 档位
                    dimension6: item.car.transmission || UNKNOWN, // 档位
                    dimension7: item.car.displacement || UNKNOWN, // 排量
                    dimension8: item.car.seat || UNKNOWN, // 座位
                };
                if (!isUndefined(item.quantity)) {
                    r.quantity = item.quantity;
                }
                // 取车城市
                if (!isUndefined(item.pickUpCity)) {
                    r.dimension3 = item.pickUpCity;
                }
                // 取车地点
                if (!isUndefined(item.pickUpLandMark)) {
                    r.dimension10 = item.pickUpLandMark;
                }
                // 还车城市
                if (!isUndefined(item.dropOffCity)) {
                    r.dimension4 = item.dropOffCity;
                }
                // 还车地点
                if (!isUndefined(item.dropOffLandMark)) {
                    r.dimension11 = item.dropOffLandMark;
                }
                // 租期
                if (!isUndefined(item.day)) {
                    r.dimension5 = item.day;
                }
                // 取车时间
                if (!isUndefined(item.pickUpTime)) {
                    r.dimension14 = item.pickUpTime;
                }
                // 还车时间
                if (!isUndefined(item.dropOffTime)) {
                    r.dimension15 = item.dropOffTime;
                }
                detailDataCache.push(r);

                detailDataCacheMap[item.cid] = detailDataCache.length - 1;
            });
            break;
        case 'ins':
            data.data.forEach(item => {
                if (item.count > -1) {
                    const r = {
                        id: item.id,
                        name: item.title,
                        price: toString(item.amount),
                        category: '增值服务/保险',
                    };
                    if (!isUndefined(item.quantity)) {
                        r.quantity = item.quantity;
                    }
                    detailDataCache.push(r);
                    detailDataCacheMap[item.cid] = detailDataCache.length - 1;
                }
            });
            break;
    }
}

export function productDetailDataPick(id) {
    if (!isUndefined(id)) {
        const cacheIndex = detailDataCacheMap[id];
        return cacheIndex >= 0
            ? clone(detailDataCache.slice(cacheIndex, cacheIndex + 1)[0])
            : null;
    }
    return clone(detailDataCache);
}

/**
 * 衡量商品详情展示量
 * @param id
 * @param actionField
 */
export function productDetailsViewSend(id, actionField = null) {
    const products = productDetailDataPick(id);
    const pushObj = {
        event: 'eec.detailView',
        ecommerce: {
            detail: {
                products,
            },
        },
    };

    if (isObject(actionField)) {
        pushObj.ecommerce.detail.actionField = actionField;
    }
    if (isUndefined(pushObj.ecommerce.detail.actionField.list)) {
        pushObj.ecommerce.detail.actionField.list = '搜索列表';
    }

    dataLayer.push(pushObj);
}

/**
 * 进入下单页面（加入购物车）
 * @param products
 * @param actionField
 */
export function productAddCartSend(products = null, actionField = null) {
    if (!isArray(products)) {
        products = [products];
    }

    products.map(item => {
        item.quantity = !isUndefined(item.quantity) ? item.quantity : 1;
        return item;
    });

    const pushObj = {
        event: 'eec.addCart',
        ecommerce: {
            add: {
                products,
            },
        },
    };

    if (isObject(actionField)) {
        pushObj.ecommerce.add.actionField = actionField;
    }

    if (isUndefined(pushObj.ecommerce.add.actionField.list)) {
        pushObj.ecommerce.add.actionField.list = '搜索列表';
    }

    dataLayer.push(pushObj);
}

/**
 * 下单过程
 * @param products
 * @param actionField
 */
export function productCheckoutSend(products = null, actionField = null) {
    if (!isArray(products)) {
        products = [products];
    }

    products.map(item => {
        item.quantity = !isUndefined(item.quantity) ? item.quantity : 1;
        return item;
    });

    const pushObj = {
        event: 'eec.checkout',
        ecommerce: {
            checkout: {
                products,
            },
        },
    };

    if (isObject(actionField)) {
        pushObj.ecommerce.checkout.actionField = actionField;
    }
    if (isUndefined(pushObj.ecommerce.checkout.actionField.list)) {
        pushObj.ecommerce.checkout.actionField.list = '搜索列表';
    }

    dataLayer.push(pushObj);
}

/**
 * 交易成功
 * @param products
 * @param actionField
 */
export function productPurchaseSend(products = null, actionField = null) {
    if (!isArray(products)) {
        products = [products];
    }

    const pushObj = {
        event: 'eec.purchase',
        ecommerce: {
            currencyCode,
            purchase: {
                products,
            },
        },
    };

    if (isObject(actionField)) {
        pushObj.ecommerce.purchase.actionField = actionField;
    }

    if (isUndefined(pushObj.ecommerce.purchase.actionField.list)) {
        pushObj.ecommerce.purchase.actionField.list = '搜索列表';
    }

    dataLayer.push(pushObj);
}

/**
 * 优惠券展示
 * @param promotions
 */
export function productPromotionViewSend(promotions = null) {
    if (!isArray(promotions)) {
        promotions = [promotions];
    }

    const pushObj = {
        event: 'eec.promotionView',
        ecommerce: {
            promoView: {
                promotions,
            },
        },
    };
    dataLayer.push(pushObj);
}

/**
 * 优惠券使用
 * @param promotions
 */
export function productPromotionClickSend(promotions = null) {
    if (!isArray(promotions)) {
        promotions = [promotions];
    }

    const pushObj = {
        event: 'eec.promotionClick',
        ecommerce: {
            promoClick: {
                promotions,
            },
        },
    };
    dataLayer.push(pushObj);
}

/**
 * 退款
 * @param orderId
 */
export function productRefundSend(orderId) {
    if (isString(orderId)) {
        dataLayer.push({
            event: 'eec.refund',
            ecommerce: {
                refund: {
                    actionField: {
                        id: orderId,
                    },
                },
            },
        });
    }
}
