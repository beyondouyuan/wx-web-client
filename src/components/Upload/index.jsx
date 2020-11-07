import React, { Component } from 'react';
import './style.scss';

const max = 3
export default class Upload extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            show: false,
            preview: [],
            list: [],
            count: 0
        }
        this.handleTransforPreview = this.handleTransforPreview.bind(this)
    }
    handleFileChange(event) {
        const file = event.target.files[0]
        // 预览
        this.handleTransforPreview(file)
    }
    handleChooseImage(event) {
        document.getElementById('upload').click()
    }
    handleTransforPreview(file) {
        const { list, count } = this.state
        const self = this
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
            // 此处this指向reader回调结果哦
            list.push(this.result)
            console.log(this.result)
            self.setState({
                show: true,
                preview: [...list],
                list: [...list],
                count: count + 1
            }, () => {
                self.props.onSucceed && self.props.onSucceed(self.state.list)
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
                                preview.map((item) => {
                                    return (
                                        <img key={item} src={item} />
                                    )
                                })
                            ) : null
                        }
                    </div>
                </div>
                <input
                    disabled={this.state.count >= 3}
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