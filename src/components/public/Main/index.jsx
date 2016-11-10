/*
 * @Author: MoCheng
 */
'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import { toggleLoginDialog,thirdLogin } from 'actions/SignPageAction';
import History from 'common/History';
import * as DomUtils from 'common/utils/dom';
import Dialog from 'components/common/Dialog';
import TopNav from 'components/common/TopNav';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Elevator from 'components/common/Elevator';
import LoginSingle from 'components/SignPage/LoginSingle/';
import { message } from 'antd';
function mapStateToProps({ common }) {
    return {
        showLogin: common.show_login_dialog,
        userInfo: common.userInfo
    };
}

export class Main extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.__THREELOGIN_CODE__ = window.__THREELOGIN_CODE__ || '';
        delete window.__THREELOGIN_CODE__;
    }

    componentWillMount() {
        let code = this.getQueryString('code');
        let state = this.getQueryString('state');
        if(code){
            History.replace(this.props.location.pathname);
            this.props.dispatch(thirdLogin({
                code,
                state,
            }));
        }
    }
    getQueryString(name) {
        // return this.props.location.query[name];
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var res = this.__THREELOGIN_CODE__.split('?');
        if(res.length >= 2){
            var r = res[1].match(reg);
            if (r != null) return unescape(r[2]);
        }
        return null;
    }
    closeLogin=()=>{
        this.props.dispatch(toggleLoginDialog(false));
    }
    render() {
        return (
            <div className='application'>
                <Elevator userInfo={this.props.userInfo}/>
                { !this.props.userInfo &&
                    <Dialog
                        title='请登录雷铭账号'
                        className='dialog-login'
                        width={400}
                        visible={this.props.showLogin}
                        onCancel={this.closeLogin}
                    >
                        <LoginSingle
                            location={this.props.location}
                            redirect={this.props.location.pathname}/>
                    </Dialog>
                }
                <TopNav/>
                <Header/>
                <div className="page-wrap">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(Main)
