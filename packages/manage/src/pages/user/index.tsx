import { useState, useRef } from 'react';
import {
  Tag,
  Badge,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import BasicLayout from '@/components/BasicLayout';
import SearchTable, { QueryFormItem } from '@/components/SearchTable';
import FormModal, { FormModalItem } from '@/components/FormModal';
import Authorized from '@/components/Authorized';
import * as Service from '@/service/api';

const { RangePicker } = DatePicker;
const { Password } = Input;

const queryFormConfig: QueryFormItem[] = [
  {
    label: '邮箱',
    name: 'email',
    component: <Input />,
  },
  {
    label: '昵称',
    name: 'nickname',
    component: <Input />,
  },
  {
    label: '创建时间',
    name: 'created_at',
    component: (
      <RangePicker
        showTime={{
          defaultValue: [moment().startOf('day'), moment().endOf('day')],
        }}
        style={{ width: 'initial' }}
      />
    ),
  },
];

export default function User() {
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [initData, setInitData] = useState({
    _id: '',
    email: '',
    nickname: '',
    role: 0,
  });
  const table = useRef<any>(null);

  const handleCancel = () => setVisible(false);

  const handleSubmit = async (values: any) => {
    if (modalType === 'create') {
      await Service.createUser(values);
      message.success('创建用户成功');
    } else {
      await Service.updateUser(initData._id, values);
      message.success('更新用户成功');
    }

    handleCancel();
    if (table && table.current) table.current.loadData();
  };

  // 用户创建
  const handleCreate = () => {
    setVisible(true);
    setModalType('create');
    setInitData({ _id: '', email: '', nickname: '', role: 0 });
  };

  // 用户更新
  const handleUpdate = (row: any) => {
    setVisible(true);
    setModalType('update');
    setInitData(row);
  };

  // 用户删除
  const handleDelete = async (uid: string) => {
    await Service.deleteUser(uid);
    message.success('删除用户成功');
    if (table && table.current) table.current.loadData();
  };

  // 设为星标用户
  const handleSetStar = async (uid: string) => {
    const res = await Service.setStarUser(uid);
    message.success(`${res.includes('un') ? '取消' : '设定'}星标成功`);
    if (table && table.current) table.current.loadData();
  };

  // 锁定用户(封号)
  const handleSetLock = async (uid: string) => {
    const res = await Service.setLockUser(uid);
    message.success(`${res.includes('un') ? '解锁' : '锁定'}用户成功`);
    if (table && table.current) table.current.loadData();
  };

  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center' as 'center',
    },
    {
      title: '积分',
      dataIndex: 'score',
      key: 'score',
      align: 'center' as 'center',
    },
    {
      title: '星标用户',
      dataIndex: 'is_star',
      key: 'is_star',
      align: 'center' as 'center',
      render: (val: boolean) =>
        val ? <Tag color="blue">是</Tag> : <Tag color="magenta">否</Tag>,
    },
    {
      title: '用户状态',
      key: 'status',
      align: 'center' as 'center',
      render: (_: any, row: any) =>
        row.is_delete ? (
          <Badge status="error" text="已注销" />
        ) : row.is_lock ? (
          <Badge status="warning" text="已锁定" />
        ) : (
          <Badge status="success" text="正常" />
        ),
    },
    {
      title: '权限值',
      dataIndex: 'role',
      key: 'role',
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
      key: '_id',
      align: 'center' as 'center',
      render: (_id: string, row: any) => (
        <>
          <Button
            type="link"
            style={{ color: '#1890ff' }}
            onClick={() => handleUpdate(row)}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Authorized role={100}>
            <>
              <Popconfirm
                title="确定要删除这个用户吗?此操作不可逆, 请三思!"
                onConfirm={() => handleDelete(row._id)}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          </Authorized>
          <Authorized role={100}>
            <>
              <Popconfirm
                title="确认要修改此用户吗?"
                onConfirm={() => handleSetStar(row._id)}
              >
                <Button type="link" style={{ color: '#1890ff' }}>
                  {row.is_star ? '取消星标' : '设为星标'}
                </Button>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          </Authorized>
          <Popconfirm
            title="确定要修改此用户吗?"
            onConfirm={() => handleSetLock(row._id)}
          >
            <Button type="link" danger>
              {row.is_lock ? '取消锁定' : '锁定账户'}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const form: FormModalItem[] = [
    {
      label: '邮箱',
      name: 'email',
      initialValue: initData.email,
      component: <Input placeholder="请输入邮箱" />,
      rules: [
        { required: true, message: '请输入邮箱' },
        {
          pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
          message: '请输入正确的邮箱',
        },
      ],
    },
    modalType === 'create' && {
      label: '密码',
      name: 'password',
      component: <Password placeholder="请输入密码" />,
      rules: [
        {
          required: true,
          message: '密码不能为空',
        },
        {
          pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/,
          message:
            '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间',
        },
      ],
    },
    {
      label: '昵称',
      name: 'nickname',
      initialValue: initData.nickname,
      component: <Input placeholder="请输入昵称" />,
      rules: [
        {
          required: true,
          message: '昵称不能为空',
        },
        {
          pattern: /^[\u4e00-\u9fa5\w]{2,10}$/,
          message: '昵称必须在2至10位之间',
        },
      ],
    },
    {
      label: '权限值',
      name: 'role',
      initialValue: initData.role,
      component: (
        <InputNumber
          min={0}
          max={99}
          style={{ width: '100%' }}
          placeholder="请输入权限值"
        />
      ),
      rules: [
        {
          required: true,
          message: '权限值不能为空',
        },
      ],
    },
  ].filter(Boolean) as FormModalItem[];

  return (
    <BasicLayout>
      <SearchTable
        tableQueryURL="/backend/users"
        tableColumns={columns}
        queryFormConfig={queryFormConfig}
        ref={table}
      >
        <Button type="primary" style={{ marginTop: 24 }} onClick={handleCreate}>
          创建
        </Button>
      </SearchTable>
      <FormModal
        title={modalType === 'create' ? '创建用户' : '更新用户'}
        visible={visible}
        formConfig={form}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </BasicLayout>
  );
}
