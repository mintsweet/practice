const router = [
  {
    path: '/',
    Routes: ['src/pages/authorized'],
    exact: true,
    title: '首页',
    redirect: '/dashboard'
  },
  {
    path: '/user',
    component: '../layouts/user',
    hidden: true,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        component: './user/login',
        title: '登录',
      },
      {
        path: '/user/forget_pass',
        component: './user/forget_pass',
        title: '忘记密码',
      },
    ],
  },

  {
    path: '/dashboard',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '数据概览',
    routes: [
      {
        path: '/dashboard',
        component: './dashboard/index',
        title: '数据概览',
        icon: 'dashboard',
      },
    ]
  },
  {
    path: '/content',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '内容管理',
    icon: 'profile',
    routes: [
      {
        path: '/content',
        title: '内容管理',
        redirect: '/content/topics',
      },
      {
        path: '/content/topics',
        component: './content/topics.tsx',
        title: '话题',
      },
      {
        path: '/content/users',
        component: './content/users.tsx',
        title: '用户',
      },
    ]
  },
  {
    path: '/system',
    component: '../layouts/basic',
    Routes: ['src/pages/authorized'],
    title: '系统管理',
    icon: 'tool',
    routes: [
      {
        path: '/system',
        title: '系统管理',
        redirect: '/system/setting',
      },
      {
        path: '/system/setting',
        component: './system/setting',
        title: '设置',
      }
    ]
  }
];

export default router;
