/*
 * @Author: MoCheng
 */
import './index.less';
import React from 'react';
import {
  connect
} from 'react-redux';
import Img from 'common/Img';
import Footer from 'components/common/Footer';
import LoginSingle  from 'components/SignPage/LoginSingle/';

export class index extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="login_box">
        <div className="sign_head">
            <div className="sign_logo">
                <a href='/#/'>
                  <Img alt="react外卖" src="logo.png" className="sign_img" />
                </a>
           </div>
        </div>
        <div className="sign_body">
            <div className="sign_body_left">
                <Img src="waimai.png" width="603" height="383"/>
            </div>
            <div className="sign_body_rigth">
                  <LoginSingle location={this.props.location} />
            </div>
        </div>
        <Footer/>

      </div>
    );
  }
}
export default index;
