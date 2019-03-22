import * as React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Form, Input, Icon, Button } from 'antd';
import styles from './forget_pass.less';

const { Item: FormItem } = Form;

interface Props {
  form: any;
  dispatch: ({}) => void;
};

@connect()
class ForgetPass extends React.Component<Props> {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'app/forgetPass'
    })
  }

  render() {
    const { form } = this.props;
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
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">重置密码</Button>
            <Link className={`ant-btn ant-btn-lg ${styles.submit}`} to="/user/login">登录</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ForgetPass);
