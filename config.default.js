/*
* 配置
*/
const path = require('path');

const config = {
  debug: true,

  // Site base
  name: 'Mints - 薄荷糖社区',
  description: '',
  keywords: 'mints, community',
  author: '青湛(github/mintsweet)',

  site_icon: '/static/favicon.ico',

  // Server
  server_port: 3000,
  
  db: 'mongodb://localhost/practice',

  log_dir: path.join(__dirname, './server/logs'),

  session_secret: 'practice_secret', // 务必修改
  auth_cookie_name: 'practice',

  // Site
  site_port: 3001,

  tabs: [
    { name: '问答', path: 'ask' },
    {
      name: '技术',
      path: 'tech',
      children: [
        { name: '前端', path: 'frontend' },
        { name: '程序员', path: 'programmer' }
      ]
    },
    {
      name: '城市',
      path: 'city',
      children: [
        { name: '北京', path: 'beijing' },
        { name: '上海', path: 'shanghai' },
        { name: '广州', path: 'guangzhou' },
        { name: '深圳', path: 'shenzhou' },
        { name: '杭州', path: 'hangzhou' },
        { name: '成都', path: 'chengdu' },
        { name: '南京', path: 'nanjing' },
        { name: '武汉', path: 'wuhan' },
        { name: '重庆', path: 'chongqing' },
        { name: '西安', path: 'xian' }
      ]
    }
  ],

  menus: [
    { name: '首页', url: '/' },
    { name: '新手入门', url: '/get_start' },
    { name: 'API说明', url: '/api_introduction' },
    { name: '关于', url: '/about' }
  ],

  // Client Mobile
  
};

module.exports = config;
