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
  message,
  Row,
  Col,
  Checkbox,
  Modal
} from 'antd';
import Img from 'common/Img';
import {
    getVerifyCode,
    getCheckCode,
    register
} from 'actions/SignPageAction';
import Footer from 'components/common/Footer';
import Aggrement from 'components/SignPage/Aggrement/';

const FormItem = Form.Item;
const createForm = Form.create;
import classNames from 'classnames';

const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  },
};

function mapStateToProps(state) {
  return {

  };
}

let index= class extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      wait: 0,
      type:"registerValidate",
      dirty: false,
      passBarShow: false,
      passStrength: 'L',
      rePassStrength: 'L',
      openFormError:false,
      validate_info: "",
      clickAggrement:false,
      modalVisible: false,
      loading:false
    }
  }

  noop() {
    return false;
  }

  phoneExists = (rule, value, callback) => {
    if(value==""){
      callback([new Error('手机号码不能为空！')]);
    }else{
      callback();
    }
  }

  sendDCode=()=>{
    console.log("注册发送验证码。。。");
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
            if(re.result==1){
              this.setState({
                  wait: 60
              })
              message.success("验证码已发送请查收");
              console.log(re.data.verifyCode);
              this.b = setInterval(() => {
                  if (this.state.wait == -1) {
                      clearInterval(this.b);
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
        if(re.result==1){
            callback();
        } else {
          callback([new Error('动态码验证失败')]);
        }
      }
    ))
  }
  renderPassStrengthBar(type) {
    const strength = type === 'pass' ? this.state.passStrength : this.state.rePassStrength;
    const classSet = classNames({
      'ant-pwd-strength': true,
      'ant-pwd-strength-low': strength === 'L',
      'ant-pwd-strength-medium': strength === 'M',
      'ant-pwd-strength-high': strength === 'H',
    });
    const level = {
      L: '弱',
      M: '中',
      H: '强',
    };
    return (
      <div>
        <ul className={classSet}>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-1" >
            <span className="ant-form-text">
              {level['L']}
            </span>
          </li>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-2" >
            <span className="ant-form-text">
              {level['M']}
            </span>
          </li>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-3" >
             <span className="ant-form-text">
              {level['H']}
            </span>
          </li>
        </ul>
      </div>
    );
  }
  checkPass=(rule, value, callback)=> {
    const form = this.props.form;
    this.getPassStrenth(value, 'pass');

    if (form.getFieldValue('pass') && this.state.dirty) {
      form.validateFields(['rePass'], { force: true });
    }

    callback();
  }

  checkPass2=(rule, value, callback)=> {
    const form = this.props.form;
    this.getPassStrenth(value, 'rePass');

    if (value && value !== form.getFieldValue('pass')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  }

   getPassStrenth=(value, type)=> {
    if (value) {
      let strength;
      var lv = 0;
      if (value.match(/[a-z]/g)) {
        lv++;
      }
      if (value.match(/[0-9]/g)) {
        lv++;
      }
      if (value.match(/(.[^a-z0-9])/g)) {
        lv++;
      }
      if (value.length < 6) {
        lv = 0;
      }
      if (lv > 3) {
        lv = 3;
      }
      lv === 1 ? strength = 'L' : lv === 2 ? strength = 'M' :lv === 3 ? strength = 'H' : strength="";
      this.setState({
        [`${type}BarShow`]: true,
        [`${type}Strength`]: strength,
      });
    } else {
      this.setState({
        [`${type}BarShow`]: false,
      });
    }
  }

  componentWillUnmount() {
    if(this.b){
      clearInterval(this.b);
    }
  }

  handerOnFocus=()=>{
    this.setState({
      openFormError:false,
      validate_info: ""
    })
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    console.log("registerSubmit");
    this.setState({
      loading:true
    });
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log(' 表单验证错误!');
        this.setState({
          openFormError: true,
          validate_info: '注册信息不完整!',
          loading:false
        })
        return;
      }
      console.log('表单验证成功');
      console.log(values);
      let bool=false;
      if(values.checkAggrement) {
        console.log("勾选协议");
        bool=true;
      }
      if(bool){
        this.props.dispatch(register({
              "password": values.pass,
              "validateCode": values.Dcode,
              "name": values.phone
            },(re)=> {
              if(re.result==1){
                console.log('注册成功');
                message.success("注册成功");
              }else{
                console.log("注册失败");
                this.setState({
                  openFormError: true,
                  validate_info: re.msg,
                  loading:false
                })
                /*this.resetForm();*/
              }
            }
          )
        )
      }else{
        this.setState({
          loading:false
        })
      }
    });
  }
  resetForm=()=> {
    this.props.form.resetFields();
  }
  setModalVisible=(modalVisible)=> {
    this.setState({ modalVisible });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldValidating
    } = this.props.form;
    const wait = this.state.wait;
    return (
      <div className="register-box">
          <div className="sign_head">
            <div className="sign_logo">
                <a href='/#/'>
                  <Img alt="react外卖" src="logo.png" className="sign_img" />
                </a>
            </div>
          </div>
          <div className="sign_body">
            {
              this.state.openFormError?(
                <Row className="info-box">
                  <Col span={7}></Col>
                  <Col span={17}>
                    <div className="validate-info">
                      <i className="i3"></i>{this.state.validate_info}
                      </div>
                  </Col>
                </Row>
              ):undefined
            }
            <Form id="register_from" horizontal onSubmit={this.handleSubmit} onFocus={this.handerOnFocus}>
              <div className="sign_input">
                <FormItem
                  id="control-phone"
                  {...formItemLayout}
                  label="手机号"
                  hasFeedback
                  help={isFieldValidating('phone') ? 'validating...' : (getFieldError('phone') || []).join(', ')}
                >
                {getFieldDecorator('phone', {
                  rules: [
                    {  required: true, pattern: /^1((3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$)/ , message: '手机号码格式不正确！' },
                    {  validator: this.phoneExists }
                  ],
                })(
                  <Input id="control-phone" placeholder="" />
                )}
                </FormItem>
                <Row>
                  <Col span={7}></Col>
                  <Col span={17}>
                    <Button
                      disabled={wait === 'loading' || wait > 0}
                      className="input-group-addon"
                      onClick={this.sendDCode}>
                      {wait === 'loading'?<Icon type="loading" /> :wait > 0? `(${wait})s后重新获取` : "免费获取手机动态码"}
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="sign_input">
                <FormItem
                  id="control-Dcode"
                  {...formItemLayout}
                  label="短信验证码"
                  hasFeedback
                  help={isFieldValidating('Dcode') ? 'validating...' : (getFieldError('Dcode') || []).join(', ')}
                >
                {getFieldDecorator('Dcode', {
                    rules: [
                      { required: true, message: '动态码不能为空' },
                      { validator: this.validatorDcode }
                    ],
                })(
                  <Input id="control-Dcode" placeholder=""/>
                )}
                </FormItem>
              </div>
              <div className="sign_input">
                <FormItem
                  id="control-pass"
                  label="创建密码"
                  {...formItemLayout}
                  hasFeedback
                  help={isFieldValidating('pass') ? 'validating...' : (getFieldError('pass') || []).join(', ')}
                >
                  {getFieldDecorator('pass', {
                    rules: [
                      { required: true, whitespace: true, message: '请输入你的密码' },
                      { validator: this.checkPass },
                    ],
                  })(
                    <Input
                      id="control-pass"
                      type="password"
                      onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                      autoComplete="off" id="pass"
                      onBlur={(e) => {
                        const value = e.target.value;
                        this.setState({ dirty: this.state.dirty || !!value });
                      }}
                    />
                  )}
                </FormItem>
              </div>
              <div className="sign_input">
              <Row>
                  <Col span={7}></Col>
                  <Col span={17}>
                    {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
                  </Col>
              </Row>
              </div>
              <div className="sign_input">
                <FormItem
                  id="control-rePass"
                  label="确认密码"
                  {...formItemLayout}
                  hasFeedback
                  help={isFieldValidating('rePass') ? 'validating...' : (getFieldError('rePass') || []).join(', ')}
                >
                  {getFieldDecorator('rePass', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: '请输入确认密码',
                    }, {
                      validator: this.checkPass2,
                    }],
                  })(
                    <Input
                      id="control-rePass"
                      type="password"
                      onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                      autoComplete="off" id="rePass"
                    />
                  )}
                </FormItem>
              </div>
              <Row>
                  <Col span={7}></Col>
                  <Col span={17}>
                    <Button
                      id="reg_btn"
                      type="primary"
                      htmlType="submit"
                      className={this.state.clickAggrement?"sign_btn":"sign_btn sign_btn_disable"}
                      disabled={!this.state.clickAggrement}
                      loading={this.state.loading}
                      >
                       同意以下协议并注册
                    </Button>
                  </Col>
              </Row>
              <div className="sign_input">
                <Col span={7}></Col>
                <FormItem
                  id="control-checkAggrement"
                  {...formItemLayout}
                >
                  {getFieldDecorator('checkAggrement', {
                    valuePropName: 'checked',
                    initialValue: this.state.clickAggrement,
                    rules: [
                      { type: 'boolean'},
                    ],
                  })(
                    <Checkbox
                      id="control-checkAggrement"
                      className="ant-checkbox-vertical"
                      onClick={(e) => {
                        this.setState({ clickAggrement: !this.state.clickAggrement });
                      }}
                    >
                        <a href="javascript:void(0);" onClick={() => this.setModalVisible(true)}>《react外卖用户协议》</a><a className="agreement_right" href="/#/login"> 账号登录</a>
                    </Checkbox>
                  )}
                </FormItem>
              </div>
            </Form>
          </div>
          <Footer/>
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
      </div>
    );
  }
}

index = createForm()(index);
export default connect(
  mapStateToProps,
// Implement map dispatch to props
)(index)
