import React, { Component } from 'react';
import GroupCard from './components/Card';

import './style.scss';

const group = [{
    title: '微信群1',
    desc: '微信群1简述',
    id: 1
}, {
    title: '微信群1',
    desc: '微信群1简述',
    id: 2
}, {
    title: '微信群1',
    desc: '微信群1简述',
    id: 3
}, {
    title: '微信群1',
    desc: '微信群4简述',
    id: 4
}]

class Group extends Component {
    render() {
        return(
            <div className='group-container'>
                {
                    group.map((item) => {
                        return <GroupCard key={item.id} {...item} />
                    })
                }
            </div>
        )
    }
}

export default Group;