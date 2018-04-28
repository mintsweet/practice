import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { List, InputItem, WhiteSpace, WingBlank, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { forgetFunc } from '@/store/user.reducer';
import { getMsgCaptchaApi } from '@/service/api';
import styles from './index.module.scss';

class Forget extends Component {
  state = {
    error: '',
    text: '获取验证码',
    disabled: false
  };

  perrtyError = (error) => {
    if (!error) {
      return;
    }
    if (typeof error === 'string') {
      return error;
    }
    const firstKey = (Object.keys(error))[0];
    const firstError = error[firstKey].errors[0].message;
    return firstError;
  }

  getMsgCaptcha = async () => {
    const mobile = this.props.form.getFieldValue('mobile');
    if (mobile) {
      let i = 60;
      const timer = setInterval(() => {
        if (i > 0) {
          this.setState({
            text: `${i}秒后获取`,
            disabled: true
          });
        } else {
          clearInterval(timer);
          this.setState({
            text: '获取验证码',
            disabled: false
          });
        }
        i--;
      }, 1000);
      const res = await getMsgCaptchaApi({ mobile });
      if (res.status === 1) {
        Toast.success('获取验证码成功');
      } else {
        this.setState({
          error: res.message
        });
      }
    }
  }

  forget = () => {
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          error
        });
      } else {
        this.props.forgetFunc(values);
      }
    });
  }

  render() {
    const { error, text, disabled } = this.state;
    const { form } = this.props;
    const { getFieldProps } = form;

    return (
      <div>
        <div className={styles.error}>
          {this.perrtyError(error)}
        </div>
        <List>
          <InputItem
            {...getFieldProps('mobile', {
              rules: [{
                required: true, message: '手机号不能为空',
                pattern: /^1[3,5,7,8,9]\d{9}$/, message: '请输入正确的手机号'
              }]
            })}
            placeholder="请输入手机号"
          >手机号：</InputItem>
          <InputItem
            {...getFieldProps('password', {
              rules: [{
                required: true, message: '密码不能为空',
                pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/
              }]
            })}
            type="password"
            placeholder="请输入新密码"
          >新密码：</InputItem>
          <List.Item extra={<Button onClick={this.getMsgCaptcha} disabled={disabled}>{text}</Button>}>
            <InputItem
              {...getFieldProps('msgcaptcha', {
                rules: [{
                required: true, message: '验证码不能为空',
                  pattern: /^\d{6}$/, message: '请输入6位验证码'
                }]
              })}
              placeholder="请输入验证码"
            />
          </List.Item>
        </List>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Button type="primary" onClick={this.forget}>提交</Button>
          <div className={styles.more}>
            <div className="left">
              <Link to="/user/signup">没有账号？注册</Link>
            </div>
          </div>
        </WingBlank>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  { forgetFunc }
)(createForm()(Forget));