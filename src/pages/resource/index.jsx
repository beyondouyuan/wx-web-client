import React, { Component } from 'react';
import Layout from '@Layout';
import { requestResourceList } from '@service/resource';
import Item from './components/Item';
import NoData from '../../components/NoData';
import throttle from '../../utils/throttle';
import EasyToast from '@components/EasyToast';

import './style.scss';

class Resource extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            currentPage: 1,
            totalPage: 1,
            pageSize: 10,
            loading: false,
            resource: [],
            noMore: false,
            noData: false
        }
        this.handlePublish = this.handlePublish.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.handleThrottleScroll = this.handleThrottleScroll.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
        this.fetchData()
        const scroll = document.getElementById('scroll-main');
        scroll && scroll.addEventListener('scroll', this.handleThrottleScroll)
    }
    componentWillUnmount() {
        const scroll = document.getElementById('scroll-main');
        scroll && scroll.removeEventListener('scroll', this.handleThrottleScroll)
    }
    handlePublish() {
        this.props.history.push('publish')
    }
    handleThrottleScroll(e) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this.handleScroll)
        } else {
            return throttle(this.handleScroll, 300)(e)
        }
    }

    handleScroll(e) {
        const scroll = document.getElementById('scroll-main');
        const scrollTop = scroll.scrollTop;
        const offsetHeight = scroll.offsetHeight;
        if (scrollTop + 50 >= offsetHeight) {
            if (this.state.currentPage + 1 > this.state.totalPage) return
            this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
            }), () => {
                this.fetchData()
            })
        }
    }
    async fetchData() {
        try {
            const result = await requestResourceList({
                page: this.state.currentPage,
                pagesize: this.state.pageSize
            });
            if (result.code === 'C0000') {
                this.setState(prevState => ({
                    resource: prevState.resource.concat(result?.data?.listJson?.list || []),
                    noData: result?.data?.listJson?.list?.length ? false : true,
                    totalPage: result.data.totalPage
                }))
            } else {
                EasyToast.info('获取数据失败')
            }
        } catch (error) {
            EasyToast.info(`网络错误`)
        }
    }
    renderNoData() {
        return (
            <Layout view='resource'>
                <div className='resource-container'>
                    <div className='resource-content'>
                        <div className='resource-main'>
                            <NoData text={'暂无资源内容'} />
                        </div>
                    </div>
                    <div className='resource-page-footer'>
                        <div className='submit-btn' onClick={this.handlePublish}>
                            我要发布
                    </div>
                    </div>
                </div>
            </Layout>

        )
    }
    render() {
        const { resource, noMore, noData } = this.state;
        if (noData) {
            return this.renderNoData()
        }
        return (
            <Layout view='resource'>
                <div className='resource-container'>
                    <div className='resource-content'>
                        <div className='resource-main' id='scroll-main'>
                            {
                                resource.map((item) => {
                                    return <Item key={item.resourceId} {...this.props} {...item} />
                                })
                            }
                            {
                                noMore && (
                                    <div className='no-more'>暂无更多数据</div>
                                )
                            }
                        </div>
                    </div>
                    <div className='resource-page-footer'>
                        <div className='submit-btn' onClick={this.handlePublish}>
                            我要发布
                    </div>
                    </div>
                </div>
            </Layout>

        )
    }
}

export default Resource