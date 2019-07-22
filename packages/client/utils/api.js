const rq = require('request-promise');
const { API } = require('../../../config');

const http = async (url, data, method = 'GET', token = '') => {
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
    const res = await rq(options);
    return res;
  } catch(err) {
    throw new Error(err);
  }
};

// 获取验证码
exports.getCaptcha = params => http('/captcha', params);

// GitHub 登录
exports.github = params => http('/github', params, 'POST');

// 注册
exports.signup = params => http('/signup', params, 'POST');

// 登录
exports.signin = params => http('/signin', params, 'POST');

// 头像上传
exports.uploadAvatar = params => http('/upload_avatar', params);

// 账户激活
exports.setActive = params => http('/set_active', params);

// 忘记密码
exports.forgetPass = params => http('/forget_pass', params, 'POST');

// 重置密码
exports.resetPass = params => http('/reset_pass', params, 'POST');

// 获取当前用户信息
exports.getCurrentUser = token => http('/info', {}, 'GET', token);

// 更新个人信息
exports.updateSetting = (params, token) => http('/setting', params, 'PUT', token);

// 修改密码
exports.updatePass = (params, token) => http('/update_pass', params, 'PATCH', token);

// 获取积分榜用户列表
exports.getUsersTop = params => http('/v1/users/top', params);

// 根据ID获取用户信息
exports.getUserById = uid => http(`/v1/user/${uid}`);

// 获取用户动态
exports.getUserAction = uid => http(`/v1/user/${uid}/action`);

// 获取用户专栏列表
exports.getUserCreate = uid => http(`/v1/user/${uid}/create`);

// 获取用户喜欢列表
exports.getUserLike = uid => http(`/v1/user/${uid}/like`);

// 获取用户收藏列表
exports.getUserCollect = uid => http(`/v1/user/${uid}/collect`);

// 获取用户粉丝列表
exports.getUserFollower = uid => http(`/v1/user/${uid}/follower`);

// 获取用户关注列表
exports.getUserFollowing = uid => http(`/v1/user/${uid}/following`);

// 关注或者取消关注用户
exports.followOrUn = (uid, token) => http(`/v1/user/${uid}/follow_or_un`, {}, 'PATCH', token);

// 创建话题
exports.createTopic = (params, token) => http('/v1/create', params, 'POST', token);

// 删除话题
exports.deleteTopic = (tid, token) => http(`/v1/topic/${tid}/delete`, {}, 'DELETE', token);

// 编辑话题
exports.editTopic = (tid, params, token) => http(`/v1/topic/${tid}/update`, params, 'PUT', token);

// 获取话题列表
exports.getTopics = params => http('/v1/topics/list', params);

// 搜索话题列表
exports.searchTopics = params => http('/v1/topics/search', params);

// 获取无人回复的话题
exports.getTopicsNoReply = params => http('/v1/topics/no_reply', params);

// 根据ID获取话题详情
exports.getTopicById = tid => http(`/v1/topic/${tid}`);

// 喜欢或者取消喜欢话题
exports.likeOrUn = (tid, token) => http(`/v1/topic/${tid}/like_or_un`, {}, 'PATCH', token);

// 收藏或者取消收藏话题
exports.collectOrUn = (tid, token) => http(`/v1/topic/${tid}/collect_or_un`, {}, 'PATCH', token);

// 创建回复
exports.createReply = (tid, params, token) => http(`/v1/topic/${tid}/reply`, params, 'POST', token);

// 删除回复
exports.deleteReply = (rid, token) => http(`/v1/reply/${rid}/delete`, {}, 'DELETE', token);

// 编辑回复
exports.editReply = (rid, params, token) => http(`/v1/reply/${rid}/update`, params, 'PUT', token);

// 回复点赞或者取消点赞
exports.upOrDown = (rid, token) => http(`/v1/reply/${rid}/up_or_down`, {}, 'PATCH', token);

// 获取用户消息
exports.getUserNotice = token => http('/v1/notice/user', {}, 'GET', token);

// 获取系统消息
exports.getSystemNotice = token => http('/v1/notice/system', {}, 'GET', token);
