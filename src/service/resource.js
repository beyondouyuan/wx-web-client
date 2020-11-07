import { apiPost } from '../utils/http';

export async function requestResourceList(data = {}) {
    const api = '/website/api/weixin/getResourceAndOpportunitiesList.action';
    return await apiPost(api, data);
}


export async function requestResourcePublish(data = {}) {
    const api = '/website/api/weixin/toResourceAndOpportunities.action';
    return await apiPost(api, data);
}

export async function requestResourceDetail(data = {}) {
    const api = '/website/api/weixin/getResourceAndOpportunitiesDetail.action';
    return await apiPost(api, data);
}
