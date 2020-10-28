import React, { Component } from 'react';
import './style.scss';

export default class Upload extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            show: false,
            preview: ''
        }
        this.handleTransforPreview = this.handleTransforPreview.bind(this)
    }
    handleFileChange(event) {
        const file = event.target.files[0]
        // 预览
        this.handleTransforPreview(file)
        this.props.onSucceed && this.props.onSucceed(file)
    }
    handleChooseImage(event) {
        document.getElementById('upload').click()
    }
    handleTransforPreview(file) {
        const self = this
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
            // 此处this指向reader回调结果哦
            self.setState({
                show: true,
                preview: this.result
            })
        }
    }
    render() {
        const {
            show,
            preview
        } = this.state
        return (
            <div className='upload-container'>
                <div className='upload-main'>
                    <div className="preview-box">
                        {
                            show ? (
                                <img src={preview} />
                            ) : null
                        }
                    </div>
                </div>
                <input
                    onChange={(event) => this.handleFileChange(event)}
                    ref='upload'
                    id='upload'
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }} />
                <div
                    className="upload-add"
                    onClick={this.handleChooseImage}
                >
                    <div className="upload-btn" align="center">
                        <i>+</i>
                        <p className="upload-text">添加图片</p>
                    </div>
                </div>
            </div>
        )
    }
}