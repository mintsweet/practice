import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { List, InputItem, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { signupFunc } from '@/store/user.reducer';
import styles from './index.module.scss';

class Signup extends Component {
  state = {
    error: ''
  };

  signup = () => {
    this.props.form.validateFields((error, values) => {
      if (error) {
        this.setState({
          error
        });
      } else {
        this.props.signupFunc(values);
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
      return <Redirect to="/" />
    } else {
      return null;
    }
  }

  render() {
    const { error } = this.state;
    const { form, user } = this.props;
    const { getFieldProps } = form;
    return (
      <div>
        {this.redirect(user)}
        <div className={styles.error}>
          {this.perrtyError(error)}
          {user.error}
        </div>
        <List>
          <InputItem
            {...getFieldProps('mobile', {
              rules: [{
                required: true, message: '手机号不能为空!',
                pattern: /^1[3,5,7,8,9]\d{9}$/, message: '密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间!'
              }]
            })}
            placeholder="请输入手机号"
          >手机号：</InputItem>
          <InputItem
            {...getFieldProps('password', {
              rules: [{
                required: true, message: '密码不能为空!',
                pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/
              }]
            })}
            type="password"
            placeholder="请输入密码"
          >密码：</InputItem>
          <InputItem
            {...getFieldProps('nickname', {
              rules: [{
                validator: (rule, value, callback) => {
                  if (value.length > 10 || value.length < 4) {
                    callback('请输入4-8位的名称!');
                  }
                  callback();
                }
              }]
            })}
            placeholder="请输入名称或常用昵称"
          >名称：</InputItem>
        </List>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Button type="primary" onClick={this.signup}>注册</Button>
          <div className={styles.more}>
            <div className="left">
              <Link to="/user/signin">已有账号？登录</Link>
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
  { signupFunc }
)(createForm()(Signup));