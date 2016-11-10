/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import { Spin } from 'antd';

export default class Loading extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state={
            loading:false
        }
    }



    render() {
        return (
            <div className={"loading-body "+(this.props.className||'')}>
                <Spin tip="正在努力加载中..." spinning={this.props.isLoading}>
                    {this.props.children}
                </Spin>
            </div>
        );
    }
}
