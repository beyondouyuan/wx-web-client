import React, { Component } from 'react';
import Layout from '@Layout';
import NoData from '@components/NoData';
import EasyToast from '@components/EasyToast';
import { requestResourceDetail } from '@service/resource';
import { isEmptyObject } from '../../utils/type';

import { parseSearchParams } from '../../utils/url';
import './style.scss';
class ResourceDetail extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            detail: {},
            noData: true
        }
        this.fetchData = this.fetchData.bind(this)
    }
    componentDidMount() {
        this.fetchData()
    }
    async fetchData() {
        const params = parseSearchParams()
        // console.log(this.props.match.params.id)
        const condition = {
            resourceId: params.id
        }
        try {
            const result = await requestResourceDetail(condition)
            if (result.code === 'C0000') {
                this.setState({
                    detail: result?.data?.listJson,
                    noData: false
                })
            } else {
                EasyToast.info('获取数据失败')
            }
        } catch (error) {
            EasyToast.info('网络错误')
        }
    }
    renderNoData() {
        return (
            <Layout view='resource'>
                <div className='resource-detail-conntainer'>
                    <div className='esource-detail-content'>
                        <div className='esource-detail-main'>
                            <NoData text={'暂无新闻哪哦那个'} />
                        </div>
                    </div>
                </div>
            </Layout>

        )
    }

    render() {
        const { detail, noData } = this.state
        if (noData || isEmptyObject(detail)) {
            return this.renderNoData()
        }
        return(
            <Layout view='resource'>
                <div className='resource-detail-conntainer'>
                    <div className='contennt-title'>{detail.conTextTitle}</div>
                    <div className='contennt-main'>{detail.conText}</div>
                    <div className='contennt-image'>
                    {
                        detail?.picPathList.map((item, index) => {
                            return (
                                <div key={`${index}-key`} className='image-item'>
                                    <img src={item.picPath} />
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </Layout>
        )
    }
}

export default ResourceDetail