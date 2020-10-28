// 路由跳转二：用withRouter
import React from 'react';
import './style.scss';
import { withRouter } from 'react-router-dom';

function Item(props) {
    return (
        <div className='resource-item-container'>
            <div className='resource-item' onClick={
                () => {
                    props.history.push(`/resource/${props.id}`)
                }
            }>
                <div className='resource-item-image'></div>
                <div className='resource-item-main'>
                    <div className='title'>{props?.title}</div>
                    <div className='desc'>{props?.desc}</div>
                </div>
            </div>
        </div>
    )
}
export default withRouter(Item)