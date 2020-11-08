import React, { Component } from 'react';
import Layout from '@Layout';
import Item from './components/Item';
import NoData from '@components/NoData';
import EasyToast from '@components/EasyToast';
import throttle from '@utils/throttle';
import { getScrollHeight, getScrollTop, getWindowHeight } from '@utils/scroll'
import './style.scss';
import { requestNewsList } from '@service/news'

class News extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            currentPage: 1,
            totalPage: 1,
            pageSize: 10,
            loading: false,
            news: [],
            noMore: false,
            noData: true
        }
        this.handleScroll = this.handleScroll.bind(this)
        this.handleThrottleScroll = this.handleThrottleScroll.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }
    componentDidMount() {
        this.fetchData()
        window.addEventListener('scroll', this.handleThrottleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleThrottleScroll)
    }
    handleThrottleScroll(e) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this.handleScroll)
        } else {
            return throttle(this.handleScroll, 300)(e)
        }
    }
    handleScroll(e) {
        if (getScrollTop() + getWindowHeight() + 50 >= getScrollHeight()) {
            if(this.state.currentPage + 1 > this.state.totalPage) return
            this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
            }), () => {
                this.fetchData()
            })
        }
    }
    async fetchData() {
        try {
            const result = await requestNewsList({
                page: this.state.currentPage,
                pagesize: this.state.pageSize
            });
            if (result.code === 'C0000') {
                this.setState(prevState => ({
                    news: prevState.news.concat(result?.data?.listJson?.list || []),
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
            <Layout view='news'>
                <div className='news-container'>
                    <div className='news-content'>
                        <div className='news-main'>
                            <NoData text={'暂无新闻哪哦那个'} />
                        </div>
                    </div>
                </div>
            </Layout>

        )
    }
    render() {
        const { news, noMore, noData } = this.state
        if (noData || !news.length) {
            return this.renderNoData()
        }
        return (
            <Layout>
                <div className='news-container'>
                    <div className='news-content'>
                        <div className='news-main'>
                            {
                                news.map((item) => {
                                    return <Item key={item.newId} {...item} />
                                })
                            }
                            {
                                noMore && (
                                    <div className='no-more'>暂无更多数据</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Layout>

        )
    }
}

export default News