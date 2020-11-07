import React, { Component } from 'react';
import Layout from '@Layout';
import './style.scss';

class NoticeDetail extends Component {
    componentDidMount() {
        console.log(this.props.match.params)
    }
    render() {
        return(
            <Layout>
                <div>公示详情{this.props.match.params.id}</div>
            </Layout>
        )
    }
}

export default NoticeDetail