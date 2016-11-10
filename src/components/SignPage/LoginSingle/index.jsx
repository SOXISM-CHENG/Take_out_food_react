/*
 * @Author: MoCheng
 */
import './index.less';
import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Input,
  Icon,
  Checkbox,
  message,
  Modal
} from 'antd';
import {
    phoneLogin,
    otherLogin,
    getVerifyCode,
    getCheckCode,
    retrieveToLoginpass
} from 'actions/SignPageAction';
import Aggrement from 'components/SignPage/Aggrement/';
import Dialog from 'components/common/Dialog/';

const FormItem = Form.Item;
const createForm = Form.create;

const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 24
  },
};

function mapStateToProps({
    common
}){
    return {
        userInfo: common.userInfo
    };
}

let index= class  extends React.Component {
  static propTypes = {
    redirect: React.PropTypes.any,
  };
  static defaultProps = {
    redirect: '/'
  };
  constructor(props) {
    super(props);
    this.state = {
      openPhoneFrom: false,
      openOtherFrom: true,
      wait: 0,
      openFormError:false,
      validate_info: "",
      type:"loginValidate",
      modalVisible: false,
      openRevicesPass:false,
      show_dialog:false,/*是否开启Dialog*/
      type2: "findpassword",/* 找回密码操作类型*/
      loading:false
    }
  }
  noop() {
    return false;
  }

  userExists = (rule, value, callback) => {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === 'aaa') {
          callback([new Error('对不起，用户名已经在使用中。')]);
        } else {
          callback();
        }
      }, 800);
    }
  }

  phoneExists = (rule, value, callback) => {
    if(value==""){
      callback([new Error('手机号码不能为空！')]);
    }else {
        callback();
    }
  }

  handleSubmitPhone = (e) => {
    e.preventDefault();
    console.log("phoneSubmit");
    this.setState({
      loading:true
    });
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log(' 表单验证错误!');
        this.setState({
          openFormError: true,
          validate_info: '登录信息不完整!',
          loading:false
        })
        return;
      }
      console.log('表单验证成功');
      console.log(values);
      let btn=document.getElementById('phone_btn')
      btn.disabled = true;
      let expires=0;
      if (values.autoLogon2) {
        console.log("勾选自动登陆");
        expires=7;
      }
      this.props.dispatch(phoneLogin({
        "validateCode": values.Dcode,
        "username": values.phone,
        "expires": expires
      }, (re) => {
        if (re.result === 1) {
          console.log('手机号码登录成功');
          message.success("登录成功");
        } else {
          console.log("手机号码登录失败");
          btn.disabled = false;
          this.setState({
            openFormError: true,
            validate_info: re.msg,
            loading: false
          })
        }
      },this.props.redirect))
    });
  }
  handleSubmitOther = (e) => {
    e.preventDefault();
    console.log("otherSubmit");
    this.setState({
      loading:true
    });
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log(' 表单验证错误!');
        this.setState({
          openFormError: true,
          validate_info: '登录信息不完整!',
          loading:false
        })
        return;
      }
      console.log('表单验证成功');
      console.log(values);
      let btn=document.getElementById('other_btn')
      btn.disabled = true;
      let expires=0;
      if (values.autoLogon) {
        console.log("勾选自动登陆");
        expires=7;
      }
      this.props.dispatch(otherLogin({
        "password": values.password,
        "username": values.name,
        "expires": expires
      }, (re) => {
        if (re.result === 1) {
          console.log('其他账号登录成功');
          message.success("登录成功");
        } else {
          console.log("其他账号登录失败");
          btn.disabled = false;
          this.setState({
            openFormError: true,
            validate_info: re.msg,
            loading: false
          })
        }
      },this.props.redirect))
    });
  }
  onChangeFrom = () => {
    if (this.state.openPhoneFrom) {
      this.setState({
        openPhoneFrom: false,
        openOtherFrom: true
      })
    } else {
      this.setState({
        openPhoneFrom: true,
        openOtherFrom: false
      })
    }
  }
  sendDCode=()=>{
    console.log("发送验证码。。。");
    let phone=this.props.form.getFieldValue('phone');
    let bool=false;
    this.props.form.validateFields(['phone'],(errors,values)=>{
      if (errors) {
        return;
      }
      bool=true;
    });
    if (bool) {
      this.setState({
          wait: "loading"
      })
      this.props.dispatch(getVerifyCode({
              "type": this.state.type,
              "mobile": phone
          },(re)=> {
            if(re.result===1){
              this.setState({
                  wait: 60
              })
              message.success("验证码已发送请查收");
              console.log(re.data.verifyCode);
              this.a = setInterval(() => {
                  if (this.state.wait == -1) {
                      clearInterval(this.a);
                  }
                  this.setState({
                      wait: this.state.wait - 1
                  })
              }, 1000)
            } else {
                this.setState({
                    wait: 0,
                    openFormError: true,
                    validate_info: re.msg
                })
            }
          }
        )
      )
    }else{
      document.getElementById("phone").focus();
      this.setState({
          wait: "0"
      })
    }
  }

  validatorDcode=(rule, value, callback)=>{
    console.log(" 验证验证码。。。");
    let phone=this.props.form.getFieldValue('phone');
    let validateCode=this.props.form.getFieldValue('Dcode');
    this.props.dispatch(getCheckCode({
        "validateCode" : validateCode,
        "type" : this.state.type,
        "mobile" : phone
      },(re)=> {
        if(re.result===1){
            callback();
        } else {
          callback([new Error('动态码验证失败')]);
        }
      }
    ))
  }
  handerOnFocus=()=>{
    this.setState({
      openFormError:false,
      validate_info: ""
    })
  }
  setModalVisible=(modalVisible)=> {
    this.setState({ modalVisible });
  }
  setModalVisible2=(modalVisible)=> {
    this.setState({
        show_dialog:modalVisible
    });
  }

  componentWillUnmount() {
    if(this.a){
      clearInterval(this.a);
    }
    if(this.close_form){
       clearInterval(this.close_form);
    }
  }
  handleOnCancel=()=>{
      this.setModalVisible2(false);
      this.setState({
          openRevicesPass:false
      });
  }
  handleRetrievePassword=(errors,values,callback)=>{//找回登录密码
      if (errors) {
          console.log('Retrieve-password-box表单验证错误!');
          this.close_form=setInterval(()=>{
            console.log("监控回调中。。。");
            if(!this.state.show_dialog){
              callback && callback();
              clearInterval(this.close_form);
            }
          },1000);
          return;
      }
      console.log('Retrieve-password-box表单验证成功');
      console.log(values);
      this.props.dispatch(retrieveToLoginpass({
          "mobile": values.phone,
          "validateCode": values.Vcode,
          "newpassword": values.pass
        },(re)=> {
          if(re.result==1){
            message.success(re.msg);
              this.handleOnCancel();
              callback && callback(re);
            }else{
              message.error(re.msg);
              console.log(re.msg);
            }
          }
        )
      );
  }
  render() {
    return (
		<div className="loginsingle_box">
	      	{
		        this.state.openFormError?(
		          <div className="validate-info">
		            <i className="i3"></i>{this.state.validate_info}
		          </div>
		        ):undefined
	      	}
	      	<div className="sign_name">
		        <span className="span-left">账号登录</span>
		        {this.state.openOtherFrom?<a onClick={this.onChangeFrom} className="span-right" ><span >手机动态码登录</span><i className="i i2"></i></a>:undefined}
		        {this.state.openPhoneFrom?<a onClick={this.onChangeFrom} className="span-right" ><span >普通方式登录</span><i className="i i1"></i></a>:undefined}
		      </div>
		    {this._PhoneFormBox()}
		    {this._OtherFormBox()}

		    <Modal
	          className="full-screen-modal"
	          wrapClassName="vertical-center-modal"
	          visible={this.state.modalVisible}
	          width={800}
	          style={{ top: 10 }}
	          onCancel={() => this.setModalVisible(false)}
	          onOk={() => this.setModalVisible(false)}
	        >
	          <Aggrement/>
	        </Modal>
	        <Dialog
	          visible={this.state.show_dialog}
	          onCancel={this.handleOnCancel}
	          title="找回登录密码"
	          footer={[
	              <Button key="back" type="ghost" size="large" onClick={this.handleOnCancel}>取消</Button>
	          ]}
	        >
          找回登录密码
	        </Dialog>
	  	</div>
    );
  }
  _PhoneFormBox() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldValidating
    } = this.props.form;
    if (this.state.openOtherFrom) {
      return (
        <Form id="other_login_from" horizontal onSubmit={this.handleSubmitOther}  onFocus={this.handerOnFocus} >
          <div className="sign_input">
            <i className="icon user-photo"></i>
            <FormItem
              id="control-user"
              {...formItemLayout}
              hasFeedback
              help={isFieldValidating('name') ? 'validating...' : (getFieldError('name') || []).join(', ')}
            >
              {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '用户名不能为空！' }
                    ],
                })(
                <Input id="control-user" placeholder="手机号/用户名/邮箱" />
              )}
            </FormItem>
          </div>
          <div className="sign_input">
            <i className="icon key-photo"></i>
            <FormItem
              id="control-password"
              {...formItemLayout}
              hasFeedback
              help={isFieldValidating('password') ? 'validating...' : (getFieldError('password') || []).join(', ')}
            >
              {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '密码不能为空！' }
                    ],
                })(
                <Input id="control-password" placeholder="密码" type="password"
                    autoComplete="off"  onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop} />
              )}
            </FormItem>
          </div>
          <div className="infos">
            <FormItem
              id="control-autoLogon"
              {...formItemLayout}
            >
              {getFieldDecorator('autoLogon', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  { type: 'boolean'},
                ],
              })(
                <Checkbox id="control-autoLogon" className="ant-checkbox-vertical"> 7天内自动登录</Checkbox>
              )}
                <div className="sign_forgetpasssword">
                    <a href='javascript:void(0);' onClick={()=>{
                      this.setState({
                          openRevicesPass:true,
                          show_dialog: true
                      })
                    }}>忘记密码 ？ </a>
                </div>
            </FormItem>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="sign_btn"
            id="other_btn"
            loading={this.state.loading}
            >
             登 录
          </Button>
          <div className="sign_agreement">
            <span className="agreement_left">还没有账号？</span><a className="agreement_right" href="/#/register">免费注册</a>
          </div>
        </Form>
      );
    } else {
      return false;
    }
  }
  _OtherFormBox() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldValidating
    } = this.props.form;
    if (this.state.openPhoneFrom) {
      const wait = this.state.wait;
      return (
        <Form id="phone_login_from" horizontal onSubmit={this.handleSubmitPhone} onFocus={this.handerOnFocus}>
          <div className="sign_input">
            <i className="icon phone-photo"></i>
            <FormItem
              id="control-phone"
              {...formItemLayout}
              hasFeedback
              help={isFieldValidating('phone') ? 'validating...' : (getFieldError('phone') || []).join(', ')}
            >
            {getFieldDecorator('phone', {
              rules: [
                {  required: true, pattern: /^1((3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$)/ , message: '手机号码格式不正确！' },
                {  validator: this.phoneExists }
              ],
            })(
              <Input id="control-phone" placeholder="请输入手机号，未注册将自动注册" />
            )}
            </FormItem>
            <Button
                disabled={wait === 'loading' || wait > 0}
                className="input-group-addon"
                onClick={this.sendDCode}>
                {wait === 'loading'?<Icon type="loading" /> :wait > 0? `(${wait})s后重新获取` : "免费获取手机动态码"}
            </Button>
          </div>
          <div className="sign_input">
            <i className="icon key-photo"></i>
            <FormItem
              id="control-Dcode"
              {...formItemLayout}
              hasFeedback
              help={isFieldValidating('Dcode') ? 'validating...' : (getFieldError('Dcode') || []).join(', ')}
            >
            {getFieldDecorator('Dcode', {
                rules: [
                  { required: true, message: '动态码不能为空' },
                  { validator: this.validatorDcode }
                ],
            })(
              <Input id="control-Dcode" placeholder="动态码"/>
            )}
            </FormItem>
          </div>
          {/* <div className="infos">
           <FormItem
              id="control-autoLogon2"
              {...formItemLayout}
              >
              {getFieldDecorator('autoLogon2', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {type: 'boolean'},
                ],
              })(
                <Checkbox  id="control-autoLogon2" className="ant-checkbox-vertical"> 7天内自动登录</Checkbox>
              )}
              <div className="sign_forgetpasssword">
                  <a href='javascript:void(0);' onClick={()=>{
                    this.setState({
                        openRevicesPass:true,
                        show_dialog: true
                    })
                  }}>忘记密码 ？ </a>
              </div>
            </FormItem>
          </div>*/}
          <Button
            type="primary"
            htmlType="submit"
            className="sign_btn top"
            id="phone_btn"
            loading={this.state.loading}
            >
            登 录
          </Button>
          <div className="sign_agreement">
            <p>提示： 未注册react外卖账号的手机号，登录时将自动注册react外卖账号，且代表您已同意<a href="javascript:void(0);" onClick={() => this.setModalVisible(true)}>《react外卖用户协议》</a></p>
          </div>
        </Form>
      )
    } else {
      return false;
    }
  }
}
index = createForm()(index);
export default connect(
  mapStateToProps,
// Implement map dispatch to props
)(index)
