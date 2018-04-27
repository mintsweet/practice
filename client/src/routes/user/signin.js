import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Toast, WingBlank, List, InputItem, Button, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { signinFunc } from '@/store/user.reducer';
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
        this.props.signinFunc(values);
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

  redirect(user) {
    if (user.info) {
      return <Redirect to="/" />;
    } else {
      this.setState({
        error: user.error
      });
    }
  }


  render() {
    const { error } = this.state;
    const { form, user } = this.props;
    const { getFieldProps } = form;
    return (
      <div>
        {user.info && this.redirect(user)}
        <div className={styles.error}>
          {this.perrtyError(error)}
        </div>
        <List>
          <InputItem
            {...getFieldProps('mobile', {
              rules: [{
                pattern: /^1[3,5,7,8,9]\d{9}$/, message: '请输入正确的手机号'
              }]
            })}
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

export default connect(
  state => ({
    user: state.user
  }),
  { signinFunc }
)(createForm()(Signin));