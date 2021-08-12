import { useRef } from 'react';
import { Popconfirm, Button, message } from 'antd';
import moment from 'moment';
import BasicLayout from '@/components/BasicLayout';
import SearchTable from '@/components/SearchTable';
import Authorized from '@/components/Authorized';
import * as Service from './service';

export default function Reply() {
  const table = useRef<any>(null);

  const handleDelete = async (id: string) => {
    await Service.deleteReply(id);
    message.success('删除回复成功');
    if (table.current) table.current.loadData();
  };

  const columns = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      key: 'author_name',
      align: 'center' as 'center',
    },
    {
      title: '回复话题',
      dataIndex: 'topic_title',
      key: 'topic_title',
      align: 'center' as 'center',
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
      render: (val: string) => (
        <Authorized role={100}>
          <Popconfirm
            title="确定要删除这条评论吗?"
            onConfirm={() => handleDelete(val)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Authorized>
      ),
    },
  ];

  return (
    <BasicLayout>
      <SearchTable
        tableQueryURL="/backend/replys"
        tableColumns={columns}
        ref={table}
      />
    </BasicLayout>
  );
}
