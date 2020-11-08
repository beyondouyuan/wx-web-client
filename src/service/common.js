import { apiPost } from '../utils/http';

export async function requestFeedback(data = {}) {
    const api = '/website/api/weixin/toFeedback.action';
    return await apiPost(api, data);
}


export async function requestUserInfo(data = {}) {
    const api = '/website/api/weixin/toJoinUsDetail.action';
    return await apiPost(api, data);
}


export async function requestNoticeList(data = {}) {
    const api = '/website/api/weixin/getAnnouceList.action';
    return await apiPost(api, data);
}