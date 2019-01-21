const request = require('./request');

// 获取图片验证码
const getCaptcha = () => request('/aider/captcha');

// 注册
const signup = params => request('/signup', params, 'POST');

// 登录
const signin = params => request('/signin', params, 'POST');

module.exports = {
  getCaptcha,
  signup,
  signin
};
