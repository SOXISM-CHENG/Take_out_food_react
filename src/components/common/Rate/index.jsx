/*
 * @Author: mocheng
 */

'use strict';
import React from 'react';
import {
    Rate
} from 'antd';

export default class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Rate allowHalf count={5} {...this.props} />
        );
    }
}
