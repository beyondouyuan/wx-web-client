import { apiGet } from '../utils/http';

export async function requestNoticeList(data = {}) {
    const api = 'api/notice';
    return await apiGet(api, data);
}