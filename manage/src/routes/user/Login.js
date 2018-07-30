import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Form, Tabs, Input, Row, Col, Button, Checkbox } from 'antd';
import styles from './Login.scss';

const TabPane = Tabs.TabPane;

@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    autoLogin: true
  };

  handleSubmit = () => {
    console.log('submit');
    return false;
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
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
    const { count, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs className={styles.tabs} defaultActiveKey="acc">
            <TabPane tab="账号密码登录" key="acc">
              <Form.Item>
                <Input size="large" prefix={<Icon type="user" className={styles.prefixIcon} />} placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item>
                <Input size="large" type="password" prefix={<Icon type="lock" className={styles.prefixIcon} />} placeholder="请输入用户名" />
              </Form.Item>
            </TabPane>
            <TabPane tab="手机号登录" key="sms">
              <Form.Item>
                <Input size="large" prefix={<Icon type="mobile" className={styles.prefixIcon} />} placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item>
              <Row gutter={8}>
                <Col span={16}>
                  <Input size="large" prefix={<Icon type="mail" className={styles.prefixIcon} />} placeholder="请输入验证码" />
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
              </Form.Item>
            </TabPane>
          </Tabs>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <Link style={{ float: 'right' }} to="/user/forget_pass">忘记密码</Link>
          </div>
          <Form.Item>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}