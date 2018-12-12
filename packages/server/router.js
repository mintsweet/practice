const Router = require('koa-router');
const StaticV1 = require('./controllers/v1/static');

const routerV1 = new Router({
  prefix: '/v1'
});

routerV1
  .get('/', ctx => { ctx.body = 'Version_1 API'; })
  .get('/static/norms', StaticV1.getNorms); // 获取社区规范文档

module.exports = {
  v1: routerV1.routes(),
};
