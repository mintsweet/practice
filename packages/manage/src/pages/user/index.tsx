import * as React from 'react';
import { connect } from 'dva';
import { Table, Avatar, Tag, Badge, Divider, message, Card, Button, Modal } from 'antd';
import CreateModal from './components/Modal';

interface Props {
  user: any;
  data: [];
  page: number;
  size: number;
  total: number;
  dispatch: ({}) => void;
};

@connect(({ app, user }) => ({
  user: app.user,
  data: user.list,
  page: user.page,
  size: user.size,
  total: user.total,
}))
export default class User extends React.Component<Props> {
  state = {
    visible: false,
  };

  // 切换页码
  handleChangePage = page => {
    this.props.dispatch({
      type: 'users/fetch',
      payload: {
        page,
      },
    });
  }

  // 校验各个动作的权限
  validAction = record => {
    const { user } = this.props;

    if (user.id === record.id) {
      message.error('不能操作自身');
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
        onOk: () => {
          this.props.dispatch({
            type: 'users/delete',
            payload: {
              id: record.id
            },
          });
        },
      });
    }
  }

  // 改变用户星标状态
  handleStarUser = record => {
    if (this.validAction(record)) {
      this.props.dispatch({
        type: 'users/star',
        payload: {
          id: record.id,
        },
      });

      message.success(record.star ? '取消星标用户成功' : '设为星标用户成功');
    }
  }

  // 改变用户锁定
  handleLockUser = record => {
    if (this.validAction(record)) {
      this.props.dispatch({
        type: 'users/lock',
        payload: {
          id: record.id,
        },
      });

      message.success(record.lock ? '取消锁定用户成功' : '锁定用户成功');
    }
  }

  // 控制弹窗显示隐藏
  handleToggleModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  // 创建用户
  handleSubmit = (values) => {
    this.props.dispatch({
      type: 'users/create',
      payload: values
    });

    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;
    const { user, data, page, size, total } = this.props;

    const columns = [
      {
        title: '头像',
        key: 'avatar',
        render: record => <Avatar src={record.avatar} size="small" />
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
      },
      {
        title: '昵称',
        key: 'nickname',
        dataIndex: 'nickname'
      },
      {
        title: '积分',
        key: 'score',
        dataIndex: 'score',
        sorter: (a, b) => a.score - b.score
      },
      {
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
      },
      {
        title: '用户状态',
        key: 'status',
        render: record => record.delete ? <Badge status="error" text="已注销" /> : record.lock ? <Badge status="warning" text="已锁定" /> : <Badge status="success" text="正常" />
      },
      {
        title: '权限值',
        key: 'role',
        dataIndex: 'role',
        sorter: (a, b) => a.role - b.role
      },
      {
        title: '创建时间',
        key: 'create_at',
        dataIndex: 'create_at'
      },
      {
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
            <a href="javascript:;" className="text-default" onClick={() => this.handleStarUser(record)}>{record.star ? '取消星标' : '设为星标'}</a>
            <Divider type="vertical" />
            <a href="javascript:;" className="text-warn" onClick={() => this.handleLockUser(record)}>{record.lock ? '取消锁定' : '锁定账户'}</a>
          </span>
        )
      },
    ];

    return (
      <Card>
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
          handleToggleModal={this.handleToggleModal}
          handleSubmit={this.handleSubmit}
        />
      </Card>
    );
  }
}
