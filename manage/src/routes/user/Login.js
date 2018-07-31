import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Form, Tabs, Input, Row, Col, Button, Checkbox } from 'antd';
import styles from './Login.scss';

const FormItem = Form.Item;
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
    }, 1000);b
  };

  render() {
    const { count, autoLogin } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs className={styles.tabs} defaultActiveKey="acc">
            <TabPane tab="账号密码登录" key="acc">
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
                {getFieldDecorator('password', {

                })(
                  <Input
                    type="password"
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
            </TabPane>
            <TabPane tab="手机快捷登录" key="sms">
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
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('sms', {

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