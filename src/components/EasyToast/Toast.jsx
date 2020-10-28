import React, { Component } from 'react'
import classnames from 'classnames';
import Icon from '@components/Icon';
import { CSSTransition } from 'react-transition-group';

class ToastContainer extends Component {
    constructor() {
        super()
        this.transitionTime = 300
        this.state = { notices: [], show: false }
        this.removeNotice = this.removeNotice.bind(this)
    }

    getNotice() {
        const { notices } = this.state
        return `notice-${new Date().getTime()}-${notices.length}`
    }

    addNotice(notice) {
        const { notices } = this.state
        notice.key = this.getNotice()

        // notices.push(notice);//展示所有的提示
        notices[0] = notice;//仅展示最后一个提示

        this.setState({ notices, show: true })
        if (notice.duration > 0) {
            setTimeout(() => {
                this.setState({
                    show: false
                })
            }, (notice.duration * 1000))
            // +500 是为了给CSSTransition的in属性充足过度时间
            setTimeout(() => {
                this.removeNotice(notice.key)
            }, (notice.duration * 1000) + 500)
        }
        return () => { this.removeNotice(notice.key) }
    }

    removeNotice(key) {
        const { notices } = this.state
        this.setState({
            notices: notices.filter((notice) => {
                if (notice.key === key) {
                    if (notice.onClose) setTimeout(notice.onClose, this.transitionTime)
                    return false
                }
                return true
            }),
            show: false
        })
    }

    render() {
        const { notices, show } = this.state
        const icons = {
            success: 'success',
            error: 'error',
            loading: 'loading',
            warning: 'warning',
        }

        return (
            <div className="easy-toast-container">
                <CSSTransition
                    in={show}
                    timeout={500}
                    classNames={'toast-fade'}
                    unmountOnExit={true}
                >
                    <div className='easy-toast-animation'>
                        {
                            notices.map(notice => {
                                const cls = classnames({
                                    'toast-notice': true,
                                    'toast-notice-icon': icons[notice.type] ? true : false,
                                    'toast-notice-text': icons[notice.type] ? false : true
                                });
                                const txtCls = classnames({
                                    'toast-text': true,
                                    'toast-text-line-clamp': notice.content.length > 14 ? true : false // 多行
                                })
                                return (
                                    <div className="toast-mask" key={notice.key}>
                                        <div className={cls}>
                                            {
                                                icons[notice.type] ? (

                                                    <div className={`toast-icon toast-icon-${icons[notice.type]}`}>
                                                        <Icon name={`toast_${icons[notice.type]}`} />
                                                    </div>
                                                ) : null
                                            }
                                            <div className={txtCls}>{notice.content}</div>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </CSSTransition>

            </div>
        )
    }
}


export default ToastContainer