const rq = require('request-promise');
const { baseUrl } = require('./env');

const request = async (url, data, method = 'GET') => {
  const query = {
    baseUrl,
    url,
    method,
    json: true,
    jar: true
  };

  if (method === 'GET') {
    query.qs = data;
  } else {
    query.body = data;
  }

  const res = await rq(query);

  if (res.status === 1) {
    return res.data;
  } else {
    throw new Error(res.message);
  }
};

/*
* 静态
*/
// 快速开始
exports.getStartDoc = () => request('/static/start');
// API说明
exports.getApiDoc = () => request('/static/api');
// 关于
exports.getAboutDoc = () => request('/static/about');

/*
* 验证码
*/
// 获取图形验证码
exports.getPicCaptcha = () => request('/captcha/pic', { width: 100, height: 34 });
// 获取短信验证码
exports.getSmsCaptcha = mobile => request('/captcha/sms', mobile);

/*
* 用户
*/
// 注册
exports.signup = info => request('/signup', info, 'POST');
// 登录
exports.signin = info => request('/signin', info, 'POST');
// 登出
exports.signout = () => request('/signout', {}, 'DELETE');
// 忘记密码
exports.forgetPass = obj => request('/forget_pass', obj, 'PATCH');
// 获取当前登录用户信息
exports.getCurrentUserInfo = () => request('/info');
// 更新个人信息
exports.setting = info => request('/setting', info, 'PUT');
// 修改密码
exports.updatePass = obj => request('/update_pass', obj, 'PATCH');
// 获取星标用户列表
exports.getUsersStar = () => request('/users/star');
// 获取积分榜前一百用户列表
exports.getUsersTop100 = () => request('/users/top100');
// 根据ID获取用户信息
exports.getUserInfoById = uid => request(`/user/${uid}`);
// 获取用户动态
exports.getUserBehaviors = uid => request(`/user/${uid}/behaviors`);
// 获取用户专栏列表
exports.getUserCreates = uid => request(`/user/${uid}/creates`);
// 获取用户喜欢列表
exports.getUserStars = uid => request(`/user/${uid}/stars`);
// 获取用户收藏列表
exports.getUserCollections = uid => request(`/user/${uid}/collections`);
// 获取用户粉丝列表
exports.getUserFollower = uid => request(`/user/${uid}/follower`);
// 获取用户关注列表
exports.getUserFollowing = uid => request(`/user/${uid}/following`);
// 关注或者取消关注某个用户
exports.followOrUn = uid => request(`/user/${uid}/follow_or_un`, {}, 'PATCH');

/*
* 主题
*/
// 创建话题
exports.createTopic = obj => request('/create', obj, 'POST');
// 删除话题
exports.deleteTopic = tid => request(`/topic/${tid}/delete`, {}, 'DELETE');
// 编辑话题
exports.editTopic = (tid, obj) => request(`/topic/${tid}/edit`, obj, 'PUT');
// 获取话题列表
exports.getTopicList = page => request('/topics/list', page);
// 搜索话题列表
exports.getTopicBySearch = title => request('/topics/search', title);
// 获取无人回复的话题
exports.getNoReplyTopic = number => request('/topics/no_reply', number);
// 根据ID获取话题详情
exports.getTopicDetail = tid => request(`/topic/${tid}`);
// 喜欢或者取消喜欢话题
exports.starOrUnstarTopic = tid => request(`/topic/${tid}/star_or_un`, {}, 'PATCH');
// 收藏或者取消收藏话题
exports.collectOrUncollectTopic = tid => request(`/topic/${tid}/collect_or_un`, {}, 'PATCH');

/*
* 回复
*/
// 创建回复
exports.createReply = (tid, content) => request(`/topic/${tid}/reply`, content, 'POST');
// 删除回复
exports.deleteReply = rid => request(`/reply/${rid}/delete`, {}, 'DELETE');
// 编辑回复
exports.editReply = (rid, content) => request(`/reply/${rid}/edit`, content, 'PUT');
// 回复点赞
exports.upReply = rid => request(`/reply/${rid}/up`, {}, 'PATCH');

/*
* 消息
*/
// 获取用户消息
exports.getUserNotice = uid => request('/notice/user', uid);
// 获取系统消息
exports.getSystemNotice = uid => request('/notice/system', uid);
