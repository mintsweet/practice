import {
  DashboardOutlined,
  ProfileOutlined,
  UserOutlined,
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
    path: '/topic',
    title: '话题管理',
    icon: <ProfileOutlined />,
  },
  {
    path: '/user',
    title: '用户管理',
    icon: <UserOutlined />,
  },
];

export default routes;
