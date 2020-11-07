import React, { Component } from 'react';
import Layout from '@Layout';
import Item from './components/Item';
import NoData from '../../components/NoData';
import throttle from '../../utils/throttle';
import { getScrollHeight, getScrollTop, getWindowHeight } from '../../utils/scroll'
import './style.scss';

const notice = [{
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 1
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 2
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 3
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 4
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 5
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 6
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 7
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 8
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 9
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 10
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '',
    id: 11
}]

class Notice extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            currentPage: 1,
            loading: false,
            notice: notice,
            curId: notice.length,
            noMore: false,
            noData: false
        }
        this.handleScroll = this.handleScroll.bind(this)
        this.handleThrottleScroll = this.handleThrottleScroll.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }
    componentDidMount() {
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
            this.fetchData()
        }
    }
    fetchData() {
        if (this.state.curId >= 30) {
            if (!this.state.noMore) {
                this.setState({
                    noMore: true
                })
            }
            return;
        }
        const arr = []
        for (let i = 0; i < 10; i++) {
            let { curId } = this.state;
            const f = curId;
            arr.push(
                {
                    title: '我校隆重举行秋季学期开学典礼',
                    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
                    id: f + 1
                }
            )
            this.setState({
                curId: f + 1
            })
        }
        this.setState(prevState => ({
            notice: prevState.notice.concat(arr)
        }))
    }
    renderNoData() {
        return (

            <Layout view='notice'>
                <div className='notice-container'>
                    <div className='notice-content'>
                        <div className='notice-main'>
                            <NoData text={'暂无公示内容'} />
                        </div>
                    </div>
                </div>
            </Layout>

        )
    }
    render() {

        const { notice, noMore, noData } = this.state
        if (noData) {
            return this.renderNoData()
        }
        return (
            <Layout>
                <div className='notice-container'>
                    <div className='notice-content'>
                        <div className='notice-main'>
                            {
                                notice.map((item) => {
                                    return <Item key={item.id} {...item} />
                                })
                            }
                            {noMore && (
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

export default Notice