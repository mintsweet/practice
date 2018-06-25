const rq = require('request-promise');
const { baseUrl } = require('./env');

const request = (url, data, method = 'GET') => {
  if (method === 'POST') {
    return rq({
      baseUrl,
      method,
      url,
      json: true,
      jar: true,
      body: data
    });
  } else {
    return rq({
      baseUrl,
      method,
      url,
      json: true,
      jar: true,
      qs: data
    });
  }
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
* 公共
*/

// 请求图形验证码
exports.getPicCaptcha = () => request('/common/piccaptcha');
// 请求手机验证码
exports.getMsgCaptcha = mobile => request('/common/msgcaptcha', mobile);

/*
* 用户 user
*/

// 获取当前用户信息
exports.getCurrentUser = () => request('/info');
// 注册
exports.apiSignup = obj => request('/signup', obj, 'POST');
// 登录
exports.apiSignin = obj => request('/signin', obj, 'POST');
// 登出
exports.apiSignout = () => request('/signout');
// 忘记密码
exports.apiForgetPass = obj => request('/forget_pass', obj, 'POST');
// 修改密码
exports.apiUpdatePass = obj => request('/update_pass', obj, 'POST');
// 更新个人设置
exports.apiSetting = obj => request('/setting', obj, 'POST');
// 获取星标用户列表
exports.getUserStart = () => request('/users/start');
// 获取积分榜前一百
exports.apiGetUserTop100 = () => request('/users/top100');
// 获取指定昵称的用户信息
exports.getUserInfoByName = nickname => request(`/user/${nickname}`);
// 获取用户收藏列表
exports.getUserCollection = nickname => request(`/user/${nickname}/collections`);
// 获取用户回复列表
exports.getUserReply = nickname => request(`/user/${nickname}/replies`);
// 获取用户粉丝列表
exports.getUserFollower = nickname => request(`/user/${nickname}/follower`);
// 获取用户关注列表
exports.getUserFollowing = nickname => request(`/user/${nickname}/following`);

/*
* 主题
*/

// 新增主题
exports.createTopic = obj => request('/topic/create', obj, 'POST');
// 获取主题列表
exports.getTopicList = page => request('/topic/list', page);
// 获取主题详情
exports.getTopicDetail = id => request(`/topics/${id}`);
