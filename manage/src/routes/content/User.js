import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Avatar, Tag, Badge, Divider } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';
import { getUserList } from '@/service/api';

@connect(
  ({}) => ({}),
  { changeLoadingAction }
)
export default class User extends Component {
  state = {
    data: []
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

  render() {
    const { data } = this.state;

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
      dataIndex: 'score'
    }, {
      title: '星标用户',
      render: record => record.star ? <Tag color="blue">是</Tag> : <Tag color="magenta">否</Tag>
    }, {
      title: '用户状态',
      render: record => record.delete ? <Badge status="error" text="已删除" /> : record.lock ? <Badge color="warning" text="已封号" /> : <Badge status="success" text="正常" />
    }, {
      title: '创建时间',
      render: record => <span>{record.create_at}</span>
    }, {
      title: '操作',
      render: record => (
        <span>
          <a href="javascript:;">编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;">删除</a>
          <Divider type="vertical" />
          <a href="javascript:;">{ record.star ? '取消星标' : '设为星标'}</a>
          <Divider type="vertical" />
          <a href="javascript:;">{ record.lock ? '取消锁定' : '锁定账户' }</a>
        </span>
      )
    }];

    const rowSelection = {
      onChange: this.onSelectTable
    };

    return (
      <PageLayout>
        <div className="page-content">
          <div className="table-action">
            <Button type="primary">新增</Button>
          </div>
          <Table
            rowKey="id"
            size="middle"
            dataSource={data}
            columns={columns}
            rowSelection={rowSelection}
          />
        </div>
      </PageLayout>
    );
  }
}