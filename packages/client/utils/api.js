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

// 获取用户专栏列表
const getUserCreate = uid => request(`/user/${uid}/create`);

// 获取用户喜欢列表
const getUserLike = uid => request(`/user/${uid}/like`);

// 获取用户收藏列表
const getUserCollect = uid => request(`/user/${uid}/collect`);

// 获取用户粉丝列表
const getUserFollower = uid => request(`/user/${uid}/follower`);

// 获取用户关注列表
const getUserFollowing = uid => request(`/user/${uid}/following`);

module.exports = {
  getCaptcha,
  signup,
  signin,
  getUsersTop,
  getUserById,
  getUserAction,
  getUserCreate,
  getUserLike,
  getUserCollect,
  getUserFollower,
  getUserFollowing,
};
