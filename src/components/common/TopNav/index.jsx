/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import { Link } from 'react-router';
import UserBox from 'components/common/UserBox';

function mapStateToProps({common}) {
    return {
        position: common.position
    };
}

export class TopNav extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { position,userInfo } = this.props;
        return (
            <div className='top-nav'>
                <div className="nav-content">
                    <div className="nav-left">
                        <i className="fa fa-map-marker marker-icon"></i>
                        <span className='city'>{position.city}</span>
                        <span className='area'>{position.title || position.address}</span>
                        <Link to='/map' className='change-address'>[切换地址]</Link>
                    </div>
                    <div className="nav-right">
                        <UserBox/>
                        <div className="moblie-home">
                            <div className="moblie">
                                <Link to={"/download"}>
                                    <i className="fa fa-mobile-phone mr5"></i>
                                    手机版
                                </Link>
                            </div>
                            <div className="home">
                                <i className="fa fa-home mr5"></i>
                                <a href="/#/">react外卖官网</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(TopNav)
