import React, { Component } from 'react';
import Icon from '@components/Icon';

import './style.scss';

class NoticeDetail extends Component {
    componentDidMount() {
        console.log(this.props.match.params)
    }
    render() {
        return(
            <div>
                公示详情{this.props.match.params.id}
            </div>
        )
    }
}

export default NoticeDetail