/*
 * @Author: mocheng
 */


'use strict';
import ajax from 'common/Ajax';
import { getPositionPoint } from 'actions/commonAction'

/**
 * [getHomeList 获取首页店铺列表]
 */
export function getHomeList(params,call) {
    return function(dispatch) {
        ajax({
            url: '/api/store/list',
            data: {
                ...getPositionPoint(),
                ...params
            },
            success: function(res){
                if(res.result == 1){
                    dispatch({
                        type: 'get/home/list',
                        list: res.data,
                        isRefresh: params.pageNo == 1
                    })
                }
                call && call(res);
            }
        })
    }
}
/**
 * [getClassList 获取首页的分类列表]
 * @param  {[type]} id   [description]
 * @param  {[type]} call [description]
 * @return {[type]}      [description]
 */
export function getClassList(id,call){
    return function(dispatch) {
        if(id !== undefined){
            if(id == '0'){ // 选中全部分类 清空子分类
                dispatch({
                    type: 'get/home/class/child',
                    list: []
                })
            }else{
                ajax({
                    url: '/api/class/child',
                    data: {
                        ...getPositionPoint(),
                        parentId: id
                    },
                    success: function(res){
                        if(res.result == 1){
                            dispatch({
                                type: 'get/home/class/child',
                                list: res.data
                            })
                        }
                        call && call(res);
                    }
                })
            }
        }else{
            ajax({
                url: 'api/class/list',
                data: getPositionPoint(),
                success: function(res){
                    if(res.result == 1){
                        dispatch({
                            type: 'get/home/class/list',
                            list: res.data
                        })
                    }
                    call && call(res);
                }
            })
        }
    }
}
