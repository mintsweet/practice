import * as React from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Tag, Badge, Modal } from 'antd';
import PageLoding from '../../components/PageLoding';

interface Props {
  user: any,
  loading: boolean;
  data: [];
  page: number;
  size: number;
  total: number;
  dispatch: ({}) => void;
};

@connect(({ app, topics }) => ({
  user: app.user,
  loading: app.loading,
  data: topics.list,
  page: topics.page,
  size: topics.size,
  total: topics.total,
}))
export default class Topic extends React.Component<Props> {
  // 切换页码
  handleChangePage = page => {
    this.props.dispatch({
      type: 'topics/fetch',
      payload: {
        page
      }
    });
  }

  handleDeleteTopic = id => {
    Modal.confirm({
      title: '确定物理删除这条数据吗?',
      content: '直接从数据库中删除数据是无法恢复的，请慎重考虑以后在进行操作！',
      onOk: () => {
        this.props.dispatch({
          type: 'topics/delete',
          payload: {
            id
          },
        });
      },
    });
  }

  handleTopTopic = id => {
    this.props.dispatch({
      type: 'topics/top',
      payload: {
        id
      },
    });
  }

  handleGoodTopic = id => {
    this.props.dispatch({
      type: 'topics/good',
      payload: {
        id
      },
    });
  }

  handleLockTopic = id => {
    this.props.dispatch({
      type: 'topics/lock',
      payload: {
        id
      },
    });
  }

  render() {
    const { user, loading, data, page, size, total } = this.props;

    const columns = [
      {
        title: '标题',
        key: 'title',
        dataIndex: 'title'
      },
      {
        title: '类型',
        key: 'tabName',
        dataIndex: 'tabName'
      },
      {
        title: '置顶',
        key: 'top',
        dataIndex: 'top',
        filters: [
          {
            text: '是',
            value: 'yes',
          },
          {
            text: '否',
            value: 'no',
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => value === 'yes' ? record.top : !record.top,
        render: top => top ? <Tag color="blue">是</Tag> : <Tag color="magenta">否</Tag>
      },
      {
        title: '精华',
        key: 'good',
        dataIndex: 'good',
        filters: [
          {
            text: '是',
            value: 'yes',
          },
          {
            text: '否',
            value: 'no',
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => value === 'yes' ? record.good : !record.good,
        render: good => good ? <Tag color="blue">是</Tag> : <Tag color="magenta">否</Tag>
      },
      {
        title: '点赞数',
        key: 'like_count',
        dataIndex: 'like_count',
        sorter: (a, b) => a.like_count - b.like_count
      },
      {
        title: '收藏数',
        key: 'collect_count',
        dataIndex: 'collect_count',
        sorter: (a, b) => a.collect_count - b.collect_count
      },
      {
        title: '回复数',
        key: 'reply_count',
        dataIndex: 'reply_count',
        sorter: (a, b) => a.reply_count - b.reply_count
      },
      {
        title: '访问数',
        key: 'visit_count',
        dataIndex: 'visit_count',
        sorter: (a, b) => a.visit_count - b.visit_count
      },
      {
        title: '状态',
        key: 'status',
        render: record => record.delete ? <Badge status="error" text="已删除" /> : record.lock ? <Badge status="warning" text="已锁定" /> : <Badge status="success" text="正常" />
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
          <>
            {user.role > 100 && (
              <>
                <a href="javascript:;" className="text-error" onClick={() => this.handleDeleteTopic(record.id)}>删除</a>
                <Divider type="vertical" />
              </>
            )}
            <a href="javascript:;" className="text-default" onClick={() => this.handleTopTopic(record.id)}>{record.top ? '取消置顶' : '设为置顶'}</a>
            <Divider type="vertical" />
            <a href="javascript:;" className="text-default" onClick={() => this.handleGoodTopic(record.id)}>{record.good ? '取消精华' : '设为精华'}</a>
            <Divider type="vertical" />
            <a href="javascript:;" className="text-warn" onClick={() => this.handleLockTopic(record.id)}>{record.lock ? '取消锁定' : '话题锁定'}</a>
        </>
      )
    }];;

    return (
      <PageLoding loading={loading}>
        <Card>
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
        </Card>
      </PageLoding>
    );
  }
}
