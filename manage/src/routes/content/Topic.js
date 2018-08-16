import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Divider, Modal, message } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';
import { getTopicList, deleteTopic, topOrUnTopic, goodOrUnTopic, lockOrUnTopic } from '@/service/api';

@connect(
  ({ user }) => ({
    user
  }),
  { changeLoadingAction }
)
export default class Topic extends Component {
  state = {
    data: [],
    page: 1,
    size: 10,
    total: 0
  };

  componentDidMount() {
    this.getData();
  }

  getData = async page => {
    const data = await getTopicList({ page: page || this.state.page, size: this.state.size });
    this.setState({
      data: data.topics,
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

  // 话题删除
  handleDeleteTopic = id => {
    Modal.confirm({
      title: '确定物理删除这条数据吗?',
      content: '直接从数据库中删除数据是无法恢复的，请慎重考虑以后在进行操作！',
      onOk: async () => {
        await deleteTopic(id)
        message.success('删除话题成功');
        this.getData();
      }
    });
  }

  // 话题置顶
  handleTopTopic = async id => {
    const action = await topOrUnTopic(id);
    if (action.indexOf('un') === 0) {
      message.success('取消置顶话题');
    } else {
      message.success('设为置顶话题');
    }
    this.getData();
  }

  // 话题精华
  handleGoodTopic = async id => {
    const action = await goodOrUnTopic(id);
    if (action.indexOf('un') === 0) {
      message.success('取消精华话题');
    } else {
      message.success('设为精华话题');
    }
    this.getData();
  }

  // 话题锁定
  handleLockTopic = async id => {
    const action = await lockOrUnTopic(id);
    if (action.indexOf('un') === 0) {
      message.success('取消锁定话题');
    } else {
      message.success('设为本条话题');
    }
    this.getData();
  }

  render() {
    const { data, page, size, total } = this.state;
    const { user } = this.props;

    const columns = [{
      title: '标题',
      key: 'title',
      dataIndex: 'title'
    }, {
      title: '操作',
      key: 'action',
      render: record => (
        <span>
          {user.role > 100 && (
            <span>
              <a href="javascript:;" className="text-error" onClick={() => this.handleDeleteTopic(record.id)}>删除</a>
              <Divider type="vertical" />
            </span>
          )}
          <a href="javascript:;" className="text-default" onClick={() => this.handleTopTopic(record.id)}>{record.top ? '取消置顶' : '设为置顶'}</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="text-default" onClick={() => this.handleGoodTopic(record.id)}>{record.good ? '取消精华' : '设为精华'}</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="text-warn" onClick={() => this.handleLockTopic(record.id)}>{record.lock ? '取消锁定' : '话题锁定'}</a>
        </span>
      )
    }];

    return (
      <PageLayout>
        <div className="page-content">
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
        </div>
      </PageLayout>
    );
  }
}