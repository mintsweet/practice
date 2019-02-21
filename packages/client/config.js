module.exports = {

  name: 'Mints - 薄荷糖社区',
  description: '简洁、快乐的交流社区',
  keywords: 'mints, community',
  author: '青湛(github/mintsweet)',

  site_icon: '/static/img/favicon.ico',

  port: 3001,

  // 接口地址
  api: {
    development: 'http://localhost:3000/v1',
    production: '',
    test: 'https://jsonplaceholder.typicode.com'
  },

  tabs: [
    {
      name: '分享',
      tag: 'share'
    },
    {
      name: '问答',
      tag: 'ask'
    },
    {
      name: '招聘',
      tag: 'job'
    }
  ],

  home_topic_count: 20,
};
