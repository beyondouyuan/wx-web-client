// 路由跳转二：用withRouter
import React from 'react';
import './style.scss';
import { withRouter } from 'react-router-dom';
import { jumpLink } from '../../../../utils/url';

function Item(props) {
    return (
        <div className='notice-item-container'>
            <div className='notice-item' onClick={
                () => {
                    jumpLink({
                        url: props.newUrl
                    })
                }
            }>
                <div className='notice-item-image'></div>
                <div className='notice-item-main'>
                    <div className='title'>{props?.conTextTitle}</div>
                </div>
            </div>
        </div>
    )
}
export default withRouter(Item)