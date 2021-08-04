import { useEffect } from 'react';
import {
  MailOutlined,
  LockOutlined,
  CopyrightOutlined,
} from '@ant-design/icons';
import { Form, Input, Checkbox, Button, Alert } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Link, useHistory } from 'react-router-dom';
import userStore, { LoginPayload } from '@/store/user';
import logo from '@/assets/logo.png';
import styles from './index.module.less';

export default function Login() {
  const loginStatus = userStore.useState('status');
  const loginError = userStore.useState('error');
  const userInfo = userStore.useState('info');
  const autoLogin = userStore.useState('autoLogin');
  const history = useHistory();

  const handleFinish = (values: LoginPayload) => {
    userStore.dispatch('login', values);
  };

  const handleChangeAutoLogin = (e: CheckboxChangeEvent) => {
    userStore.dispatch('changeAutoLogin', {
      autoLogin: e.target.checked,
    });
  };

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>Mints Community</span>
          </Link>
          <div className={styles.desc}>后台管理系统</div>
        </div>
        <Form className={styles.main} onFinish={handleFinish}>
          {loginStatus === -1 && (
            <Form.Item>
              <Alert type="error" message={loginError} />
            </Form.Item>
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入你的邮箱号' }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="请输入邮箱号"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入你的密码' }]}
          >
            <Input
              type="password"
              size="large"
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="off"
            />
          </Form.Item>
          <div>
            <Checkbox checked={autoLogin} onChange={handleChangeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Form.Item>
            <Button
              size="large"
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <div className={styles.links}>
            {[
              {
                key: 'souces',
                title: '源码',
                href: 'https://github.com/mintsweet/practice',
                blankTarget: true,
              },
              {
                key: 'blog',
                title: '博客',
                href: 'https://github.com/mintsweet/blog',
                blankTarget: true,
              },
            ].map(link => (
              <a
                key={link.key}
                target={link.blankTarget ? '_blank' : '_self'}
                href={link.href}
                rel="noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
          <div className={styles.copyright}>
            Copyright <CopyrightOutlined /> 2018 - 2021 青湛(GitHub/mintsweet)
          </div>
        </div>
      </div>
    </div>
  );
}
