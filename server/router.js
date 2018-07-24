const Router = require('koa-router');
const Static = require('./controller/static');
const UserV1 = require('./controller/v1/user');

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
  .get('/static/quick_start', Static.getQuickStart)
  .get('/static/api', Static.getApiDoc)
  .get('/static/about', Static.getAbout)
  .post('/signup', UserV1.signup);

routerV2
  .get('/', ctx => ctx.body = 'Version_2 API');

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
