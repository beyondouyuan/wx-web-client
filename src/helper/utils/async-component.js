/**
 * 异步import组件
 */

import React, { Component } from "react";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        async componentDidMount() {
            if (importComponent) {
                const { default: component } = await importComponent();

                this.setState({
                    component: component
                });
            }
        }
        // 组件销毁之后不允许再调用this.setState
        componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}