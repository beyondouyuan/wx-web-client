import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './pages/home'; // 首页
import Join from './pages/join'; // 加入我们
import Constitution from './pages/constitution'; // 章程
import Group from './pages/group'; // 校友群
import News from './pages/news'; // 活动记录 新闻纪事
import NewsDetail from './pages/news-detail'; //新闻详情
import Notice from './pages/notice'; // 公示
import NoticeDetail from './pages/notice-detail'; // 公示详情
import Resource from './pages/resource'; // 资源对接&工作机会
import ResourceDetail from './pages/resource-detail'; // 资源详情
import ResourcePublish from './pages/resource-publish'; // 发布资源
import FeedBack from './pages/feedback'
import './style.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    {/* 加入我们 */}
                    <Route path="/join" component={Join} />
                    {/* 章程 */}
                    <Route path="/constitution" component={Constitution} />
                    {/* 校友群 */}
                    <Route path="/group" component={Group} />
                    {/*exact不可少，否则跳转不仅详情页*/}
                    {/* 新闻 */}
                    <Route path="/news" exact component={News} />
                    {/* <Route path="/news/:id" component={NewsDetail} /> */}
                    {/* 公示列表 */}
                    <Route path="/notice" exact component={Notice} />
                    {/* 公示详情 */}
                    <Route path="/notice-detail" component={NoticeDetail} />
                    {/* 资源列表 */}
                    <Route path="/resource" exact component={Resource} />
                    {/* 资源详情 */}
                    <Route path="/resource-detail" component={ResourceDetail} />
                    {/* 发布资源 */}
                    <Route path="/publish" component={ResourcePublish} />
                    {/* 反馈 */}
                    <Route path="/feedback" component={FeedBack} />
                </Switch>
            </Router>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('root'));