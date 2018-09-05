import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Avatar, Tag, Badge, Divider, Modal, Form, Input, InputNumber, message } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';
import { getUserList, createUser, deleteUser, starOrUnUser, lockOrUnUser } from '@/service/api';

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
    confirmLoading: false,
    page: 1,
    size: 10,
    total: 0
  };

  componentDidMount() {
    this.getData(this.state.page);
  }

  getData = async page => {
    const data = await getUserList({ page, size: this.state.size });
    this.setState({
      data: data.users,
      page: data.page,
      size: data.size,
      total: data.total
    });
    this.props.changeLoadingAction(false);
  }

  // 切换页码
  handleChangePage = page => {
    this.getData(page);
    this.setState({
      page
    });
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
    try {
      await createUser(values);
      await this.getData();
      message.success('新增用户成功');
      this.setState({
        visible: false
      });
    } catch(err) {
      message.error(err);
    }
    this.setState({
      confirmLoading: false
    });
  }

  // 校验操作规则
  validAction = record => {
    const { user } = this.props;

    if (user.id === record.id) {
      message.error('不能对自己操作');
      return false;
    }

    if (user.role < record.role) {
      message.error('不能操作比自己权限更高的用户');
      return false;
    }

    return true;
  }

  // 删除用户
  handleDeleteUser = record => {
    if (this.validAction(record)) {
      Modal.confirm({
        title: '确定物理删除这条数据吗?',
        content: '直接从数据库中删除数据是无法恢复的，请慎重考虑以后在进行操作！',
        onOk: async () => {
          await deleteUser(record.id);
          message.success('删除用户成功');
          this.getData();
        }
      });
    }
  }

  // 用户星标状态修改
  handleStarUser = async record => {
    if (this.validAction(record)) {
      const action = await starOrUnUser(record.id);
      if (action.indexOf('un') === 0) {
        message.success('取消星标用户');
      } else {
        message.success('设为星标用户');
      }
      this.getData();
    }
  }

  // 用户锁定状态修改
  handleLockUser = async record => {
    if (this.validAction(record)) {
      const action = await lockOrUnUser(record.id);
      if (action.indexOf('un') === 0) {
        message.success('取消锁定用户');
      } else {
        message.success('锁定用户账户')
      }
      this.getData();
    }
  }

  render() {
    const { data, visible, confirmLoading, page, size, total } = this.state;
    const { user } = this.props;

    const columns = [{
      title: '头像',
      key: 'avatar',
      render: record => <Avatar src={record.avatar} size="small" />
    }, {
      title: '手机号',
      key: 'mobile',
      dataIndex: 'mobile'
    }, {
      title: '昵称',
      key: 'nickname',
      dataIndex: 'nickname'
    }, {
      title: '积分',
      key: 'score',
      dataIndex: 'score',
      sorter: (a, b) => a.score - b.score
    }, {
      title: '星标用户',
      key: 'star',
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
      key: 'status',
      render: record => record.delete ? <Badge status="error" text="已注销" /> : record.lock ? <Badge status="warning" text="已锁定" /> : <Badge status="success" text="正常" />
    }, {
      title: '权限值',
      key: 'role',
      dataIndex: 'role',
      sorter: (a, b) => a.role - b.role
    }, {
      title: '创建时间',
      key: 'create_at',
      dataIndex: 'create_at'
    }, {
      title: '操作',
      key: 'action',
      render: record => (
        <span>
          {user.role > 100 && (
            <span>
              <a href="javascript:;" className="text-error" onClick={() => this.handleDeleteUser(record)}>删除</a>
              <Divider type="vertical" />
            </span>
          )}
          <a href="javascript:;" className="text-default" onClick={() => this.handleStarUser(record)}>{ record.star ? '取消星标' : '设为星标'}</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="text-warn" onClick={() => this.handleLockUser(record)}>{ record.lock ? '取消锁定' : '锁定账户' }</a>
        </span>
      )
    }];

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
            pagination={{
              current: page,
              pageSize: size,
              total,
              onChange: this.handleChangePage
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
