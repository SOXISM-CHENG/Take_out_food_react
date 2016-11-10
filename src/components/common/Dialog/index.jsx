/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import { Modal } from 'antd';

export default class Dialog extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                {...this.props}
                title={this.props.title}
                className={'dialog '+(this.props.className || '')}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                onOk={this.props.onOk}
                footer={this.props.footer||undefined}
            >
                <div className="dialog-body">
                    {this.props.children}
                </div>
            </Modal>
        );
    }
}
