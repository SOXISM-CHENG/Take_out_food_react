/*
 * @Author: mocheng
 */

'use strict';
import React from 'react';
import {
    Provider,
    connect
} from 'react-redux';
import {
    Router,
    Route,
    IndexRoute,
    Redirect
}
from 'react-router'
import store from 'stores';
import {
    requireSetPosition,
    requireLogin
} from 'common/Permission';
import asyncLoader from 'common/asyncLoader';

import PublicMain from 'components/public/Main/';
import PersonNav from 'components/public/PersonNav/';
import NotFound from 'components/common/404';
import Maper from 'bundle?lazy&name=Maper!components/Map/';
import Home from 'bundle?lazy&name=Home!components/Home/';
import Login from 'bundle?lazy&name=Login!components/SignPage/Login/';
import Register from 'bundle?lazy&name=Register!components/SignPage/Register/';

import {
    getMemberDetail,
    otherLogin
} from 'actions/SignPageAction';
import Cookie from "js-cookie";
import History from 'common/History';
import {
    message
} from 'antd';

window.Cookie = Cookie;

function mapStateToProps(state) {
    return {

    };
}

export class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history} >
                    <Route onEnter={autoLogin}>
                        <Route path='/' component={PublicMain} onEnter={requireSetPosition}>
                            <IndexRoute component={asyncLoader(Home)} />
                        </Route>
                        <Route path='/map' component={asyncLoader(Maper)} />
                        <Route path="/login" component={asyncLoader(Login)}/>
                        <Route path="/register" component={asyncLoader(Register)}/>
                        <Route path='/404' component={NotFound} ></Route>
                        <Redirect path='*' to='/404' />
                    </Route>
                </Router>
            </Provider>
        );
    }
}

export default connect(
    mapStateToProps
)(index)

// 自动登录
function autoLogin(rextState, replace, callback) {
    var userInfo = store.getState().common.userInfo;
    if (userInfo) { // store
        console.log("store");
        return callback();
    }
    // session
    let user_id = Cookie.get("user_id");
    // cookie
    let user_info = Cookie.getJSON('user_info') || undefined;
    if (user_id) { // session缓存
        console.log("session缓存");
        store.dispatch(getMemberDetail({
            "memberId": user_id
        }, (re) => {
            callback();
            if (re.result == 1) {
                console.log('用户信息获取成功');
            } else {
                console.log("用户信息获取失败");
            }
        }))
    } else if (user_info) { // cookie  7天自动登录
        console.log("7天自动登录");
        store.dispatch(otherLogin({
            "password": user_info.password,
            "username": user_info.username,
            "expires": false
        }, (re) => {
            if (re.result === 1) {
                console.log('自动登录成功');
                message.success("自动登录成功");
            } else {
                console.log("自动登录失败");
                message.error(re.msg || "自动登录失败");
            }
        }, '/'));
    } else { // 未登录
        console.log("未登录");
        return callback();
    }
}