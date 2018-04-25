import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, InputItem, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.module.scss';

class Forget extends Component {
  state = {
    error: ''
  };

  perrtyError = (error) => {
    if (!error) {
      return;
    }
    const firstKey = (Object.keys(error))[0];
    const firstError = error[firstKey].errors[0].message;
    return firstError;
  }

  render() {
    const { error } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div className={styles.error}>
          {this.perrtyError(error)}
        </div>
        <List>
          <InputItem
            {...getFieldProps('mobile', {
              rules: [{
                required: true, message: '手机号不能为空!'
              }]
            })}
            type="phone"
            placeholder="请输入手机号"
          >手机号：</InputItem>
          <InputItem
            {...getFieldProps('password', {
              rules: [{
                required: true, message: '密码不能为空!'
              }]
            })}
            type="password"
            placeholder="请输入密码"
          >新密码：</InputItem>
          <List.Item extra={<Button>获取验证码</Button>}>
            <InputItem
              {...getFieldProps('checkcode', {
                rules: [{
                  required: true, message: '验证码不能为空!'
                }]
              })}
              placeholder="请输入验证码"
            />
          </List.Item>
        </List>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Button type="primary">提交</Button>
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

export default createForm()(Forget);