/*
* 配置连接服务器参数
*/
const { server } = require('../config');

let baseUrl;

if (process.env.NODE_ENV === 'production') {
  baseUrl = server;
} else {
  baseUrl = 'http://localhost:3000/v1';
}

module.exports = {
  baseUrl
};
