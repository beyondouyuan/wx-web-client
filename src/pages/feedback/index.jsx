import React, { Component } from 'react';
import Layout from '@Layout';
import EasyToast from '@components/EasyToast';

import './style.scss';
import { requestFeedback } from '../../service/common';

class FeedBack extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            content: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGetContent = this.handleGetContent.bind(this)
    }

    async handleSubmit() {
        const params = {
            content: this.state.content
        }
        try {
            const result = await requestFeedback(params)
            if (result.code === 'C0000') {
                EasyToast.info('发布成功')
                this.props.history.push(`/resource`)
            } else {
                EasyToast.info('提交失败')
            }
        } catch (error) {
            EasyToast.info(`网络错误`)
        }
    }

    handleGetContent(e) {
        this.setState({
            content: e.target.value
        })
    }

    render() {
        return (
            <Layout view='feedback'>
                <div className='feedback-container'>
                    <div className='feedback-wrapper'>
                        <div className='feedback-content'>
                            <div className='feedback-main'>
                                <div className='header'>反馈信息</div>
                                <div className='feedback-form'>
                                    <div className='form-item'>
                                        <span className='label-item'>内容</span>
                                        <textarea
                                            placeholder="反馈内容"
                                            className='text-area'
                                            rows="10"
                                            onChange={(e) => { this.handleGetContent(e) }}
                                        />
                                    </div>
                                </div>
                                <div className='submit-containner' onClick={this.handleSubmit}>
                                    <div className='btn'>提交信息</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Layout>
        )
    }
}

export default FeedBack;