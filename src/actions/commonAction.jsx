/*
 * @Author: mocheng
 */


'use strict';
import ajax from 'common/Ajax';
import store from 'stores';
import Cookie from 'js-cookie';
import storejs from 'storejs';


// 坐标相关
export function savePosition(position) {
    position = {
        point: {...position.point},
        city: position.city,
        title: position.title,
        address: position.address,
    };
    let hp = getHistoryPositions() || [];
    hp = hp.filter((p)=>{
        return !_.isEqual(position, p);
    });
    hp.unshift(position);
    // 最多缓存5个地址
    if(hp.length >= 5){
        hp = hp.slice(0,5);
    }
    storejs.set('history-position',hp);
    return {
        type: 'set/position',
        position
    }
}
// 获取当前选择的百度地图坐标对象
export function getPosition(){
    return store.getState().common.position;
}
// 获取当前用户坐标值
export function getPositionPoint(){
    let point = getPosition().point;
    return {
        longitude: point.lng,
        atitude: point.lat,
    };
}
// 从localStorage里获取坐标历史记录
export function getHistoryPositions(){
    return storejs.get('history-position') || [];
}
/**
 * [getStoreCountByMap 获取指定坐标周围有多少店铺]
 */
export function getStoreCountByMap(res,callback){
    return function(dispatch){
        let data = '';
        res.forEach(item=>{
            data+=`&atitude=${item.point.lat}&longitude=${item.point.lng}`
        });
        ajax({
            url: '/api/store/count',
            type: 'get',
            data: data,
            success: function(result){
                if(result.result == 1){
                    res = res.map((item,i)=>{
                        item.count = result.data[i];
                        return item;
                    });
                    callback && callback(res);
                }else{
                    message.error(result.msg);
                }
            }
        })
    }
}