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
    { name: '分享', url: 'share' },
    { name: '问答', url: 'ask' },
    { name: '招聘', url: 'offer' }
  ],
  
  // Spa
  spa_port: 3002
};

module.exports = config;
