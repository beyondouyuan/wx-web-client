import { apiPost } from '../utils/http';

export async function requestPostJoin(data = {}) {
    const api = '/website/api/weixin/toJoin.action';
    return await apiPost(api, data);
}

export async function requestSMSCode(data = {}) {
    const api = '/website/sms/sendSmsWeChat.action';
    return await apiPost(api, data);
}