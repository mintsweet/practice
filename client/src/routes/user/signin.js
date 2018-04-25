import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { WingBlank, List, InputItem, Button, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.module.scss';

class Signin extends Component {
  state = {
    error: ''
  };

  signin = () => {
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        this.setState({
          error
        });
      } else {
        console.log(1);
      }
    });
  }

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
            placeholder="请输入注册的手机号"
          >手机号：</InputItem>
          <InputItem
            {...getFieldProps('password', {
              rules: [{
                required: true, message: '密码不能为空!'
              }]
            })}
            type="password"
            placeholder="请输入密码"
          >密码：</InputItem>
        </List>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Button type="primary" onClick={this.signin}>登录</Button>
          <div className={styles.more}>
            <div className={styles.left}>
              <Link to="/user/forget" replace>忘记密码</Link>
            </div>
            <div className={styles.right}>
              <Link to="/user/signup" replace>注册账号</Link>
            </div>
          </div>
        </WingBlank>
      </div>
    );
  }
}

export default createForm()(Signin)