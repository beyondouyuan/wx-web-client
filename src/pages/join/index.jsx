import React, { Component } from 'react';
import Icon from '@components/Icon';

import './style.scss';

class Join extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            smsCodeed: true,
            authText: '获取验证码'
        }
        this.handleGetAuth = this.handleGetAuth.bind(this)
        this.handleCountDown = this.handleCountDown.bind(this)
    }
    handleGetAuth() {
        this.handleCountDown(60)
    }

    handleCountDown(timer) {
        const oldText = '获取校验码'
        if (timer > 0) {
            this.setState({
                smsCodeed: false,
                authText: `${timer}妙`
            })
            timer--
            this.authTimer = setTimeout(() => {
                this.handleCountDown(timer)
            }, 1000)
        } else {
            this.setState({
                smsCodeed: true,
                authText: oldText
            })
            this.authTimer && clearTimeout(this.authTimer)
        }
    }
    render() {
        const { smsCodeed, authText } = this.state
        return (
            <div className='join-container'>
                <div className='join-wrapper'>
                    <div className='join-content'>
                        <div className='join-main'>
                            <div className='header'>完善信息</div>
                            <div className='join-form'>
                                <div className='form-item'>
                                    <span className='label-item'>姓名</span>
                                    <input className='input-item' type='text' placeholder='请输入姓名' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>性别</span>
                                    <input className='input-item' type='text' placeholder='请输入性别' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>手机号码</span>
                                    <input className='input-item' type='text' placeholder='请输入手机号码' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>验证码</span>
                                    <input className='input-item' type='text' placeholder='请输入验证码' />
                                    <div className="auth-wrapper">
                                        <button disabled={!smsCodeed} className="auth-btn" onClick={this.handleGetAuth}>{authText}</button>
                                    </div>
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>届别</span>
                                    <input className='input-item' type='text' placeholder='请输入届别' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>行业</span>
                                    <input className='input-item' type='text' placeholder='请输入行业' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>所在城市</span>
                                    <input className='input-item' type='text' placeholder='请输入所在城市' />
                                </div>
                                <div className='form-item'>
                                    <span className='label-item'>单位名称</span>
                                    <input className='input-item' type='text' placeholder='请输入单位名称' />
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

export default Join