import React, { Component } from 'react';
import Layout from '@Layout';
import { requestPostJoin, requestSMSCode } from '../../service/join';
import { requestUserInfo } from '../../service/common'
import EasyToast from '../../components/EasyToast';
import { Radio, RadioGroup } from '../../components/Radio';


import './style.scss';


const validate = {
    "userName": "姓名",
    "phone": "手机号码",
    "smsCode": "短信验证码",
    "graduateGgrade": "级别",
    "workCity": "工作地点",
    "companyName": "工作单位",
}

const seletctOptions = [
    { text: "金融保险", value: 'HULIANWANG_FINACE' },
    { text: "生活/咨询服务", value: 'SHENGHUO_ZIXUN' },
    { text: "教育/医疗", value: 'JIAOYU_YILIAO' },
    { text: "酒店商旅", value: 'JIUDIAN' },
    { text: "旅游服务", value: 'LVYOU' },
    { text: "票务服务", value: 'PIAOWU' },
    { text: "母婴/玩具", value: 'MUYING' },
    { text: "房地产", value: 'FANGDICHANG' },
    { text: "社会公益", value: 'GONGYI' },
    { text: "线下零售", value: 'XIANXIALINGSHOU' },
    { text: "通信服务", value: 'TONGXINFUWU' },
    { text: "快递运输", value: 'KUAIDI' },
    { text: "电商/团购", value: 'DIANSHANG' },
    { text: "娱乐/健身", value: 'YULEJIANSHEN' },
    { text: "公共事业缴费", value: 'GONGGONGJIAOFEI' },
    { text: "其他生活缴费", value: 'QITAJIAOFEI' },
    { text: "教育/培训", value: 'JIAOYUPEIXUN' },
    { text: "建材/装饰", value: 'JIANCAIZHUANGSHI' },
    { text: "苗木/绿化", value: 'SHUMULVHUA' },
    { text: "机械/电子", value: 'JIXIEDIANZI' },
    { text: "数字娱乐", value: 'SHUZIYULE' },
    { text: "网络虚拟服务", value: 'WANGLUO' },
    { text: "软件开发", value: 'RUANJIAN' },
    { text: "餐饮/食品", value: 'CANYIN' },
    { text: "收藏/宠物", value: 'SHOUCANG' },
    { text: "书籍/音像/文具", value: 'SHUJI' },
    { text: "生活/家居", value: 'SHENGHUOJIAJU' },
    { text: "首饰珠宝", value: 'ZHUBAO' },
    { text: "其他", value: 'QITA' },

]
class Join extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            smsCodeed: true,
            authText: '获取验证码',
            selectedValue: '1',
            params: {},
            industryType: 'HULIANWANG_FINACE',
            userInfo: {}
        }
        this.handleGetAuth = this.handleGetAuth.bind(this)
        this.handleCountDown = this.handleCountDown.bind(this)
        this.handleGetParams = this.handleGetParams.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeRadio = this.handleChangeRadio.bind(this)
    }

    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        const result = await requestUserInfo()
        const userInfo = result?.data?.listJson || {}
        const params = JSON.parse(JSON.stringify(userInfo))
        delete params['industryType']
        this.setState({
            userInfo: {
                ...userInfo
            },
            params: {
                ...params
            }
        })
    }

    async handleGetAuth() {
        if (!this.state.params.phone) {
            EasyToast.info('请输入手机号码')
            return
        }
        const result = await requestSMSCode({
            phone: this.state.params.phone,
            state: 'wxd723392f19d2eba5'
        })
        if (result.code === 'C0000') {
            EasyToast.success('发送成功')
            this.handleCountDown(60)
        } else {
            EasyToast.info('发送失败')
        }
    }

    async handleSubmit() {

        try {
            Object.keys(validate).forEach(key => {
                if (!this.state.params[key]) {
                    throw new Error(`请输入${validate[key]}`);//报错，就跳出循环
                }
            })
        } catch (error) {
            EasyToast.info(`${error.message}`)
            return
        }
        try {
            const result = await requestPostJoin({
                ...this.state.params,
                realSex: this.state.selectedValue,
                industryType: this.state.industryType
            })
            if (result.code === 'C0000') {
                EasyToast.info('提交成功')
                this.props.history.push(`/news`)
            } else {
                EasyToast.info('提交失败')
            }
        } catch (error) {
            EasyToast.info(`网络错误`)
        }
    }

    handleGetParams(e) {
        const obj = {
            [e.target.name]: e.target.value
        }
        this.setState(
            prevState => ({
                params: {
                    ...prevState.params,
                    ...obj
                }
            })
        )
    }

    handleSlected(e) {
        this.setState({
            industryType: v
        })
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
    handleChangeRadio(v) {
        this.setState({ selectedValue: v });
    }
    render() {
        const { smsCodeed, authText, userInfo } = this.state
        return (
            <Layout
                view='join'
            >
                <div className='join-container'>
                    <div className='join-wrapper'>
                        <div className='join-content'>
                            <div className='join-main'>
                                <div className='header'>完善信息</div>
                                <div className='join-form'>
                                    <div className='form-item'>
                                        <span className='label-item'>姓名</span>
                                        <input defaultValue={userInfo.userName} name='userName' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入姓名' />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>性别</span>
                                        <RadioGroup name="platform" selectedValue={userInfo.userName ? userInfo.userName : this.state.selectedValue} onChange={(event) => { this.handleChangeRadio(event) }}>
                                            <Radio value="1">男</Radio>
                                            <Radio value="0">女</Radio>
                                        </RadioGroup>
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>手机号码</span>
                                        <input defaultValue={userInfo.phone} name='phone' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入手机号码' />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>验证码</span>
                                        <input name='smsCode' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入验证码' />
                                        <div className="auth-wrapper">
                                            <button disabled={!smsCodeed} className="auth-btn" onClick={this.handleGetAuth}>{authText}</button>
                                        </div>
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>届别</span>
                                        <input defaultValue={userInfo.graduateGgrade} name='graduateGgrade' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入届别' />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>行业</span>
                                        <select className='input-item select-box' name='industryType' onChange={this.handleSlected}>
                                            {seletctOptions.map((item) => {
                                                return (
                                                    <option className='item' key={item.value} value={item.value}>{item.text}</option>
                                                )
                                            })}
                                        </select>
                                        {/* <input name='industryType' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入行业' /> */}
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>所在城市</span>
                                        <input defaultValue={userInfo.workCity} name='workCity' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入所在城市' />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>单位名称</span>
                                        <input defaultValue={userInfo.companyName} name='companyName' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入单位名称' />
                                    </div>
                                    <div className='form-item'>
                                        <span className='label-item'>职务</span>
                                        <input defaultValue={userInfo.companyPosition} name='companyPosition' onChange={this.handleGetParams} className='input-item' type='text' placeholder='请输入您的职务' />
                                    </div>
                                </div>
                                <div className='submit-containner'>
                                    <div className='btn' onClick={this.handleSubmit}>提交信息</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Join