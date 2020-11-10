export default function noop() { }


/**
 * sleep函数
 * @param {*} ms 毫秒
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}