import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Form, Tabs, Input, Row, Col, Button, Checkbox, Alert, message } from 'antd';
import { signinFunc } from '@/store/user.reducer';
import { getSMSCode } from '../../service/api';
import styles from './Login.scss';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(
  ({ user }) => ({
    user: user.info,
    error: user.error
  }),
  { signinFunc }
)
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    autoLogin: true,
    type: 'acc',
    mobile: {
      value: ''
    },
    password: {
      value: ''
    },
    sms: {
      value: ''
    }
  };

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    if (user && user.id) {
      this.props.history.push('/');
    }
  }

  // 校验手机号
  validateMobile = mobile => {
    if (/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '请输入正确格式的手机号'
    };
  }

  // 监听手机号
  handleMobileChange = e => {
    const value = e.target.value;
    this.setState({
      mobile: {
        value,
        ...this.validateMobile(value)
      }
    });
  }

  // 校验密码
  validatePass = password => {
    if (/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '请输入正确格式的密码'
    };
  }

  // 监听密码
  handlePasswordChange = e => {
    const value = e.target.value;
    this.setState({
      password: {
        value,
        ...this.validatePass(value)
      }
    });
  }

  // 校验验证码
  validateSMS = sms => {
    if (/^\d{6}$/.test(sms)) {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: '请输入正确格式验证码'
    };
  }

  // 监听验证码
  handleSMSChange = e => {
    const value = e.target.value;
    this.setState({
      sms: {
        value,
        ...this.validateSMS(value)
      }
    });
  }

  // 切换登录方式
  handleChangeTab = key => {
    this.setState({
      type: key
    });
  }

  // 修改自动登录
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  // 获取短信验证码
  onGetCaptcha = async () => {
    const { mobile } = this.state;
    const mobileStatus = this.validateMobile(mobile.value);

    if (mobileStatus.errorMsg) {
      this.setState({
        mobile: {
          ...mobileStatus
        }
      });
      return;
    }
 
    try {
      await getSMSCode({ mobile: mobile.value });
      let count = 59;
      this.setState({ count });
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    } catch(err) {
      message.error(err.message);
    }
  };

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { type, mobile, password, sms } = this.state;
    
    const mobileStatus = this.validateMobile(mobile.value);
    const passwordStatus = this.validatePass(password.value);
    const smsStatus = this.validateSMS(sms.value);
    
    if (mobileStatus.errorMsg) {
      return this.setState({
        mobile: {
          ...mobile
        }
      });
    } else if (passwordStatus.errorMsg && type === 'acc') {
      return this.setState({
        password: {
          ...this.validatePass(password.value)
        }
      });
    } else if (smsStatus.errorMsg && type ==='msg') {
      return this.setState({
        sms: {
          ...this.validateSMS(sms.value)
        }
      });
    }
    
    this.props.signinFunc({
      type,
      mobile: mobile.value,
      password: password.value,
      sms: sms.value
    });
  }

  // 错误信息
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { count, autoLogin, mobile, password, sms, type } = this.state;
    const { error } = this.props;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs className={styles.tabs} defaultActiveKey="acc" onChange={this.handleChangeTab}>
            <TabPane tab="账号密码登录" key="acc">
              {error && type === 'acc' && this.renderMessage(error)}
              <FormItem
                hasFeedback
                validateStatus={mobile.validateStatus}
                help={mobile.errorMsg}
              >
                <Input
                  size="large"
                  prefix={<Icon type="user" className={styles.prefixIcon} />}
                  placeholder="请输入账号"
                  autoComplete="off"
                  value={mobile.value}
                  onChange={this.handleMobileChange}
                />
              </FormItem>
              <FormItem
                hasFeedback
                validateStatus={password.validateStatus}
                help={password.errorMsg}
              >
                <Input
                  type="password"
                  size="large"
                  prefix={<Icon type="lock" className={styles.prefixIcon} />}
                  placeholder="请输入密码"
                  value={password.value}
                  onChange={this.handlePasswordChange}
                />
              </FormItem>
            </TabPane>
            <TabPane tab="手机快捷登录" key="sms">
              {error && type === 'sms' && this.renderMessage(error)}
              <FormItem
                hasFeedback
                validateStatus={mobile.validateStatus}
                help={mobile.errorMsg}
              >
                <Input
                  size="large"
                  prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                  placeholder="请输入手机号"
                  autoComplete="off"
                  value={mobile.value}
                  onChange={this.handleMobileChange}
                />
              </FormItem>
              <FormItem
                validateStatus={sms.validateStatus}
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Input
                      size="large"
                      prefix={<Icon type="mail" className={styles.prefixIcon} />}
                      placeholder="请输入验证码"
                      autoComplete="off"
                      value={sms.value}
                      onChange={this.handleSMSChange}
                      help={sms.errorMsg}
                    />
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane>
          </Tabs>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <Link style={{ float: 'right' }} to="/user/forget_pass">忘记密码</Link>
          </div>
          <FormItem>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">登录</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}