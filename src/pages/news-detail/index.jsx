import React, { Component } from 'react';
import Layout from '@Layout';
import EasyToast from '../../components/EasyToast';
import { requestNewsDetail } from '../../service/news';


import './style.scss';

class NewsDetail extends Component {
    constructor() {
        super(...arguments)
    }
    async fetchData() {
        const newsId = this.props.match.params.id;
        try {
            const result = await requestNewsDetail({
                newId: newsId
            });
            if (result.code === 'C0000') {
                this.setState(prevState => ({
                    news: prevState.news.concat(result?.data?.listJson?.list || []),
                    noData: result.data.listJson.list.length ? false : true
                }))
                // EasyToast.info('提交成功')
            } else {
                // EasyToast.info('提交失败')
            }
        } catch (error) {
            EasyToast.info(`网络错误`)
        }
    }
    render() {
        return (
            <Layout view='news-detail'>
                <div>
                    新闻详情
                </div>
            </Layout>

        )
    }
}

export default NewsDetail