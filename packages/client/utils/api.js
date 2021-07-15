const rq = require('request-promise');
const { API } = require('../../../config');

const http = async (url, params = {}) => {
  const { data = {}, method = 'GET', token = '' } = params;

  const options = {
    baseUrl: API,
    url,
    method,
    json: true,
    headers: {
      Authorization: token,
    },
  };

  if (method === 'GET') {
    options.qs = data;
  } else {
    options.body = data;
  }

  try {
    return await rq(options);
  } catch (err) {
    throw err;
  }
};

// 获取图形验证码
exports.getCaptcha = data => http('/captcha', { data });

// 上传文件
exports.upload = data => http('/upload', { data, method: 'POST' });

// 获取文件
exports.getFile = filename => http(`/upload/${filename}`);

// 注册
exports.signup = data => http('/signup', { data, method: 'POST' });

// 登录
exports.signin = data => http('/signin', { data, method: 'POST' });

// 忘记密码
exports.forgetPass = data => http('/forget-pass', { data, method: 'POST' });

// 重置密码
exports.resetPass = data => http('/reset-pass', { data, method: 'POST' });

// 获取当前用户信息
exports.getCurrentUser = token => http('/info', { token });

// 更新个人信息
exports.updateSetting = (data, token) =>
  http('/setting', { data, method: 'PUT', token });

// 修改密码
exports.updatePass = (data, token) =>
  http('/password', { data, method: 'PUT', token });

// 获取用户消息
exports.getNoticeUser = token => http('/notice/user', { token });

// 获取系统消息
exports.getNoticeSystem = token => http('/notice/system', { token });

// 获取积分榜用户列表
exports.getUsersTop = data => http('/users/top', { data });

// 根据ID获取用户信息
exports.getUserById = uid => http(`/user/${uid}`);

// 获取用户动态
exports.getUserAction = uid => http(`/user/${uid}/action`);

// 获取用户专栏列表
exports.getUserCreate = uid => http(`/user/${uid}/create`);

// 获取用户喜欢列表
exports.getUserLike = uid => http(`/user/${uid}/like`);

// 获取用户收藏列表
exports.getUserCollect = uid => http(`/user/${uid}/collect`);

// 获取用户粉丝列表
exports.getUserFollower = uid => http(`/user/${uid}/follower`);

// 获取用户关注列表
exports.getUserFollowing = uid => http(`/user/${uid}/following`);

// 关注或者取消关注用户
exports.followUser = (uid, token) =>
  http(`/user/${uid}/follow`, { method: 'PUT', token });

// 获取话题列表
exports.getTopics = data => http('/topics', { data });

// 搜索话题列表
exports.searchTopics = data => http('/topics/search', { data });

// 获取无人回复的话题
exports.getTopicsNoReply = data => http('/topics/no-reply', { data });

// 创建话题
exports.createTopic = (data, token) =>
  http('/topic', { data, method: 'POST', token });

// 删除话题
exports.deleteTopic = (tid, token) =>
  http(`/topic/${tid}`, { method: 'DELETE', token });

// 更新话题
exports.updateTopic = (tid, data, token) =>
  http(`/topic/${tid}`, { data, method: 'PUT', token });

// 根据ID获取话题详情
exports.getTopicById = tid => http(`/topic/${tid}`);

// 喜欢或者取消喜欢话题
exports.likeTopic = (tid, token) =>
  http(`/topic/${tid}/like`, { method: 'PUT', token });

// 收藏或者取消收藏话题
exports.collectTopic = (tid, token) =>
  http(`/topic/${tid}/collect`, { method: 'PUT', token });

// 创建回复
exports.createReply = (tid, data, token) =>
  http(`/topic/${tid}/reply`, { data, method: 'POST', token });

// 点赞回复
exports.upReply = (rid, token) =>
  http(`/reply/${rid}/up`, { method: 'PUT', token });
