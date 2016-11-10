/*
 * @Author: mocheng
 */

'use strict';
import './index.less';
import React from 'react';
import Img from 'common/Img';
import {
    connect
} from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

export class Footer extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className='footer'>
                <div className="copyright" >
                    <p className="one_line">
                        <span>©</span><span title="">2016</span>
                            react外卖官网
                             react.com
                        <a href="http://www.miitbeian.gov.cn/" target="_blank">京ICP备*********号-1</a>
                    </p>
                   {/* <div className="two_line">
                        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502025545" >
                            <Img src="1.png"/>
                            <p>京公网安备11010502025545号</p>
                        </a>
                    </div>*/}
                </div>
            </footer>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(Footer)
