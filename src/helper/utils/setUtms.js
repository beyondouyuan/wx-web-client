/* eslint-disable camelcase */

import { isCrcApp, isZZCApp, isAliPayMiniprogram, isMiniprogram } from './native';
import { parseSearchParams } from './url';
import { UTM } from './const';
import Local from './local-storage';

// 增加渠道统计
/**
 * 目前两种渠道增加（下单时用到）
 *  _um_campaign, _um_channel,针对小程序友盟后台生成的活动
 * utm_medium，utm_campaign，针对我们自己产品手动加上的
 */
export default function setUTMData() {
    const {
        _um_campaign,
        _um_channel,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term
    } = parseSearchParams();

    // 友盟自动生成的活动
    if (_um_campaign && _um_channel) {
        let utmSource = 'topic';
        const sourceMap = {
            crc_app: isCrcApp(),
            zzc_app: isZZCApp(),
            crc_mini_wx: isMiniprogram(),
            crc_mini_zfb: isAliPayMiniprogram()
        };

        Object.keys(sourceMap).forEach((item) => {
            if (sourceMap[item]) {
                utmSource = item;
            }
        });

        const utm = {
            utm_source: utmSource,
            utm_medium: _um_channel,
            utm_campaign: _um_campaign
        };

        Local.set(UTM, utm, '30');
    }

    // 我们国内租车的活动
    if (utm_medium && utm_source) {
        const utm = {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term
        };
        Local.set(UTM, utm, '30');
    }
}
