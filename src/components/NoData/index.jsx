import React from 'react';
import './style.scss';

export default function(props) {
    return (
        <div className='no-data-container'>
            <div className='no-data-main'></div>
            <div className='no-data-content'>
                {props.text}
            </div>
        </div>
    )
}