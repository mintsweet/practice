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
      title: 'manage',
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
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: './user/login' },
        { path: '/user/forget_pass', component: './user/forget_pass' },
      ],
    },
    {
      path: '/',
      component: '../layouts/basic',
      Routes: ['src/pages/authorized'],
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: './index' },
        { path: '/content', redirect: '/content/topic' },
        { path: '/content/topic', component: './content/topic' },
        { path: '/content/user', component: './content/user' },
        { path: '/system', redirect: '/system/setting' },
        { path: '/system/setting', component: './system/setting' },
      ]
    },
  ]
}
