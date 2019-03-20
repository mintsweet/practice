// ref: https://umijs.org/config/
export default {
  treeShaking: true,

  history: 'hash',

  theme: {
    '@primary-color': '#52c41a'
  },

  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '/api': ''
      },
    },
  },

  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: {
        defaultTitle: '薄荷糖社区(Mints)',
        format: '{current}{separator}{parent}'
      },
      dll: true,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],

  extraBabelPlugins: [
    ['import', {
      libraryName: "antd",
      style: true
    }],
  ],

  routes: [
    {
      path: '/user',
      component: '../layouts/user',
      title: '薄荷糖社区(Mints)',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: './user/login', title: '登录' },
        { path: '/user/forget_pass', component: './user/forget_pass', title: '忘记密码' },
      ],
    },
    {
      path: '/',
      component: '../layouts/basic',
      Routes: ['src/pages/authorized'],
      title: '薄荷糖社区(Mints)',
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: './dashboard/index', title: '首页' },
        { path: '/content', redirect: '/content/topics' },
        { path: '/content/topics', component: './content/topics', title: '话题管理' },
        { path: '/content/users', component: './content/users', title: '用户管理' },
        { path: '/system', redirect: '/system/setting' },
        { path: '/system/setting', component: './system/setting', title: '系统设置' },
      ]
    },
  ]
}
