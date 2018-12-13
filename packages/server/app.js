const Koa = require('koa');
const koaBody = require('koa-body');
const config = require('./config');
const router = require('./router');
const logger = require('./utils/logger');
const ErrorHandler = require('./middlewares/error-handler');

require('./db');

const app = module.exports = new Koa();

// middleware
app
  .use(koaBody())
  .use(ErrorHandler.handleError);

// router
app
  .use(router.v1);

// 404
app.use(ctx => {
  ctx.status = 404;
  ctx.body = '请求的API地址不正确或者不存在';
});

// error handle
app.on('error', err => logger.error(err)); // 记录服务器错误

if (!module.parent) app.listen(config.port);
