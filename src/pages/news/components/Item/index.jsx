// 路由跳转二：用withRouter
import React from 'react';
import { jumpLink } from '../../../../utils/url';
import './style.scss'

function Item(props) {
    return (
        <div className='news-item-container'>
            <div className='news-item' onClick={
                () => {
                    jumpLink({
                        url: props.newUrl
                    })
                    // props.history.push(`/news/${props.newId}`)
                }
            }>
                <div className='news-item-image'>
                    <img className='news-images' src={props.firstPicUrl} alt='新闻图片' />
                </div>
                <div className='news-item-main'>
                    <div className='title'>{props?.conTextTitle}</div>
                    <div className='desc'>{props?.conText}</div>
                </div>
            </div>
        </div>
    )
}
export default Item