/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import * as DomUtils from 'common/utils/dom';
import throttle from 'common/utils/throttle';

export default class ListView extends React.Component {
    static propTypes = {
        dataSource: React.PropTypes.array,
        keySet: React.PropTypes.string,
        renderChildren: React.PropTypes.func,
        offset: React.PropTypes.number,
        handleLoad: React.PropTypes.func.isRequired
    };
    static defaultProps = {
        offset: 0
    }
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pageSize: this.props.pageSize || 20,
            pageNo: 1
        }
    }
    componentWillMount() {
        this.refresh();
        this.event = DomUtils.addEventListener(window,'scroll',throttle(this.onScroll));
    }
    componentWillUnmount() {
        this.event && this.event.remove();
    }
    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.params, this.props.params)){
            this.refresh(nextProps.params);
        }
    }
    onScroll=()=>{
        if(!this.loading && this.state.hasMore){
            let obj = this.refs.content;
            if(obj && this.props.auto !== false){
                let scrollTop = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop);
                let offsetTop = DomUtils.getOffset(obj).top + obj.clientHeight - this.props.offset;
                if (offsetTop < scrollTop) {
                    this.loadNextPage()
                }
            }
        }
    }
    getPostData(){
        return {
            ...this.props.params,
            pageSize: this.state.pageSize,
            pageNo: this.state.pageNo,
        }
    }
    loadNextPage = (params) => {
        if (!this.state.loading) {
            this.loading = true;
            this.setState({
                loading: true
            })
            params = {
                ...this.getPostData(),
                ...params
            };
            this.props.handleLoad(params,this.onLoaded);
        }
    }
    onLoaded = (hasMore) => {
        this.loading = false;
        this.setState({
            pageNo: this.state.pageNo + 1,
            loading: false,
            hasMore
        });
    }
    refresh(params) {
        this.loadNextPage({
            ...params,
            pageNo: 1 ,
        });
    }
    renderChildren(list = []) {
        if(this.props.renderChildren){
            return this.props.renderChildren(list,this);
        }else{
            let keySet = this.props.keySet;
            // if(!keySet) console.error('ListView: keySet is required');
            return list.map((item, i) => {
                return React.cloneElement(this.props.children,{
                    // key: item[keySet],
                    key: i,
                    data: item
                })
            })
        }
    }
    renderFooter(){
        let { loading,hasMore } = this.state;

        let footer = this.props.renderFooter && this.props.renderFooter(loading,hasMore,this);
        if(footer){
            return footer;
        }
        if(loading){
            return <div className="list-view-more">正在加载...</div>
        }else if(hasMore){
            return <div className="list-view-more"
                        ref='btn_more'
                        onClick={this.loadNextPage.bind(this,{})}>点击加载更多</div>
        }else{
            return <div className="list-view-more">没有更多内容</div>
        }
    }
    render() {
        let { dataSource } = this.props;
        return (
            <div className='list-view'>
                <div ref='content' className="list-view-content">{this.renderChildren(dataSource)}</div>
                {this.renderFooter()}
            </div>
        );
    }
}
