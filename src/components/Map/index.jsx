/*
 * @Author: MoCheng
 */

'use strict';
import './inedx.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import { Link } from 'react-router';
import Img from 'common/Img';
import History from 'common/History';
import BaiduMap from 'common/BaiduMap';
import * as DomUtils from 'common/utils/dom';
import { savePosition,getHistoryPositions,getStoreCountByMap } from 'actions/commonAction';
import UserBox from 'components/common/UserBox';
import CitySelector from 'components/Map/CitySelector/'

const LETTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function mapStateToProps({common}) {
    return {
        position: common.position
    };
}

export class Maper extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };
    maper = undefined;
    constructor(props) {
        super(props);
        let position = props.position;
        this.state = {
            openMap: false,
            cityControl: false, // 城市选择是否展开
            historyControl: false, // 历史浏览是否展开
            searchKey: '',  // 搜索关键字
            searchResult: [], // 搜索结果
            activeResultIndex: 0, //选中的结果下标
            selectCity: position.city, // 选中的城市
            guessCity: position.city,
        }
    }
    componentWillReceiveProps(nextProps) {
        let query = nextProps.location.query;
        if(query.status == BaiduMap.STATUS_SAVE_POSITION){
            this.savePosition();
        }
    }
    componentDidMount() {

        let { cityControl:cityDom,historyControl:historyDom } = this.refs;
        this.event = DomUtils.addEventListener(window,'click',(e)=>{
            let { cityControl,historyControl } = this.state;
            let target = e.target;
            // if(cityControl && !DomUtils.contains(cityDom,target)){
            //     this.toggleSelector('cityControl');
            // }
            if(historyControl && !DomUtils.contains(historyDom,target)){
                this.toggleSelector('historyControl');
            }
        });

        BaiduMap.init('map',(maper)=>{
            console.log('地图初始化成功');
            this.maper = maper;
            maper.setPlace(this.state.selectCity);
            // 获取用户当前所在城市
            maper.getCurrentPosition((point,address)=>{
                // let isChange = this.state.selectCity !== DEFAULT_CITY;
                // if(!isChange){
                //     maper.setPlace(address.addressComponents.city)
                // }
                this.setState({
                    // selectCity: isChange ? this.state.selectCity : address.addressComponents.city,
                    guessCity: address.addressComponents.city
                });
            });
            //  //建立一个自动完成的对象
            this.createAutocomplete(this.state.selectCity);
        })
    }
    componentWillUnmount() {
        this.event && this.event.remove();
    }
    createAutocomplete=(local)=>{
        this.maper.createAutocomplete({
            id: "search-input",
            local,
            // onhighlight: this.handleSearchKeyChange,
            onconfirm: (value)=>{
                this.handleSearchKeyChange(value);
                this.searchMap(value);
            }
        });
    }
    savePosition(data){
        let { searchResult,activeResultIndex } = this.state;
        data = data || searchResult[activeResultIndex];
        if(data){
            this.props.dispatch(savePosition(data));
            History.push('/');
        }else{
            History.replace('/map');
        }
    }
    handleSearchKeyChange=(e,callback)=>{
        this.setState({
            searchKey: e.target ? e.target.value : e
        },callback);
    }
    handleCitySelect=(value)=>{
        this.setState({
            selectCity: value,
            cityControl: false,
            searchResult: [],
            activeResultIndex: 0,
        });
        this.createAutocomplete(value);
        this.maper.map.centerAndZoom(value,12);
    }
    toggleSelector(type){
        this.setState({
            [type]: !this.state[type]
        });
    }
    handleClickResult=(index)=>{
        this.setState({
            activeResultIndex: index
        });
        this.maper.openMarkWindow(this.state.searchResult[index]);
    }
    searchMap=(value)=>{
        this.maper.setPlace(value || this.state.searchKey,(results)=>{
            let r = [];
            if(results){
                for (var i = 0; i < results.getCurrentNumPois(); i ++){
                    r.push(results.getPoi(i));
                }
            }
            this.props.dispatch(getStoreCountByMap(r,(res)=>{
                console.log(res)
                this.setState({
                    searchResult: res,
                    activeResultIndex: 0,
                    openMap: true
                });
                this.maper.createMarks(res,{
                    click: (item,i)=>{
                        this.setState({
                            activeResultIndex: i
                        });
                    }
                });
                res[0] && this.maper.openMarkWindow(res[0]);
            }))
        });
    }
    renderSearchControl(){
        const dataSource = this.state.searchResult;

        return (
            <div className="search-wrap">
                <button type='button' onClick={()=>this.searchMap()}>搜索</button>
                <div className="input-wrap">
                    <input
                        id="search-input"
                        type="text"
                        size="20"
                        onChange={this.handleSearchKeyChange}
                        value={this.state.searchKey} />
                </div>
            </div>
        )
    }
    renderCityControl(){
        return (
            <div className="selector city-selector">
                <div
                    ref='cityControl'
                    onClick={this.toggleSelector.bind(this,'cityControl')}>
                    <span className="text" title={this.state.selectCity}>
                        {this.state.selectCity}
                    </span>
                    <i className="fa fa-caret-down"></i>
                </div>
                {this.state.cityControl &&
                    <div className="selector-content">
                        <CitySelector
                            onChange={this.handleCitySelect}
                            guessCity={this.state.guessCity}
                        />
                    </div>}
            </div>
        )
    }
    renderHistoryControl(){
        var hp = getHistoryPositions();
        return (
            <div className="selector history-selector"
                ref='historyControl'
                onClick={this.toggleSelector.bind(this,'historyControl')}>
                <span className="text">历史地址</span>
                <i className="fa fa-caret-down"></i>
                {this.state.historyControl &&
                    <div className="selector-content">
                        { hp.length?
                            hp.map((item,i)=>
                                <div key={i} className="history-item" onClick={this.savePosition.bind(this,item)}>
                                    {item.title}
                                </div>):
                            <div className="history-item">没有历史地址</div>
                        }
                    </div>}
            </div>
        )
    }
    renderMapResultItems(){
        let searchResult = this.state.searchResult;
        let curIndex = this.state.activeResultIndex;
        return searchResult.map((item,i)=>{
            var classname = 'map-result-item ';
            classname += (i == curIndex?'active':'');
            return (
                <div key={i}
                    className={classname}
                    onClick={this.handleClickResult.bind(this,i)} >
                    <div className="poi sprite">{LETTER[i]}</div>
                    <div className="content">
                        <div className="title">{item.title}</div>
                        <div className="address">{item.address}</div>
                        <div className="nearby">附近有<span>{item.count}</span>家外卖餐厅</div>
                    </div>
                </div>
            );
        })
    }
    render() {
        let { searchResult,searchKey,openMap } = this.state;
        return (
            <div className='page-map'>
                <div className="map-header">
                    <div className="container">
                        <Img className='logo' src="./logo.png" style={{"width":"111px","height":"37px"}} />
                        <span className="sign-box">
                            <UserBox/>
                        </span>
                    </div>
                </div>
                <div className={"map-content"+(openMap?' open':'')}>
                    <div className="address-controller">
                        {this.renderCityControl()}
                        {this.renderHistoryControl()}
                        {this.renderSearchControl()}
                    </div>
                    <div className="map-controller">
                        <div className="map-result">
                            <div className="map-result-head">
                                共<span className="num">{searchResult.length}</span>地址
                            </div>
                            {searchResult.length?
                                <div className="map-result-list">
                                    {this.renderMapResultItems()}
                                </div>:
                                <div className="map-result-no-address">
                                    <div className="text">未找到相关地址：</div>
                                    <p>1.请核对地址拼写正确。</p>
                                    <p>2.请尝试其他关键字。</p>
                                </div>
                            }
                        </div>
                        <div id="map"></div>
                    </div>
                </div>
                <div className="map-footer">
                    <div className="map-footer-entry">
                    手机版下载
                    <i className="map-footer-separator"></i>
                    零售招商合作申请
                    </div>
                    <div className="map-footer-copyright">
                         ©<span title="">2016</span>&nbsp;
                             react官网
                             leimingtech.com&nbsp;
                        <a href="http://www.miitbeian.gov.cn/" target="_blank">京ICP备12000912号-1</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(Maper)
