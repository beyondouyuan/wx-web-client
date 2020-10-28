import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Item from './components/Item';
import NoData from '../../components/NoData';
import throttle from '../../utils/throttle';

import './style.scss';

const resource = [{
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀，2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 1
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 2
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 3
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 4
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 5
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 6
}, {
    title: '我校隆重举行秋季学期开学典礼',
    desc: '2020年9月1日清晨，阳光明媚，秋高气爽。我校4100多师生相聚在共青湖畔美丽的两中校园怀',
    id: 7
}]

class Resource extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            currentPage: 1,
            loading: false,
            resource: resource,
            curId: resource.length,
            noMore: false,
            noData: false
        }
        this.handlePublish = this.handlePublish.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.handleThrottleScroll = this.handleThrottleScroll.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
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
        if(window.requestAnimationFrame) {
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
            resource: prevState.resource.concat(arr)
        }))
    }
    renderNoData() {
        return (
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
        )
    }
    render() {
        const { resource, noMore, noData } = this.state;
        if (noData) {
            return this.renderNoData()
        }
        return (
            <div className='resource-container'>
                <div className='resource-content'>
                    <div className='resource-main' id='scroll-main'>
                        {
                            resource.map((item) => {
                                return <Item key={item.id} {...item} />
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
        )
    }
}

export default withRouter(Resource)