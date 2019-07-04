import * as React from 'react';
import { connect } from 'dva';
import { Form, Input, Icon, Button, Checkbox } from 'antd';
import Link from 'umi/link';
import GlobalFooter from '@/components/Footer';
import logo from '@/assets/logo.png';
import styles from './index.less';

const { Item: FormItem } = Form;

interface Props {
  autoLogin: boolean;
  form: any;
  dispatch: ({}) => void;
}

@connect(({ app }) => ({
  autoLogin: app.autoLogin
}))
class Login extends React.Component<Props> {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'app/signin',
          payload: values
        });
      }
    });
  }

  changeAutoLogin = () => {
    this.props.dispatch({
      type: 'app/updateAutoLogin'
    });
  }

  render() {
    const { autoLogin, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Mints Community</span>
            </Link>
            <div className={styles.desc}>Mints - 后台管理系统</div>
          </div>
          <Form className={styles.main} onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: '请输入你的邮箱号' }]
              })(
                <Input
                  size="large"
                  prefix={<Icon type="mail" className={styles.prefixIcon} />}
                  placeholder="请输入邮箱号"
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入你的密码' }]
              })(
                <Input
                  type="password"
                  size="large"
                  prefix={<Icon type="lock" className={styles.prefixIcon} />}
                  placeholder="请输入密码"
                  autoComplete="off"
                />
              )}
            </FormItem>
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                自动登录
              </Checkbox>
            </div>
            <FormItem>
              <Button size="large" className={styles.submit} type="primary" htmlType="submit">登录</Button>
            </FormItem>
          </Form>
          <GlobalFooter
            links={[
              {
                key: 'souces',
                title: '源码',
                href: 'https://github.com/mintsweet/practice',
                blankTarget: true
              },
              {
                key: 'blog',
                title: '博客',
                href: 'https://github.com/mintsweet/blog',
                blankTarget: true
              }
            ]}
            copyright={
              <>
                Copyright <Icon type="copyright" /> 2018 - 2019 青湛(GitHub/mintsweet)
              </>
            }
          />
        </div>
      </div>
    );
  }
}

export default Form.create()(Login);
