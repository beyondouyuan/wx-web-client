import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { parseSearchParams } from '@utils/url'
import { getToken, setToken, removeToken } from '@utils/storage'
import { jumpLink } from '../utils/url'
import './style.scss';

const oauth = `https://open.weixin.qq.com/connect/oauth2/authorize`
const appid = `wxd723392f19d2eba5`
const redirect_uri = `http://2709336e.nat123.cc/boss/weixin/toApp.action`
const localState = `wxd723392f19d2eba5`
const localView = `join`

function generateUrl(view = localView, state = localState) {
    return `${oauth}?appid=${appid}&redirect_uri=${redirect_uri}?view=${view}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
}

class Layout extends Component {
    constructor() {
        super(...arguments)
    }
    componentDidMount() {
        const params = parseSearchParams()
        const { code, state } = params
        const condition = {
            code,
            state
        }
        code && setToken(condition)
        const localToken = getToken()
        if(!localToken?.code) {
            jumpLink({
                url: generateUrl(this.props.view, localState)
            })
        }
    }
    render() {
        const { children } = this.props
        return(
            <div className='layout-container'>
                { children }
            </div>
        )
    }
}

export default withRouter(Layout)