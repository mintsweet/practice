import path from 'path';
import routes from './config/router';

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

  routes,
}
