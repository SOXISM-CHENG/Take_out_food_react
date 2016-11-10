/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import { Link } from 'react-router';
import * as DomUtils from 'common/utils/dom';
import throttle from 'common/utils/throttle';

export default class Elevator extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            inNextPage: false
        }
    }
    componentWillUnmount() {
        this.event && this.event.remove();
    }
    componentDidMount() {
        this.onScroll();
        this.event = DomUtils.addEventListener(window,'scroll',throttle(this.onScroll));
    }
    onScroll=()=>{
        let height = DomUtils.getWindowHeight();
        let h = DomUtils.getScroll(document.body).top;
        this.setState({
            inNextPage: h>=height
        });
    }
    goTop(){
        DomUtils.scrollTo(0);
    }
    getOffsetLeft(){
        let hash = location.hash;
        if(hash.startWith('#/detail')){
            return 540;
        }else{
            return 500;
        }
    }
    render() {
        return (
            <div className="elevator" style={{marginLeft: this.getOffsetLeft()}}>
                {this.state.inNextPage &&
                    <a className="top" onClick={this.goTop}>
                        <i className="i-icon i-backtop"></i>
                    </a> }
                <Link className='fb' to={"/feedback"} >意见反馈</Link>
            </div>
        );
    }
}
