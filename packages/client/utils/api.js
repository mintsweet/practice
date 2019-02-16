const request = require('./request');

// 获取图片验证码
const getCaptcha = params => request('/aider/captcha', params);

// 注册
const signup = params => request('/signup', params, 'POST');

// 登录
const signin = params => request('/signin', params, 'POST');

// 获取积分榜用户列表
const getUsersTop = params => request('/users/top', params);

// 根据ID获取用户信息
const getUserById = uid => request(`/user/${uid}`);

// 获取用户动态
const getUserAction = uid => request(`/user/${uid}/action`);

module.exports = {
  getCaptcha,
  signup,
  signin,
  getUsersTop,
  getUserById,
  getUserAction
};
