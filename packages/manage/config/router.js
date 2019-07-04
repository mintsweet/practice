module.exports = [
  {
    path: '/login',
    component: './login',
    title: '登录',
    hidden: true,
  },
  {
    path: '/',
    Routes: ['src/pages/authorized'],
    exact: true,
    title: '首页',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '数据概览',
    routes: [
      {
        path: '/dashboard',
        component: './dashboard',
        title: '数据概览',
        icon: 'dashboard',
      },
    ]
  },
  {
    path: '/topic',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '话题管理',
    routes: [
      {
        path: '/topic',
        component: './topic',
        title: '话题管理',
        icon: 'profile',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '用户管理',
    routes: [
      {
        path: '/user',
        component: './user',
        title: '用户管理',
        icon: 'user',
      },
    ],
  },
];
