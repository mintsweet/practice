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

// 获取主题列表
exports.getTopicLIst = obj => request('/topics', obj)
