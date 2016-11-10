/*
 * @Author: mocheng
 */
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import { Link } from 'react-router';
import Img from 'common/Img';
import History from 'common/History';
import { message } from 'antd';


function mapStateToProps() {
    return {

    };
}

export class Header extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }
    renderSearch(){
        return (
            <div className="search-bar">
                <div className="search-content">
                    <i className='fa fa-search search-icon'></i>
                    <div className="search-wrap">
                        <input
                            type="text"
                            className='search-input'
                            placeholder='搜索商家'
                        />
                    </div>
                    <button type='button' className='search-btn' >
                        搜索
                    </button>
                </div>
            </div>
        );
    }
    render() {
        return (
            <header className="header">
                <div className="header-content">
                    <Link to='/' className='left-logo'>
                        <Img alt="react外卖" src="logo.png" className="sign_img"/>
                    </Link>
                    <div className="menu">
                        <Link to='/' className='menu-item'>
                            首页
                        </Link>
                        <span>|</span>
                        <Link to='/user/order' className='menu-item'>
                            我的外卖
                        </Link>
                        <span>|</span>
                        <a href='/#/' className='menu-item'>
                            商家入驻
                        </a>
                    </div>
                </div>
            </header>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(Header)
