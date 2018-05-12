/*
* 配置
*/
const path = require('path');

const config = {
  debug: true,

  name: 'Mints - 薄荷糖社区',
  description: '',
  keywords: 'mints, community',
  author: '青湛(github/mintsweet)',

  site_icon: '/static/favicon.ico',

  // 运行端口
  port: 3001,
  hostname: 'localhost',

  // 日志
  log_dir: path.join(__dirname, '../logs'),
  
};

module.exports = config;