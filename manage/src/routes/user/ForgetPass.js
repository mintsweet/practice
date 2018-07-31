import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Row, Col, Button } from 'antd';
import classNames from 'classnames';
import styles from './ForgetPass.scss';

const FormItem = Form.Item;

@Form.create()
export default class ForgetPass extends Component {
  state = {
    count: 0
  };
  
  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    const { onGetCaptcha } = this.props;
    if (onGetCaptcha) {
      onGetCaptcha();
    }
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { count } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Form>
          <FormItem>
            {getFieldDecorator('mobile', {

            })(
              <Input
                size="large"
                prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                placeholder="请输入手机号"
                autoComplete="off"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('newPass', {

            })(
              <Input
                size="large"
                type="password"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                placeholder="请输入用户名"
              />
            )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('sms', {
                  rules: [{
                    required: true, message: '请输入手机验证码'
                  }, {
                    len: 6, message: '验证码长度不正确'
                  }]
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mail" className={styles.prefixIcon} />}
                    placeholder="请输入验证码"
                    autoComplete="off"
                  />
                )}
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
            <Link className={classNames(styles.submit, 'ant-btn ant-btn-lg')} to="/user/login">登录</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}