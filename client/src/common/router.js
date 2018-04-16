import React from 'react';
import { Redirect } from 'react-router-dom';

import Home from '../routes/home';
import Genre from '../routes/genre';
import Add from '../routes/add';
import Mood from '../routes/mood';

const routerData = [
  {
    exact: true,
    path: '/',
    name: '首页',
    component: () => <Redirect to="/home" />
  },
  {
    exact: true,
    path: '/home',
    name: '首页',
    component: Home,
  },
  {
    exact: true,
    path: '/genre',
    name: '分类',
    component: Genre
  },
  {
    exact: true,
    path: '/add',
    name: '添加',
    component: Add
  },
  {
    exact: true,
    path: '/mood',
    name: '心情',
    component: Mood
  }
];

export default routerData;