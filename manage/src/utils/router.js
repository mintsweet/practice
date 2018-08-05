import React from 'react';
import { Redirect } from 'react-router-dom';
import Dashboard from '@/routes/dashboard/Dashboard';
// 内容管理
import User from '@/routes/content/user';
import Topic from '@/routes/content/topic';

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
  }
];

export default routerData;