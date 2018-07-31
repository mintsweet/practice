import React from 'react';
import { Redirect } from 'react-router-dom';
import Dashboard from '../routes/dashboard/Dashboard';

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
  }
];

export default routerData;