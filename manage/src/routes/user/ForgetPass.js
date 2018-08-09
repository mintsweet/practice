import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Row, Col, Button, Alert, message } from 'antd';
import { getSMSCode } from '@/service/api';
import { forgetPassAction } from '@/store/reducer/status';
import styles from './ForgetPass.scss';

const FormItem = Form.Item;

@connect(
  ({ status, error }) => ({
    status,
    error
  }),
  { forgetPassAction }
)
export default class ForgetPass extends Component {
  state = {
    count: 0,
    mobile: {
      value: ''
    },
    newPass: {
      value: ''
    },
    sms: {
      value: ''
    }
  };

  componentWillReceiveProps(nextProps) {
    const { status } = nextProps;
    if (status === 1) {
      message.success('重置密码成功');
      this.props.history.push('/user');
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
      newPass: {
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
      errorMsg: '请输入六位验证码'
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
  
  // 获取短信验证码
  onGetCaptcha = async () => {
    const { mobile } = this.state;
    const mobileStatus = this.validateMobile(mobile.value);

    if (mobileStatus.errorMsg) {
      return this.setState({
        mobile: mobileStatus
      });
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
    const { mobile, newPass, sms } = this.state;
    
    const mobileStatus = this.validateMobile(mobile.value);
    const newPassStatus = this.validatePass(newPass.value);
    const smsStatus = this.validateSMS(sms.value);
    
    if (mobileStatus.errorMsg) {
      return this.setState({
        mobile: mobileStatus
      });
    } else if (newPassStatus.errorMsg) {
      return this.setState({
        newPass: newPassStatus
      });
    } else if (smsStatus.errorMsg) {
      return this.setState({
        sms: smsStatus
      });
    }

    this.props.forgetPassAction({
      mobile: mobile.value,
      newPass: newPass.value,
      sms: sms.value
    });
  }

  // 错误信息
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { count, mobile, newPass, sms } = this.state;
    const { error } = this.props;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          {error.way === 'FORGET_PASS' && error.content && this.renderMessage(error.content)}
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
            hasFeedback
            validateStatus={newPass.validateStatus}
            help={newPass.errorMsg}
          >
            <Input
              size="large"
              type="password"
              prefix={<Icon type="lock" className={styles.prefixIcon} />}
              placeholder="请输入新密码"
              value={newPass.value}
              onChange={this.handlePasswordChange}
            />
          </FormItem>
          <FormItem
            validateStatus={sms.validateStatus}
            help={sms.errorMsg}
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
          <FormItem>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">重置密码</Button>
            <Link className={`ant-btn ant-btn-lg ${styles.submit}`} to="/user/login">登录</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}