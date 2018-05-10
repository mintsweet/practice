/*
* 配置
*/
const path = require('path');

const config = {
  debug: true,

  name: 'Mints',
  description: 'Mints - 薄荷糖社区',
  keywords: 'node, connect',
  author: '青湛(github/mintsweet)',

  // 运行端口
  port: 3001,

  // 日志
  log_dir: path.join(__dirname, 'logs'),

  
};

module.exports = config;