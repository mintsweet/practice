const Koa = require('koa');
const router = require('./router');
const config = require('./config');

const app = module.exports = new Koa();

// router
app
  .use(router.v1);

if (!module.parent) app.listen(config.port);
