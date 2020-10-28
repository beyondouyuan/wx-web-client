import React, { Component } from 'react';
import './style.scss';

class Dialog extends Component {
    render() {
        return this.props.visible ? (
            <div className="dialog-mask">
                <div className="dialog-wrap">
                    <div className="header">
                        <div className="title">{this.props.title}</div>
                    </div>
                    <div className="body">
                        {this.props.children}
                    </div>
                    <div className="footer">
                        <div className="cancel" onClick={() => { this.props.onCancel() }}>取消</div>
                        <div className="confirm" onClick={() => { this.props.onConfirm() }}>确定</div>
                    </div>
                </div>
            </div>
        ) : null
    }
}
export default Dialog;