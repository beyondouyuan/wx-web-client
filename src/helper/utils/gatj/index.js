
/**
 * ga统计上报
 * @param {String} tjName 统计名称
 * @param {String} tjData 统计数据
 */
export function gaTJPush(tjName = 'sendEvent', tjData) {
    try {
        dataLayer.push({
            event: tjName,
            data: tjData
        });
    } catch (error) {
        
    }
}