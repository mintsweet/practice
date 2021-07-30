import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'antd';
import styles from './index.module.less';

export interface FormModalItem {
  label: string;
  name: string;
  component?: any;
  render?: any;
  initialValue?: any;
  rules?: any[];
}

interface Props {
  visible: boolean;
  title?: string;
  width?: number;
  formConfig: FormModalItem[];
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
}

function FormModal({
  visible,
  title,
  width,
  formConfig,
  onSubmit,
  onCancel,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const handleDoShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 200);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        setLoading(true);

        try {
          await onSubmit(values);
        } catch (e) {
          handleDoShake();
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        handleDoShake();
      });
  };

  return (
    <Modal
      visible={visible}
      title={title}
      width={width || 500}
      confirmLoading={loading}
      className={shake ? styles.shakeLittle : ''}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form layout="vertical" form={form}>
        {formConfig.map(
          ({ label, name, component, render, initialValue, rules }) => (
            <Form.Item
              key={name}
              label={label}
              name={name}
              initialValue={initialValue}
              rules={rules}
            >
              {component || render()}
            </Form.Item>
          ),
        )}
      </Form>
    </Modal>
  );
}

export default React.memo(FormModal);
