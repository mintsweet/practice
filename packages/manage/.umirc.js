// ref: https://umijs.org/config/
export default {
  treeShaking: true,

  history: 'hash',

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
}
