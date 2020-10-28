import React from 'react';
import './style.scss';

export default function(props) {
    return (
        <div className='group-card-container'>
            <div className='group-card'>
                {props.title}
            </div>
        </div>
    )
}