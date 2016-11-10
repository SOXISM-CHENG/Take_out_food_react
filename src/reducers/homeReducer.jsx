/*
 * @Author: mocheng
 */

'use strict';
import {
    handleActions
}  from 'redux-actions';

export const stateName = 'homeState';
export default handleActions({
    'get/home/list': (state, action) => {
        if(action.isRefresh){
            return {
                ...state,
                list: action.list
            }
        }
        return {
            ...state,
            list: [
                ...state.list,
                ...action.list
            ]
        }
    },
    'get/home/class/list': (state, action) => {
        return {
            ...state,
            classLevel1: action.list
        }
    },
    'get/home/class/child': (state, action) => {
        return {
            ...state,
            classLevel2: action.list
        }
    }
}, {
    list: [],
    classLevel1: [],
    classLevel2: [],
});
