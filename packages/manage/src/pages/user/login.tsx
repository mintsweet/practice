import * as React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Form, Input, Icon, Button, Checkbox } from 'antd';
import styles from './login.less';

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
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
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
            <Link style={{ float:'right', }} to="/user/forget_pass">忘记密码</Link>
          </div>
          <FormItem>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">登录</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
