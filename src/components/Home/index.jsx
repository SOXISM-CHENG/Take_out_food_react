/*
 * @Author: MoCheng
 */
'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import Item from './Item/'
import ListView from 'components/common/ListView'
import {
    getHomeList,
    getClassList,
} from 'actions/HomeAction';
import {
    Checkbox,
    Select
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

function mapStateToProps({
    common,
    homeState
}) {
    return {
        position: common.position,
        dataSource: homeState.list,
        classLevel1: classFormater(homeState.classLevel1),
        classLevel2: classFormater(homeState.classLevel2),
    };
}

function classFormater(classList){
    return classList.map(item=>{
        return { label: item.name,value: item.id }
    });
}

const filter_type = [{
    label: '全部',
    value: 'ALL'
}, {
    label: '美食',
    value: '2'
}, {
    label: '甜点饮品',
    value: '3'
}];

const filter_special = [{
    label: '免费配送',
    value: 'isExpressFee'
}, {
    label: '支持发票',
    value: 'isOpenInvoice'
}, {
    label: '0元起购',
    value: 'startPrice'
}];
//标签key:优惠活动：首单立减first, 满减优惠manjian,满免配送manmainyun
const filter_discount = [{
    label: '首单立减',
    value: 'first'
}, {
    label: '满减优惠',
    value: 'manjian'
}, {
    label: '满免配送',
    value: 'manmainyun'
}];
//distance:距离,store_mons_ales:月销量,storeScore:评分,start_price:起送假,comprehensive:综合
const filter_order = [{
    label: '综合排序',
    value: 'comprehensive'
}, {
    label: '距离最近',
    value: 'distance'
}, {
    label: '销量最高',
    value: 'store_mon_sales'
}, {
    label: '评分最高',
    value: 'store_score'
}, {
    label: '起送价最低',
    value: 'start_price'
}];

const filter_price = [{
    label: '全部商家',
    value: 'ALL'
}, {
    label: '10元以下',
    value: '10'
}, {
    label: '20元以下',
    value: '20'
}];

export class Home extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            type: ['0'], // 全部分类
            special: [],
            discount: undefined,
            order: 'comprehensive',
            range: 'ALL',
            searchParams: {
                isOpenInvoice: 0,// 支持发票
                startPrice: 0, //0元起送
                isExpressFee: 0, //免费配送
                sortFielName: 'comprehensive' //distance:距离,store_mons_ales:月销量,storeScore:评分,start_price:起送假,comprehensive:综合
            }
        }
    }
    componentWillMount() {
        this.props.dispatch(getClassList());
    }
    getPostData(){
        let { type,order,special,discount } = this.state;
        return {
            scId: type[1] || type[0], // 有二级分类用二级没有用一级
            sortFielName: order,
            isOpenInvoice: special.indexOf('isOpenInvoice') == -1?0:1,
            startPrice: special.indexOf('startPrice') == -1?0:1,
            isExpressFee: special.indexOf('isExpressFee') == -1?undefined:1,
            tagKey: discount
        }
    }
    handleListLoad = (params, callback) => {
        this.props.dispatch(getHomeList(params, (res) => {
            callback(res.totalRows > res.pageSize * res.pageNo);
        }));
    }
    handleSelect=(key,value)=>{
        if(key == 'discount' && this.state[key] == value){
            value = undefined;
        }
        this.setState({
            [key]: value
        });
    }
    handleTypeSelect(level,value){
        let curValue = this.state.type;
        if(level == 1){
            this.setState({
                type: [value,value]
            });
            this.props.dispatch(getClassList(value));
        }else if(level == 2){
            this.setState({
                type: [curValue[0],value]
            });
        }
    }
    renderTypeFilter(data=[]){
        let curValue = this.state.type;
        if(!this.props.classLevel1.length){ return;}
        return (
            <div className="filter-wrap">
                <div className="filter-title">
                    <i className="fa fa-fw fa-shopping-bag"></i><span>商家分类</span>
                </div>
                <div className="filter-content">
                    <div className="filter-type">
                        {this.props.classLevel1.map((item, i) => {
                            let classname = curValue[0] === item.value?"active":""
                            return (
                                <span key={item.value}
                                    className={classname}
                                    onClick={this.handleTypeSelect.bind(this,1,item.value)}>
                                    {item.label}
                                </span>
                            );
                        })}
                    </div>
                    {!!this.props.classLevel2.length &&
                        <div className="filter-type">
                            {this.props.classLevel2.map((item, i) => {
                                let classname = curValue[1] === item.value?"active":""
                                return (
                                    <span key={item.value}
                                        className={classname}
                                        onClick={this.handleTypeSelect.bind(this,2,item.value)}>
                                        {item.label}
                                    </span>
                                );
                            })}
                        </div>}
                </div>
            </div>
        );
    }
    renderSpacialFilter(data=[]){
        let curValue = this.state['special'];
        return (
            <div className="filter-wrap">
                <div className="filter-title">
                    <i className="fa fa-fw fa-filter"></i><span>商家特色</span>
                </div>
                <div className="filter-content">
                    <div className="filter-special">
                        <CheckboxGroup
                            options={data}
                            value={curValue}
                            onChange={this.handleSelect.bind(this,'special')}
                        />
                    </div>
                </div>
            </div>
        );
    }
    renderDiscountFilter(data=[]){
        let curValue = this.state['discount'];
        return (
            <div className="filter-wrap">
                <div className="filter-title">
                    <i className="fa fa-fw fa-filter"></i><span>优惠活动</span>
                </div>
                <div className="filter-content">
                    <div className="filter-discount">
                        {data.map((item)=>{
                            return (
                                <Checkbox
                                    key={item.value}
                                    checked={item.value == curValue}
                                    onChange={this.handleSelect.bind(this,'discount',item.value)}>
                                    {item.label}
                                </Checkbox>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
    renderOrderFilter(data){
        let curValue = this.state.order;
        return (
            <div className="filter-order">
                {data.map((item, i) => {
                    let classname = curValue === item.value?"active":""
                    return (
                        <span key={item.value}
                            className={classname}
                            onClick={this.handleSelect.bind(this,'order',item.value)}>
                            {item.label}
                        </span>
                    );
                })}
            </div>
        );
    }
    renderPriceSelect(data){
        let curValue = this.state.range;
        return (
            <div className='filter-price'>
                <span>起送价筛选</span>
                <Select value={curValue} onChange={this.handleSelect.bind(this,'range')}>
                    {data.map(item =>
                        <Option key={item.value} value={item.value}>{item.label}</Option>)}
                </Select>
            </div>
        )
    }
    renderListItem(list){
        let items = [];
        list.forEach((item, i) => {
            let isEnd = (i+1)%4 == 0;
            items.push(<Item key={item.storeId} data={item} end={isEnd} />);
            if(isEnd){
                items.push(<div key={'line'+i} className="space-line"></div>);
            }
        })
        return items;
    }
    render() {
        return (
            <div className="page-home">
                <div className="panel-filter">
                    {this.renderTypeFilter(filter_type)}
                    {this.renderSpacialFilter(filter_special)}
                    {this.renderDiscountFilter(filter_discount)}
                </div>
                <div className="panel-list">
                    <div className="tool-bar">
                        {this.renderOrderFilter(filter_order)}
                        {/*this.renderPriceSelect(filter_price)*/}
                    </div>
                    <div className="list-content">
                        <ListView
                            keySet='storeId'
                            params={this.getPostData()}
                            dataSource={this.props.dataSource}
                            handleLoad={this.handleListLoad}
                            renderChildren={this.renderListItem}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(Home)
