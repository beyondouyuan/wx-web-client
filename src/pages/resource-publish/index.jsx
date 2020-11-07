import React, { Component } from 'react';
import Layout from '@Layout';
import Upload from '@components/Upload';
import EasyToast from '@components/EasyToast';

import './style.scss';
import { requestResourcePublish } from '@service/resource';

class Publish extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            list: []
        }
        this.handlePostImage = this.handlePostImage.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGetTitle = this.handleGetTitle.bind(this)
        this.handleGetContent = this.handleGetContent.bind(this)
        this.handleGetPhone = this.handleGetPhone.bind(this)
    }
    handlePostImage(file) {
        this.setState({
            list: file
        })
    }
    async handleSubmit() {
        const reg = new RegExp('\\+', 'g')
        const fileList = []
        const { list } = this.state
        for(let i = 0; i < list.length; i++) {
            const name = `${Date.now()}_${i+1}_resource.jpg`
            const head = list[i].indexOf('4') + 2;
            let data = list[i].substring(head, list[i].length - head)
            data.replace(reg, '%2B')
            fileList.push({
                file: data,
                fileName: name
            })
        }
        const params = {
            conTextTitle: this.state.conTextTitle,
            conText: this.state.conText,
            phone: this.state.phone,
            fileList: fileList
        }
        try {
            const result = await requestResourcePublish(params)
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
    handleGetTitle(e) {
        this.setState({
            conTextTitle: e.target.value
        })
    }
    handleGetContent(e) {
        this.setState({
            conText: e.target.value
        })
    }
    handleGetPhone(e) {
        this.setState({
            phone: e.target.value
        })
    }
    render() {
        return (
            <Layout view='publish'>
                <div className='publish-container'>
                    <div className='publish-wrapper'>
                        <div className='publish-content'>
                            <div className='publish-main'>
                                <div className='header'>发布信息</div>
                                <div className='publish-form'>
                                    <div className='form-item'>
                                        <span className='label-item'>标题</span>
                                        <input className='input-item' type='text' placeholder='请输入标题' onChange={(e) => { this.handleGetTitle(e) }} />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>内容</span>
                                        <textarea
                                            placeholder="资源内容"
                                            className='text-area'
                                            rows="10"
                                            onChange={(e) => { this.handleGetContent(e) }}
                                        />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>图片</span>
                                        <div className='upload-item'>
                                            <Upload
                                                onSucceed={this.handlePostImage}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>手机</span>
                                        <input className='input-item' type='text' placeholder='请输入联系方式' onChange={(e) => { this.handleGetPhone(e) }} />
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

export default Publish;