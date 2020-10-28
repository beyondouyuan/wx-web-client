import React, { Component } from 'react';
import avator from './assets/images/avatar.jpg';
import { Link } from "react-router-dom";

import './style.scss';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {
                name: 'myname',
                age: 10
            }
        }
    }

    render() {
        return (
            <div>
                <ul className='menu'>
                    <li className='menu-item'><Link to="/join">加入我们</Link></li>
                    <li className='menu-item'><Link to="/constitution">章程</Link></li>
                    <li className='menu-item'><Link to="/group">校友群</Link></li>
                    <li className='menu-item'><Link to="/news">新闻</Link></li>
                    <li className='menu-item'><Link to="/notice">公示</Link></li>
                    <li className='menu-item'><Link to="/resource">资源</Link></li>
                </ul>
            </div>
        )
    }
}

export default Home