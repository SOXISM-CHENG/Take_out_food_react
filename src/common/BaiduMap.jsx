/*
 * @Author: mocheng
 */

'use strict';
import * as DomUtils from 'common/utils/dom';

const ak = '6te2AY8PQrW6uyBXz2AGRdCS';
const url = `http://api.map.baidu.com/api?v=2.0&ak=${ak}`;

const defaultParams = {
    longitude: 116.331398,
    latitude: 39.897445,
    zoom: 12,
    minZoom: 8,
    maxZoom: 18
}

const BaiduMap = function(id, callback,flag) {

    var self = this;
    var BMap = window.BMap;

    this.element = document.getElementById(id);
    // init
    this.map = new BMap.Map(id, {
        enableMapClick: false,
        minZoom: defaultParams.minZoom,
        maxZoom: defaultParams.maxZoom
    });
    var point = new BMap.Point(defaultParams.longitude, defaultParams.latitude);

    // var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));
    this.map.centerAndZoom(point, defaultParams.zoom);

    this.geolocation = new BMap.Geolocation();
    // 创建地理编码实例
    this.geocoder = new BMap.Geocoder();

    // this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
    // this.map.addControl(new BMap.NavigationControl()); //左上角，添加默认缩放平移控件
    this.map.enableScrollWheelZoom(true);

    this.local = new BMap.LocalSearch(this.map, {
        onSearchComplete: function(results) {
            if (self.searchCallback) {
                // 判断状态是否正确
                if (self.local.getStatus() == BMAP_STATUS_SUCCESS) {
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        s.push(results.getPoi(i));
                    }
                    self.searchCallback(s);
                    self.searchCallback = undefined;
                }
            }
        }
    });
}
BaiduMap.prototype = {
    // 地图上展示的openMarkes
    openMarks: {},
    // 获取当前地理位置信息
    getCurrentPosition(callback) {
        var _self = this;
        var map = this.map;
        this.geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                // map.panTo(r.point);
                _self.getPositionAddress(r.point.lng, r.point.lat, callback.bind(null, r.point))
            } else {
                console.error('BMap failed' + this.getStatus());
            }
        }, {
            enableHighAccuracy: true
        })
    },
    // 根据坐标获取当前地理位置信息
    getPositionAddress(lng, lat, callback) {
        this.geocoder.getLocation(new BMap.Point(lng, lat), function(result) {
            if (result) {
                callback && callback(result);
            }
        });
    },
    // 搜索
    search(value, callback) {
        this.searchCallback = callback;
        this.local.search(value);
    },
    // 根据城市名设置位置
    setPlace(value, callback) {
        var map = this.map;
        map.clearOverlays(); //清除地图上所有覆盖物
        this.openMarks = {};
        function myFun() {
            var results = local.getResults();
            if(results && results.getPoi(0)){
                var pp = results.getPoi(0).point; //获取第一个智能搜索的结果
                map.centerAndZoom(pp, defaultParams.zoom);
                // map.addOverlay(new BMap.Marker(pp)); //添加标注
            }
            callback && callback(results);
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(value);
    },
    // 创建自动补全插件
    createAutocomplete({id, onhighlight, onconfirm,local }) {
        var self = this;
        var ac = new BMap.Autocomplete({
            "input": id,
            "location": local || this.map
        });
        ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
            var value = "";
            if (e.toitem.index > -1) {
                var _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
                onhighlight && onhighlight(value);
            }
        });
        ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
            var value = "";
            if (e.item.index > -1) {
                var _value = e.item.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
                onconfirm(value);
            }
            self.setPlace(value);
        });
        return ac;
    },
    // 根据坐标数组创建marker
    createMarks(data,opt) {
        var self = this;
        var makerSize = new BMap.Size(28, 39);
        // 清除上次查询的遮盖物
        this.map.clearOverlays();
        this.openMarks = {};
        data.forEach((item,i) => {
            var point = new BMap.Point(item.point.lng, item.point.lat);
            var marker = new BMap.Marker(point, {
                icon: new BMap.Icon('../images/overlays_2.png', makerSize,
                    { imageOffset: new BMap.Size(0 - i * 28, -39) })
            });
            this.openMarks[item.uid] = marker;
            this.openMarks[item.uid]._data_ = item;

            this.map.addOverlay(marker); // 将标注添加到地图中
            // 添加点击监听
            marker.addEventListener("click", function(e) {
                self.openMarkWindow(item);
                opt.click && opt.click(item,i);
            });
        });
    },
    // 获取marker展开窗口模板
    getWindowTemp(data) {
        var opts = {
            width: 270, // 信息窗口宽度
            enableMessage: true //设置允许信息窗发送短息
        };
        var dom = DomUtils.createElement('<div style="position: absolute;z-index:-1000;width:270px;" ></div>');
        document.body.appendChild(dom);
        var content = `<div class="bd-info-box">
                <div class="bd-info-box-title">${data.title}</div>
                <div class="bd-info-box-addr">地址：${data.address}</div>
                <div class="bd-info-box-nearby">附近有<span>${data.count}</span>家外卖餐厅</div>
                <div class="btn-group">
                    <a class="btn-start" href="#/map?status=${BaiduMap.STATUS_SAVE_POSITION}">开始订餐</a>
                </div>
            </div>`;
        dom.innerHTML = content;
        opts = {
            ...opts,
            height: dom.offsetHeight
        };
        document.body.removeChild(dom);
        return {
            opts,
            content
        }
    },
    // 根据Poi对象打开指定窗口
    openMarkWindow(data) {
        var {
            content,
            opts
        } = this.getWindowTemp(data);
        var p = data.point;
        var point = new BMap.Point(p.lng, p.lat);
        let marker = this.openMarks[data.uid];
        this.overMarker(data.uid);

        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
        this.map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    // 将未选中的marker背景色置为红色
    outMarker(id) {
        var marker = this.openMarks[id];
        if(marker){
            var icon = marker.getIcon();
            icon.setImageOffset(new BMap.Size(icon.imageOffset.width, -39));
            marker.setIcon(icon);
        }
    },
    // 将当前选中的marker背景色置为蓝色
    overMarker(id) {
        this.outMarker(this.currentMarkerId);
        var marker = this.openMarks[id];
        if(marker){
            this.currentMarkerId = id;
            var icon = marker.getIcon();
            icon.setImageOffset(new BMap.Size(icon.imageOffset.width, 0));
            marker.setIcon(icon);
        }
    }
}
BaiduMap.init = function(id, callback) {
    window.initBMap = function() {
        let maper = id && new BaiduMap(id);
        callback(maper);
        window.initBMap = undefined;
    }
    if (window.BMap) {
        initBMap();
    } else {
        var script = document.createElement("script");
        script.src = `${url}&callback=initBMap`;
        document.body.appendChild(script);
    }
}
BaiduMap.STATUS_SAVE_POSITION = 1;
export default BaiduMap;
