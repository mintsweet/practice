import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Switch, Badge, Button, Divider, Popconfirm, Tag, message } from 'antd';
import moment from 'moment';
import BasicLayout from '@/components/BasicLayout';
import SearchTable from '@/components/SearchTable';
import Authorized from '@/components/Authorized';
import { TabMap } from '@/common/constant';
import * as Service from './service';

export default function Topic() {
  const history = useHistory();
  const table = useRef<any>(null);

  // 话题删除
  const handleDelete = async (id: string) => {
    await Service.deleteTopic(id);
    message.success('删除话题成功');
    if (table && table.current) table.current.loadData();
  };

  // 话题锁定
  const handleSetLock = async (id: string, checked: boolean) => {
    await Service.setTopicLock(id);
    message.success(`${checked ? '解锁' : '锁定'}话题成功`);
    if (table && table.current) table.current.loadData();
  };

  // 话题置顶
  const handleSetTop = async (id: string, checked: boolean) => {
    await Service.setTopicTop(id);
    message.success(`${checked ? '置顶' : '取消置顶'}话题成功`);
    if (table && table.current) table.current.loadData();
  };

  // 话题加精
  const handleSetGood = async (id: string, checked: boolean) => {
    await Service.setTopicGood(id);
    message.success(`${checked ? '加精' : '取消加精'}话题成功`);
    if (table && table.current) table.current.loadData();
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'tab',
      key: 'tab',
      align: 'center' as 'center',
      render: (val: string) => TabMap[val].label || val,
    },
    {
      title: '是否置顶',
      dataIndex: 'is_top',
      key: 'is_top',
      align: 'center' as 'center',
      render: (val: boolean, row: any) => (
        <Authorized
          role={100}
          noAuth={
            val ? <Tag color="green">是</Tag> : <Tag color="error">否</Tag>
          }
        >
          <Switch
            checked={val}
            onChange={(checked: boolean) => handleSetTop(row._id, checked)}
          />
        </Authorized>
      ),
    },
    {
      title: '是否精华',
      dataIndex: 'is_good',
      key: 'is_good',
      align: 'center' as 'center',
      render: (val: boolean, row: any) => (
        <Switch
          checked={val}
          onChange={(checked: boolean) => handleSetGood(row._id, checked)}
        />
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
      align: 'center' as 'center',
    },
    {
      title: '收藏数',
      dataIndex: 'collect_count',
      key: 'collect_count',
      align: 'center' as 'center',
    },
    {
      title: '回复数',
      dataIndex: 'reply_count',
      key: 'reply_count',
      align: 'center' as 'center',
    },
    {
      title: '访问数',
      dataIndex: 'visit_count',
      key: 'visit_count',
      align: 'center' as 'center',
    },
    {
      title: '状态',
      key: 'status',
      align: 'center' as 'center',
      render: (_: any, row: any) =>
        row.is_delete ? (
          <Badge status="error" text="已删除" />
        ) : row.is_lock ? (
          <Badge status="warning" text="已锁定" />
        ) : (
          <Badge status="success" text="正常" />
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center' as 'center',
      render: (val: any) => moment(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operate',
      align: 'center' as 'center',
      render: (val: any, row: any) => (
        <>
          <Button
            type="link"
            style={{ color: '#1890ff' }}
            onClick={() => history.push(`/topic/detail?id=${val}`)}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Authorized role={100}>
            <>
              <Popconfirm
                title="确定要删除这个话题吗?此操作不可逆, 请三思!"
                onConfirm={() => handleDelete(val)}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          </Authorized>
          <Popconfirm
            title="确定要修改此话题吗?"
            onConfirm={() => handleSetLock(val, row.is_lock)}
          >
            <Button type="link" danger>
              {row.is_lock ? '取消锁定' : '锁定话题'}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <BasicLayout>
      <SearchTable
        tableQueryURL="/backend/topics"
        tableColumns={columns}
        ref={table}
      >
        <Button
          type="primary"
          style={{ marginTop: 24 }}
          onClick={() => history.push('/topic/detail')}
        >
          创建
        </Button>
      </SearchTable>
    </BasicLayout>
  );
}
