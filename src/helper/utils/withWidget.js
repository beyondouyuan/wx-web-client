import React, { Component, useEffect } from 'react';
import { render, createPortal } from 'react-dom';
import * as logger from '@/utils/logger';

// 返回已设置成显示状态的传入组件实例
export const withNormal = (
    Component,
    options = {
        alwaysAppend: true, // 是否每次渲染都重新插入body
    }
) => {
    const { alwaysAppend } = options;
    const container = document.createElement('div');
    const WrapperComponent = withWrapper(Component);
    const body = document.body;
    let WrapperComponentInstance;

    body.appendChild(container);
    return function (props) {
        render(
            <WrapperComponent
                ref={ins => {
                    WrapperComponentInstance = ins;
                }}
                {...props}
            />,
            container,
            () => {
                try {
                    WrapperComponentInstance.show();
                } catch (e) {
                    console.error(e);
                    logger.error('withNormal', e);
                }
            }
        );
        const body = document.body;
        if (alwaysAppend && !container.isEqualNode(body.lastElementChild)) {
            body.appendChild(container);
        }
        return WrapperComponentInstance;
    };
};

/**
 * 创建一个Portal并插入body
 * @param {React.Element} Component - 原始要插入body的组件
 * @param {object} options - 选项
 */
export const withPortal = (
    Component,
    options = {
        alwaysAppend: true, // 是否每次渲染都重新插入body
    }
) => {
    const { alwaysAppend } = options;
    const container = document.createElement('div');
    const WrapperComponent = withWrapper(Component);
    const body = document.body;

    body.appendChild(container);
    return function ({ ref, ...restProps }) {
        if (alwaysAppend && !container.isEqualNode(body.lastElementChild)) {
            body.appendChild(container);
        }
        return createPortal(<WrapperComponent ref={ref} {...restProps} />, container);
    };
};

// 高阶组件，使传入组件成为自控显隐组件
export function withWrapper(WrapperComponent) {
    return class extends Component {
        state = {
            isShow: false,
        };
        top = 0;
        get isShow() {
            return this.state.isShow;
        }
        show = () => {
            const { onShow } = this.props;

            this.setState(
                {
                    isShow: true,
                },
                () => {
                    // 打开弹窗时fixed
                    requestAnimationFrame(() => {
                        this.top = document.body.scrollTop || document.documentElement.scrollTop
                        document.body.style.height = '100%';
                        document.body.style.overflow = 'hidden';
                        // 使body脱离文档流
                        document.body.style.position = 'fixed';
                        document.body.style.top = `-${this.top}px`;
                        document.body.style.width = '100%';
                    })
                    onShow && onShow();
                }
            );
            return this;
        };

        hide = () => {
            const { onHide } = this.props;

            this.setState(
                {
                    isShow: false,
                },
                () => {
                    // 关闭弹窗时static
                    requestAnimationFrame(() => {
                        document.body.style.height = '';
                        document.body.style.overflow = '';

                        document.body.style.position = 'static';
                        document.body.style.top = `0px`;
                        if (this.top === 0) return;
                        window.scrollTo(0, this.top);
                    })
                    onHide && onHide();
                }
            );
            return this;
        };

        render() {
            const { isShow } = this.state;

            return (
                <WrapperComponent
                    isShow={isShow}
                    show={this.show}
                    hide={this.hide}
                    {...this.props}
                />
            );
        }
    };
}
