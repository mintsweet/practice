import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, Form, Select, Input, Button, message } from 'antd';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMarkdown from 'react-markdown';
import BasicLayout from '@/components/BasicLayout';
import { TabMap } from '@/common/constant';
import * as Service from './service';

const { Option } = Select;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function TopicDetail() {
  const [title, setTitle] = useState('创建话题');
  const [subType, setSubType] = useState<'create' | 'update'>('create');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const history = useHistory();
  const [form] = Form.useForm();
  const id = useQuery().get('id') as string;

  useEffect(() => {
    (async () => {
      if (id) {
        const res = await Service.getTopicById(id);
        form.setFieldsValue({
          tab: res.tab,
          title: res.title,
          content: res.content,
        });
        setTitle('更新话题');
        setSubType('update');
      }
    })();
  }, [form, id]);

  const handleSubmit = async (values: any) => {
    if (subType === 'create') {
      await Service.createTopic(values);
      message.success('创建话题成功');
    } else {
      await Service.updateTopic(id, values);
      message.success('更新话题成功');
    }

    setTimeout(() => {
      history.push('/topic');
    }, 1000);
  };

  return (
    <BasicLayout>
      <Card title={title}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="tab"
            label="话题类别"
            rules={[{ required: true, message: '请选择话题类别' }]}
          >
            <Select>
              {Object.keys(TabMap).map(k => (
                <Option key={k} value={k}>
                  {TabMap[k]?.label || k}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="话题标题"
            rules={[{ required: true, message: '请输入话题标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="话题内容"
            rules={[{ required: true, message: '请输入话题内容' }]}
          >
            <ReactMde
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown =>
                Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
              }
              childProps={{
                writeButton: {
                  tabIndex: -1,
                },
              }}
              minEditorHeight={600}
              minPreviewHeight={600}
            />
          </Form.Item>
          <Form.Item>
            <Button style={{ marginLeft: 81 }} type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </BasicLayout>
  );
}
