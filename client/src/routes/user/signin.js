import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { WingBlank, List, InputItem, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { signinApi } from '../../service/api';
import styles from './index.module.css';

class Signin extends Component {
  async signin = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        const res = await signinApi(value);
        console.log(value); 
      }
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <List>
          <InputItem
            {...getFieldProps('mobile', {
              rules: [{ required: true }]
            })}
            type="phone"
            placeholder="请输入注册的手机号"
            error={true}
          >手机号：</InputItem>
          <InputItem
            {...getFieldProps('password')}
            type="password"
            placeholder="请输入密码"
          >密码：</InputItem>
        </List>
        <WingBlank style={{ marginTop: 10 }}>
          <Button type="primary" onClick={() => this.signin()}>登录</Button>
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