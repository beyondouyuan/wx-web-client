/**
 * 获取客服入口链接
 *
 * 该链接由node生成，因链接需要根据环境区分不同的参数
 *
 * @type {string}
 */
let keFuChatUrl = ''; // 缓存作用，不多次访问DOM

export default function getKeFuChatUrl() {
    if (!keFuChatUrl) {
        const $keFuChatUrl = document.getElementById('js-service-href');
        if ($keFuChatUrl) {
            // eslint-disable-next-line no-script-url
            keFuChatUrl = $keFuChatUrl.getAttribute('href') || 'javascript:;';
        }
    }
    return keFuChatUrl;
}

let serverCode = null;

export function getServerCodeDOM () {
    if (!serverCode) {
        const $serverCode = document.getElementById('js-render-service-code').getElementsByTagName('p')[0].innerHTML;
        if ($serverCode) {
            // eslint-disable-next-line no-script-url
            serverCode = $serverCode
        }
    }
    return serverCode;
}