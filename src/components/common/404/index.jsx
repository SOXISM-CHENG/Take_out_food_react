/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import { Link } from 'react-router';
import Img from 'common/Img';
import History from 'common/History';

export default class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            time: 5
        };
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            }, () => {
                if (this.state.time == 0) {
                    clearInterval(this.timer);
                    History.push('/')
                }
            });
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        return (
            <div className='page-404'>
                <div className="content">
                    <div className="bg">
                        <Img src='404bg.png' />
                    </div>
                    <Link to='/' className="time">返回首页 {this.state.time}</Link>
                </div>
            </div>
        );
    }
}
