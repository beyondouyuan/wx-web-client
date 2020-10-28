import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';
import './style.scss';

function createEasyNotification() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const notification = ReactDOM.render(<Toast />, div)
    return {
        addNotice(notice) {
            return notification.addNotice(notice)
        },
        destroy() {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
        }
    }
}

let easyNotification;
const easyNotice = (type, content, duration = 2, onClose) => {
    if (!easyNotification) easyNotification = createEasyNotification();
    return easyNotification.addNotice({ type, content, duration, onClose })
}

const destroy = () => {
    easyNotification && easyNotification.destroy();
    return easyNotification = null;
}


/**
 * EasyToast说明
 * 
 * EasyToast.info(content) 普通信息通知
 * EasyToast.success(content) 成功信息通知
 * EasyToast.error(content) 错误信息通知
 * EasyToast.warning(content) 警告信息通知
 * EasyToast.loading(content) 加载信息通知
 * EasyToast.hide() EasyToast强制关闭
 * 
 * EasyToast.success('获取成功', 3000, () => {
 *  console.log('回调')
 *  EasyToast.hide() // 强制关闭
 * })
 * 
 * EasyToast接收三个参数：
 * 第一个参数为需要展示的msg即展示内容
 * 第二个参数为展示时长，单位为秒(s)，默认为2s
 * 第三个参数为展示后的回调，默认执行Toast强制关闭函数
 * 
 * info方法不支持图标展示
 * hide将会将EasyToast从DOM中完全移除
 */
export default {
    info(content, duration, onClose = destroy) {
        setTimeout(() => {
            return easyNotice('info', content, duration, onClose)
        }, 0)
    },
    success(content = '操作成功', duration, onClose = destroy) {
        setTimeout(() => {
            return easyNotice('success', content, duration, onClose)
        }, 0)
    },
    error(content, duration, onClose = destroy) {
        setTimeout(() => {
            return easyNotice('error', content, duration, onClose)
        }, 0)
    },
    warning(content, duration, onClose = destroy) {
        /**
         * 加setTimeout用以解决页面在componentDidMount阶段就调用了EasyToast的报错情况
         * 如fetch数据时调用EasyToast
         * 当在页面的componentDidMount阶段调用EasyToast时
         * EasyToast中的createEasyNotification调用了ReactDOM.render(<Toast />, div)方法
         * 而嵌套使用的ReactDOM.render()方法不再保证同步执行【https://github.com/facebook/react/issues/12315】
         * 此时ReactDOM.render()将会返回null，引发报错
         * 基于以上，解决方法：加上setTimeout变成异步即可
         */
        setTimeout(() => {
            return easyNotice('warning', content, duration, onClose)
        }, 0)
    },
    loading(content = '加载中...', duration, onClose = destroy) {
        setTimeout(() => {
            return easyNotice('loading', content, duration, onClose)
        }, 0)
    },
    hide: destroy
}