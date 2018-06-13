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

// Markdown演示
exports.getMarkdownData = () => request('/static/markdown_style');

// 获取当前用户信息
exports.getCurrentUser = () => request('/info');

// 请求图形验证码
exports.getPicCaptcha = () => request('/common/piccaptcha');

// 请求手机验证码
exports.getMsgCaptcha = mobile => request('/common/msgcaptcha');

// 登录
exports.apiSignin = obj => request('/signin', obj, 'POST');

// 登出
exports.apiSignout = () => request('/signout');
