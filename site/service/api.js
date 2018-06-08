const rq = require('request-promise');
const { baseUrl } = require('./env');

const request = (url, data, method = 'GET') => {
  const uri = baseUrl + url;
  return rq({
    method,
    uri,
    json: true,
    jar: true,
    body: data
  });
};

// // 获取用户Top100
// exports.apiGetUserTop100 = () => request('/users/top100');

// // 登录
// exports.apiSignin = obj => request('/signin');

// // 获取当前用户信息
// exports.apiGetUserInfo = () => request('/info');

// 获取主题列表
exports.getTopicLIst = obj => request('/topics', obj)
