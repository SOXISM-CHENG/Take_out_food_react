/*
 * @Author: mocheng
 */

'use strict';
import store from 'stores';
import React from 'react';
import {
    Link
} from 'react-router';
import History from 'common/History';
import { getPosition } from 'actions/commonAction';
import { toggleLoginDialog } from 'actions/SignPageAction';
function noop() {}

// 第一次访问需要设置地址
export function requireSetPosition(rextState, replace, callback){
    if(getPosition().isUndefined){
        console.log('初次访问，未设置地址');
        History.replace('/map');
    }else{
        callback();
    }
}
// 访问需要登录权限
export function requireLogin(rextState, replace, callback){
    let userInfo = store.getState().common.userInfo;
    console.log("requireLogin",userInfo)
    if(userInfo){
        callback();
    }else{
        History.replace('/login');
    }
}

// 为按钮注册需要登录权限才能执行操作
export function needLogin(el, opt = {}) {
    const common = store.getState().common;
    const userInfo = common.userInfo;
    if (userInfo) {
        return el;
    } else {
        // let prevent = noop;
        // if (opt.autoEvent !== false) {
        //     if (el.props.onClick) {
        //         prevent = el.props.onClick.bind(el);
        //     } else if (Link == el.type) {
        //         prevent = function() {
        //             History.push(el.props.to);
        //         }
        //     }
        // }
        // delete opt.autoEvent;
        return React.cloneElement(el, {
            ...opt,
            onClick: function(e) {
                // History.push('/login');
                store.dispatch(toggleLoginDialog(true));
                e.preventDefault();
                e.stopPropagation();
            }
        })
    }
}
