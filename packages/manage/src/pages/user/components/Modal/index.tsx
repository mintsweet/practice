import * as React from 'react';
import { Form, Modal, Input, InputNumber } from 'antd';

const { Item: FormItem } = Form;

const CreateModal = Form.create()((props: any) => {
  const { visible, form, handleToggleModal, handleSubmit } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };

  const onHandleOk = () => {
    form.validateFields((err, values) => {
      if (!err) {
        handleSubmit(values);
      }
    });
  };

  return (
    <Modal
      title="新增用户"
      visible={visible}
      onOk={onHandleOk}
      onCancel={handleToggleModal}
    >
      <FormItem
        {...formItemLayout}
        label="邮箱："
      >
        {getFieldDecorator('email', {
          rules: [
            {
              required: true, message: '邮箱不能为空'
            },
            {
              pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/, message: '请输入正确的邮箱',
            }
          ]
        })(
          <Input placeholder="请输入邮箱" autoComplete="off" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="密码："
      >
        {getFieldDecorator('password', {
          rules: [
            {
              required: true, message: '密码不能为空'
            },
            {
              pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/, message: '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间'
            }
          ]
        })(
          <Input type="password" placeholder="请输入密码" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="昵称："
      >
        {getFieldDecorator('nickname', {
          rules: [
            {
              required: true, message: '昵称不能为空'
            },
            {
              pattern: /^[\u4e00-\u9fa5\w]{2,8}$/, message: '昵称必须在2至8位之间'
            }
          ]
        })(
          <Input placeholder="请输入密码" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="权限值："
      >
        {getFieldDecorator('role', {
          rules: [
            {
              required: true, message: '权限值不能为空'
            }
          ]
        })(
          <InputNumber min={0} max={99} style={{ width: '100%', }} placeholder="请输入权限值" />
        )}
      </FormItem>
    </Modal>
  );
});

export default CreateModal;
