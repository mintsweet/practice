import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Avatar, Tag, Badge, Divider, Modal, Form, Input, InputNumber, message } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';
import { getUserList, createUser } from '@/service/api';

const { Item: FormItem } = Form;

// 保存
const CreateModal = Form.create()(props => {
  const { visible, confirmLoading, form, handleToggleModal, handleCreateUser } = props;
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
        handleCreateUser(values);
      }
    });
  };
  return (
    <Modal
      title="保存用户"
      visible={visible}
      onOk={onHandleOk}
      confirmLoading={confirmLoading}
      onCancel={handleToggleModal}
    >
      <FormItem
        {...formItemLayout}
        label="手机号："
      >
        {getFieldDecorator('mobile', {
          rules: [ {
            required: true, message: '手机号不能为空'
          }, {
            pattern: /^1[1,3,5,7,8]\d{9}$/, message: '请输入正确的手机号',
          }]
        })(
          <Input placeholder="请输入手机号" autoComplete="off" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="密码："
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: '密码不能为空'
          }, {
            pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/, message: '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间'
          }]
        })(
          <Input type="password" placeholder="请输入密码" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="昵称："
      >
        {getFieldDecorator('nickname', {
          rules: [{
            required: true, message: '昵称不能为空'
          }, {
            pattern: /^[\u4e00-\u9fa5\w]{2,8}$/, message: '昵称必须在2至8位之间'
          }]
        })(
          <Input placeholder="请输入密码" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="权限值："
      >
        {getFieldDecorator('role', {
          rules: [{
            required: true, message: '权限值不能为空'
          }]
        })(
          <InputNumber min={0} max={99} style={{ width: '100%' }} placeholder="请输入权限值" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(
  ({ user }) => ({
    user
  }),
  { changeLoadingAction }
)
export default class User extends Component {
  state = {
    data: [],
    visible: false,
    confirmLoading: false
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const data = await getUserList();
    this.setState({
      data
    });
    this.props.changeLoadingAction(false);
  }

  // 表格选中
  onSelectTable = (selectedRowKeys) => {
    console.log(selectedRowKeys);
  }

  // 显示隐藏编辑框
  handleToggleModal = () => {
    this.setState({
      visible: !this.state.visible
    });
  }

  // 创建用户
  handleCreateUser = async values => {
    this.setState({
      confirmLoading: true
    });
    await createUser(values);
    await this.getData();
    message.success('新增用户成功');
    this.setState({
      visible: false,
      confirmLoading: false
    });
  }

  // 删除用户
  handleDeleteUser = () => {
    Modal.confirm({
      title: '确定物理删除这条数据吗?',
      content: '直接从数据库中删除数据是无法恢复的，请慎重考虑以后在进行操作！',
      onOk() {
        console.log(1);
      }
    });
  }

  render() {
    const { data, visible, confirmLoading } = this.state;
    const { user } = this.props;

    const columns = [{
      title: '头像',
      render: record => <Avatar src={record.avatar} size="small" />
    }, {
      title: '手机号',
      dataIndex: 'mobile'
    }, {
      title: '昵称',
      dataIndex: 'nickname'
    }, {
      title: '积分',
      dataIndex: 'score',
      sorter: (a, b) => a.role - b.role
    }, {
      title: '星标用户',
      dataIndex: 'star',
      filters: [{
        text: '是',
        value: 'yes',
      }, {
        text: '否',
        value: 'no',
      }],
      filterMultiple: false,
      onFilter: (value, record) => value === 'yes' ? record.star : !record.star,
      render: star => star ? <Tag color="blue">是</Tag> : <Tag color="magenta">否</Tag>
    }, {
      title: '用户状态',
      render: record => record.delete ? <Badge status="error" text="已删除" /> : record.lock ? <Badge color="warning" text="已封号" /> : <Badge status="success" text="正常" />
    }, {
      title: '权限值',
      dataIndex: 'role',
      sorter: (a, b) => a.role - b.role
    }, {
      title: '创建时间',
      dataIndex: 'create_at'
    }, {
      title: '操作',
      render: record => (
        <span>
          {user.role > 100 && (
            <span>
              <a href="javascript:;" className="text-error" onClick={this.handleDeleteUser}>删除</a>
              <Divider type="vertical" />
            </span>
          )}
          <a href="javascript:;" className="text-default">{ record.star ? '取消星标' : '设为星标'}</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="text-warn">{ record.lock ? '取消锁定' : '锁定账户' }</a>
        </span>
      )
    }];

    // 表格选择
    const rowSelection = {
      onChange: this.onSelectTable
    };

    // 模态框父级方法
    const parentMethods = {
      handleToggleModal: this.handleToggleModal,
      handleCreateUser: this.handleCreateUser
    };

    return (
      <PageLayout>
        <div className="page-content">
          <div className="table-action">
            <Button type="primary" onClick={this.handleToggleModal}>新增</Button>
          </div>
          <Table
            rowKey="id"
            size="middle"
            dataSource={data}
            columns={columns}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              total: 10
            }}
          />
          <CreateModal
            visible={visible}
            confirmLoading={confirmLoading}
            {...parentMethods}
          />
        </div>
      </PageLayout>
    );
  }
}