/*
 * @Author: mocheng
 */

'use strict';
import {
    handleActions
}  from 'redux-actions';
import Cookie from 'js-cookie';
import storejs from 'storejs';

let hp = storejs.get('history-position') || [];
const DEFAULT_POSITION = hp.length ? hp[0] : {
    isUndefined: true,
    title: '北京市',
    city: '北京市',
    point: {
        lng: 116.429493,
        lat: 39.936957,
    }
};
export const stateName = 'common';
export default handleActions({
    '@@router/LOCATION_CHANGE': (state, action) => {
        // 页面切换 滚动条置顶
        setScrollTop(0);
        return state;
    },
    'set/position': (state, action) => {
        return {
            ...state,
            position: action.position
        }
    },
    'login/success':(state, action) => {
        console.log("cookie保存期限："+action.expires+"天");
        if(action.expires !== false){
            Cookie.set('user_info', action.cookieInfo, { expires: action.expires });//cookie存储用户名密码
        }
        Cookie.set('user_id',action.info.memberId);//session存储用户id
        return {
            ...state,
            userInfo: action.info
        }
    },
    'get/userInfo':(state, action) => {
        return {
            ...state,
            userInfo: action.info
        }
    },
    'logout/success' :(state, action)=>{
        Cookie.remove('user_id');
        Cookie.remove('user_info');
        action.flag !== false && location.reload();
        return {
            ...state,
            userInfo: undefined
        }
    },
    'toggle/dialog/login': (state, action)=>{
        return {
            ...state,
            show_login_dialog: action.status
        }
    }
}, {
    userInfo: undefined,
    position: DEFAULT_POSITION,
    show_login_dialog: false
});


function setScrollTop(scroll_top) {
    document.documentElement.scrollTop = scroll_top;
    document.body.scrollTop = scroll_top;
}
