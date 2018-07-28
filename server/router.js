const Router = require('koa-router');
const AiderV1 = require('./controllers/v1/aider');
const StaticV1 = require('./controllers/v1/static');
const UserV1 = require('./controllers/v1/user');
const UserV2 = require('./controllers/v2/user');
const Auth = require('./middlewares/auth');

const routerV1 = new Router({
  prefix: '/v1'
});

routerV1
  .get('/', ctx => { ctx.body = 'Version_1 API'; }) // V1入口测试
  .get('/aider/captcha', AiderV1.getCaptcha) // 获取图形验证码
  .get('/aider/sms_code', AiderV1.getSmscode) // 获取短信验证码
  .get('/static/quick_start', StaticV1.getQuickStart) // 获取快速开始文档
  .get('/static/api_doc', StaticV1.getApiDoc) // 获取API说明文档
  .get('/static/about', StaticV1.getAbout) // 获取关于文档
  .post('/signup', UserV1.signup) // 注册
  .post('/signin', UserV1.signin) // 登录
  .patch('/forget_pass', UserV1.forgetPass) // 忘记密码
  .get('/info', Auth.userRequired, UserV1.getUserInfo) // 获取当前用户信息
  .put('/setting', Auth.userRequired, UserV1.updateSetting) // 更新个人信息
  .patch('/update_pass', Auth.userRequired, UserV1.updatePass) // 修改密码
  .get('/users/star', UserV1.getStar) // 获取星标用户列表
  .get('/users/top100', UserV1.getTop100) // 获取积分榜前一百用户列表
  .get('/user/:uid', UserV1.getInfoById) // 根据ID获取用户信息
  .get('/user/:uid/action', UserV1.getUserAction) // 获取用户动态
  .get('/user/:uid/create', UserV1.getUserCreate) // 获取用户专栏列表
  .get('/user/:uid/like', UserV1.getUserLike) // 获取用户喜欢列表
  .get('/user/:uid/collect', UserV1.getUserCollect) // 获取用户收藏列表
  .get('/user/:uid/follower', UserV1.getUserFollower) // 获取用户粉丝列表
  .get('/user/:uid/following', UserV1.getUserFollowing) // 获取用户关注列表
  .patch('/user/:uid/follow_or_un', Auth.userRequired, UserV1.followOrUn); // 关注或者取消关注用户

const routerV2 = new Router({
  prefix: '/v2'
});

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; }) // V2入口测试
  .get('/user/count', Auth.adminRequired, UserV2.countUser) // 统计用户总数
  .get('/user/count_new_today', Auth.adminRequired, UserV2.countNewToday); // 统计今日新增用户

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
