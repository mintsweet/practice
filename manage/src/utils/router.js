import React from 'react';
import { Redirect } from 'react-router-dom';
import Dashboard from '@/routes/dashboard/Dashboard';
// 内容管理
import User from '@/routes/content/user';
import Topic from '@/routes/content/topic';
import Reply from '@/routes/content/reply';

const routerData = [
  {
    exact: true,
    path: '/',
    name: '首页',
    component: () => <Redirect to="/dashboard" />
  },
  {
    exact: true,
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    exact: true,
    path: '/content',
    name: '内容管理',
    component: () => <Redirect to="/content/user" />
  },
  {
    exact: true,
    path: '/content/user',
    name: '用户',
    component: User
  },
  {
    exact: true,
    path: '/content/topic',
    name: '话题',
    component: Topic
  },
  {
    exact: true,
    path: '/content/reply',
    name: '回复',
    component: Reply
  }
];

export default routerData;