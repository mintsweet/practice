import {
  DashboardOutlined,
  UserOutlined,
  ProfileOutlined,
  TagsOutlined,
} from '@ant-design/icons';

const routes = [
  {
    path: '/login',
    title: '登录',
    hidden: true,
  },
  {
    path: '/',
    title: '首页',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    title: '数据概览',
    icon: <DashboardOutlined />,
  },
  {
    path: '/user',
    title: '用户管理',
    icon: <UserOutlined />,
  },
  {
    path: '/topic',
    title: '话题管理',
    icon: <ProfileOutlined />,
  },
  {
    path: '/reply',
    title: '回复管理',
    icon: <TagsOutlined />,
  },
];

export default routes;
