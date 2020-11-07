import { apiPost } from '../utils/http';

export async function requestNewsList(data = {}) {
    const api = '/website/api/weixin/getNewList.action';
    return await apiPost(api, data);
}

export async function requestNewsDetail(data = {}) {
    const api = '/website/api/weixin/getNewListDetail.action';
    return await apiPost(api, data);
}