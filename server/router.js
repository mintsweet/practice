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
  .get('/aider/captcha', AiderV1.getCaptcha) // 图形验证码
  .get('/aider/sms_code', AiderV1.getSmscode) // 短信验证码
  .get('/static/quick_start', StaticV1.getQuickStart) // 快速开始文档
  .get('/static/api_doc', StaticV1.getApiDoc) // API说明文档
  .get('/static/about', StaticV1.getAbout) // 关于文档
  .post('/signup', UserV1.signup) // 注册
  .post('/signin', UserV1.signin) // 登录
  .get('/info', UserV1.getUserInfo) // 当前用户信息

const routerV2 = new Router({
  prefix: '/v2'
});

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; }) // V2入口测试
  .get('/user/count_new_today', Auth.admin, UserV2.getCountNewToday) // 获取今日新增用户

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
