const rq = require('request-promise');
const { baseUrl } = require('./env');

const request = (url, data, method = 'GET') => {
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

  return rq(query);
};

/*
* 静态 static
*/
// 快速开始
exports.getStartData = () => request('/static/get_start');
// API说明
exports.getApiData = () => request('/static/api_introduction');
// 关于
exports.getAboutData = () => request('/static/about');

/*
* 验证码 captcha
*/
// 获取图形验证码
exports.getPicCaptcha = () => request('/captcha/pic', { width: 100, height: 38 });
// 获取短信验证码
exports.getSmsCaptcha = mobile => request('/captcha/sms', mobile);

/*
* 用户 user
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
exports.updatePass = content => request('/update_pass', content, 'PATCH');
// 获取星标用户列表
exports.getUsersStart = () => request('/users/start');
// 获取积分榜前一百
exports.getUsersTop100 = () => request('/users/top100');
// 根据ID获取用户信息
exports.getUserInfoByName = uid => request(`/user/${uid}`);
// 关注或者取消关注某个用户
exports.followOrUn = uid => request(`/user/${uid}/follow_or_un`, {}, 'PATCH');
// 获取用户喜欢列表
exports.getUserLikes = uid => request(`/user/${uid}/likes`);
// 获取用户收藏列表
exports.getUserCollection = uid => request(`/user/${uid}/collections`);
// 获取用户回复列表
exports.getUserReply = uid => request(`/user/${uid}/replies`);
// 获取用户粉丝列表
exports.getUserFollower = uid => request(`/user/${uid}/follower`);
// 获取用户关注列表
exports.getUserFollowing = uid => request(`/user/${uid}/following`);

/*
* 主题
*/
// 创建话题
exports.createTopic = obj => request('/topic/create', obj, 'POST');
// 删除话题
exports.deleteTopic = tid => request(`/topic/${tid}/delete`, {}, 'DELETE');
// 编辑话题
exports.editTopic = (tid, obj) => request(`/topic/${tid}/edit`, obj, 'PUT');
// 获取话题列表
exports.getTopicList = page => request('/topics/list', page);
// 搜索话题列表
exports.getTopicBySearch = title => request('/topics/search', title);
// 根据ID获取话题详情
exports.getTopicDetail = tid => request(`/topic/${tid}`);
// 喜欢或者取消喜欢话题
exports.likeOrUnlikeTopic = tid => request(`/topic/${tid}/like_or_un`);
// 收藏或者取消收藏话题
exports.collectOrUncollectTopic = tid => request(`/topic/${tid}/collect_or_un`);

/*
* 回复
*/
// 创建回复
exports.createReply = (tid, content) => request(`/topic/${tid}/reply`, content, 'POST');
// 删除回复
exports.deleteReply = rid => request(`/topic/${rid}/delete`, {}, 'DELETE');
// 编辑回复
exports.editReply = (rid, content) => request(`/topic/${rid}/edit`, content, 'PUT');
// 回复点赞
exports.upReply = rid => request(`/topic/${rid}/up`, {}, 'PATCH');

/*
* 消息
*/
// 获取用户消息
exports.getUserNotice = uid => request('/notice/user', uid);
// 获取系统消息
exports.getSystemNotice = uid => request('/notice/system', uid);
