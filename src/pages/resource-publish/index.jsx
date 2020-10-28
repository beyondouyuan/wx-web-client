import React, { Component } from 'react';
import Upload from '../../components/Upload';

import './style.scss';

class Publish extends Component {
    constructor() {
        super(...arguments)
        this.state = {

        }
        this.handlePostImage = this.handlePostImage.bind(this)
    }
    handlePostImage(file) {
        const formData = new FormData()
        // 用于上传
        formData.append('file', file)
        return new Promise((resolve, reject) => {
            // 上传
            //   requestUploadIDcard(formData)
            //     .then(res => {
            //       const {
            //         code,
            //         message
            //       } = res
            //       if (code === requestCode) {
            //         resolve(res)
            //       } else {
            //         reject(res)
            //       }
            //     })
            //     .catch(err => {
            //       reject(err)
            //     })
        })
    }
    render() {
        return (
            <div className='publish-container'>
                <div className='publish-wrapper'>
                    <div className='publish-content'>
                        <div className='publish-main'>
                            <div className='header'>发布信息</div>
                            <div className='publish-form'>
                                <div className='form-item'>
                                    <span className='label-item'>标题</span>
                                    <input className='input-item' type='text' placeholder='请输入标题' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>内容</span>
                                    <textarea
                                        placeholder="资源内容"
                                        className='text-area'
                                        rows="10"
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
                                    <input className='input-item' type='text' placeholder='请输入联系方式' />
                                </div>
                            </div>
                            <div className='submit-containner'>
                                <div className='btn'>提交信息</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Publish