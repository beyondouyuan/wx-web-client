// 路由跳转二：用withRouter
import React from 'react';
import './style.scss';

function Item(props) {
    return (
        <div className='resource-item-container'>
            <div className='resource-item' onClick={
                () => {
                    props.history.push(`/resource-detail?id=${props.resourceId}`)
                }
            }>
                <div className='resource-item-image'></div>
                <div className='resource-item-main'>
                    <div className='title'>{props?.conTextTitle}</div>
                    <div className='desc'>{props?.conText}</div>
                </div>
            </div>
        </div>
    )
}
export default Item