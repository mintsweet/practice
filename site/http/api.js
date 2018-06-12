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

// 快速开始
exports.getStartData = () => request('/static/get_start');

// API说明
exports.getApiData = () => request('/static/api_introduction');

// 关于
exports.getAboutData = () => request('/static/about');
