const request = require('./request');

// 获取图片验证码
const getCaptcha = params => request('/aider/captcha', params);

// 注册
const signup = params => request('/signup', params, 'POST');

// 登录
const signin = params => request('/signin', params, 'POST');

// 获取积分榜用户列表
const getUsersTop = params => request('/users/top', params);

module.exports = {
  getCaptcha,
  signup,
  signin,
  getUsersTop
};
