const request = require('./request');

// 获取图片验证码
const getCaptcha = params => request('/captcha', params);

// 登录
const signin = params => request('/signin', params, 'POST');

// GitHub 登录
const github = params => request('/github', params, 'POST');

// 头像上传
const uploadAvatar = params => request('/aider/upload_avatar', params);

// 注册
const signup = params => request('/signup', params, 'POST');

// 账户激活
const setActive = params => request('/set_active', params);

// 忘记密码
const forgetPass = params => request('/forget_pass', params, 'POST');

// 重置密码
const resetPass = params => request('/reset_pass', params, 'POST');

// 获取当前用户信息
const getCurrentUser = () => request('/info');

// 更新个人信息
const updateSetting = params => request('/setting', params, 'PUT');

// 修改密码
const updatePass = params => request('/update_pass', params, 'PATCH');


// 获取积分榜用户列表
const getUsersTop = params => request('/v1/users/top', params);

// 根据ID获取用户信息
const getUserById = uid => request(`/v1/user/${uid}`);

// 获取用户动态
const getUserAction = uid => request(`/v1/user/${uid}/action`);

// 获取用户专栏列表
const getUserCreate = uid => request(`/v1/user/${uid}/create`);

// 获取用户喜欢列表
const getUserLike = uid => request(`/v1/user/${uid}/like`);

// 获取用户收藏列表
const getUserCollect = uid => request(`/v1/user/${uid}/collect`);

// 获取用户粉丝列表
const getUserFollower = uid => request(`/v1/user/${uid}/follower`);

// 获取用户关注列表
const getUserFollowing = uid => request(`/v1/user/${uid}/following`);

// 关注或者取消关注用户
const followOrUn = uid => request(`/v1/user/${uid}/follow_or_un`, {}, 'PATCH');

// 创建话题
const createTopic = params => request('/v1/create', params, 'POST');

// 删除话题
const deleteTopic = tid => request(`/v1/topic/${tid}/delete`, {}, 'DELETE');

// 编辑话题
const editTopic = (tid, params) => request(`/v1/topic/${tid}/update`, params, 'PUT');

// 获取话题列表
const getTopics = params => request('/v1/topics/list', params);

// 搜索话题列表
const searchTopics = params => request('/v1/topics/search', params);

// 获取无人回复的话题
const getTopicsNoReply = params => request('/v1/topics/no_reply', params);

// 根据ID获取话题详情
const getTopicById = tid => request(`/v1/topic/${tid}`);

// 喜欢或者取消喜欢话题
const likeOrUn = tid => request(`/v1/topic/${tid}/like_or_un`, {}, 'PATCH');

// 收藏或者取消收藏话题
const collectOrUn = tid => request(`/v1/topic/${tid}/collect_or_un`, {}, 'PATCH');

// 创建回复
const createReply = (tid, params) => request(`/v1/topic/${tid}/reply`, params, 'POST');

// 删除回复
const deleteReply = rid => request(`/v1/reply/${rid}/delete`, {}, 'DELETE');

// 编辑回复
const editReply = (rid, params) => request(`/v1/reply/${rid}/update`, params, 'PUT');

// 回复点赞或者取消点赞
const upOrDown = rid => request(`/v1/reply/${rid}/up_or_down`, {}, 'PATCH');

// 获取用户消息
const getUserNotice = () => request('/v1/notice/user');

// 获取系统消息
const getSystemNotice = () => request('/v1/notice/system');

module.exports = {
  getCaptcha,
  uploadAvatar,
  github,
  signup,
  setActive,
  signin,
  forgetPass,
  resetPass,
  getCurrentUser,
  updateSetting,
  updatePass,
  getUsersTop,
  getUserById,
  getUserAction,
  getUserCreate,
  getUserLike,
  getUserCollect,
  getUserFollower,
  getUserFollowing,
  followOrUn,
  createTopic,
  deleteTopic,
  editTopic,
  getTopics,
  searchTopics,
  getTopicsNoReply,
  getTopicById,
  likeOrUn,
  collectOrUn,
  createReply,
  deleteReply,
  editReply,
  upOrDown,
  getUserNotice,
  getSystemNotice,
};
