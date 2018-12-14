const Router = require('koa-router');
const Auth = require('./middlewares/auth');
const StaticV1 = require('./controllers/v1/static');
const AiderV1 = require('./controllers/v1/aider');
const UserV1 = require('./controllers/v1/user');

const routerV1 = new Router({
  prefix: '/v1'
});

routerV1
  .get('/', ctx => { ctx.body = 'Version_1 API'; })
  .get('/static/norms', StaticV1.getNorms) // 获取社区规范文档
  .get('/aider/captcha', AiderV1.getCaptcha) // 获取图形验证码
  .post('/aider/upload_avatar', Auth.userRequired, AiderV1.uploadAvatar) // 头像上传
  .post('/signup', UserV1.signup) // 注册
  .post('/signin', UserV1.signin) // 登录
  .get('/user/info', Auth.userRequired, UserV1.getUserInfo) // 获取当前用户信息
  .put('/setting', Auth.userRequired, UserV1.updateSetting) // 更新个人信息
  .patch('/update_pass', Auth.userRequired, UserV1.updatePass); // 修改密码

const routerV2 = new Router({
  prefix: '/v2'
});

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; });

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
