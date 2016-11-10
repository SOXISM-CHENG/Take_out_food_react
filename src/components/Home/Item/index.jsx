/*
 * @Author: MoCheng
 */

'use strict';
import './index.less';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Img from 'common/Img';
import Rate from 'components/common/Rate';


function mapStateToProps(state) {
    return {

    };
}

export class HomeItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }
    toggleCollect=()=>{
        const data = this.props.data || {};
    }
    renderTags(list){
        let smallTags = [];
        let bigTags = [];
        list.forEach((item,i)=>{
            let icon = <Img key={item.tagKey} className='icon' src={item.tagIcon} />;
            smallTags.push(icon);
            bigTags.push(
                <div key={item.tagKey} className='discount-item'>
                    {icon}
                    <span className="alias">{item.alias}</span>
                    {/*<span className="alias primary">(xxxxx)</span>*/}
                </div>
            );
        });
        return {
            small: smallTags,
            big: bigTags
        };
    }
    render() {
        const data = this.props.data || {};
        const tagObj = this.renderTags(data.tagList);
        return (
            <div className="home-item">
                <Link to={`/detail/${data.storeId}`} className="mask">
                    {/*<a className="btn-collect" onClick={this.toggleCollect}>
                        <i className="fa fa-heart-o"></i>
                    </a>*/}
                </Link>
                <div className="item-content">
                    <div className="preview">
                        <Img src={data.storeLogo}/>
                    </div>
                    <div className="info">
                        <h4 className='name'>{data.storeName}</h4>
                        <div className='rank'>
                            <span className="rater">
                                <Rate value={data.storeScore} />
                                <span className="ant-rate-text">{data.storeScore} 分</span>
                            </span>
                            <span className="sales">月售{data.storeMonSales}单</span>
                        </div>
                        <div className="price">
                            <span className="start-price">起送:￥{data.startPrice}</span>
                            <span className="send-price">
                              配送费:￥{data.expressFee}
                            </span>
                            <span className="send-distance">
                                {data.distance}km
                            </span>
                        </div>
                    </div>
                    <div className={"popover "+(this.props.end?'popover-left':'')}>
                        <div className="popover-info">
                            <h4 className="title">商家信息</h4>
                            <div className='body'>
                                {tagObj.big}
                            </div>
                        </div>
                        <div className="popover-info">
                            <h4 className="title">商家公告</h4>
                            <div className='body'>
                                {data.storeDescription || '无'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="discount">
                    {tagObj.small}
                    {/*
                    <i className="icon i-delivery"></i>
                    <i className="icon i-pay"></i>
                    <i className="icon-order"></i>
                    <i className="icon-discount"></i>
                    <i className="icon-giving"></i>
                    <i className="icon-first"></i>
                    <i className="icon-minus"></i>
                    */}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(HomeItem)

