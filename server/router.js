const Router = require('koa-router');
const StaticV1 = require('./controller/v1/static');
const CaptchaV1 = require('./controller/v1/captcha');
const UserV1 = require('./controller/v1/user');
const UserV2 = require('./controller/v2/user');

const routerV1 = new Router({
  prefix: '/v1'
});

const routerV2 = new Router({
  prefix: '/v2'
});

routerV1
  .get('/', ctx => {
    ctx.body = 'Version_1 API';
  })
  .get('/static/quick_start', StaticV1.getQuickStart)
  .get('/static/api_doc', StaticV1.getApiDoc)
  .get('/static/about', StaticV1.getAbout)
  .get('/captcha/pic', CaptchaV1.getPicCaptcha)
  .get('/captcha/sms', CaptchaV1.getSmsCaptcha)
  .post('/signup', UserV1.signup);

routerV2
  .get('/', ctx => {
    ctx.body = 'Version_2 API';
  })
  .get('/user/new_count', UserV2.getNewUserCount);

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
