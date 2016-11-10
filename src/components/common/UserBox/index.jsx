/*
 * @Author: MoCheng
 */

'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import { Link } from 'react-router';
import { logout } from 'actions/SignPageAction';

function mapStateToProps({common}) {
    return {
        userInfo: common.userInfo
    };
}

export class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }
    logout=()=>{
        this.props.dispatch(logout());
    }
    renderUnLogin(){
        return (
            <div className="user-box-unlogin">
                <Link to='/register' className="register">注册</Link>
                <span>|</span>
                <Link to='/login' className="login">登录</Link>
            </div>
        )
    }
    renderUserSelect(userInfo){
        return (
            <div className="user-box-select">
                <span className='loginbar-username'>
                    <span>
                        欢迎你，{this.props.userInfo.memberTruename || this.props.userInfo.memberName ||"默认用户"}
                    </span>
                    <i className="fa fa-fw fa-angle-down"></i>
                </span>
                <ul className="login-menu">
                    <li><Link to='/user/order'>我的外卖订单</Link></li>
                    <li><Link to='/user/collect'>我的收藏夹</Link></li>
                    <li><a onClick={this.logout}>退出</a></li>
                </ul>
            </div>
        )
    }
    render() {
        const userInfo = this.props.userInfo;
        if(userInfo){
            return this.renderUserSelect(userInfo);
        }else{
            return this.renderUnLogin();
        }
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(index)
