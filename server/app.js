const Koa = require('koa');
const koaBody = require('koa-body');
const koaJwt = require('koa-jwt');
const router = require('./router');
const config = require('../config.default');
const logger = require('./utils/logger');
const ErrorHandler = require('./middlewares/error-handler');

// connect db
require('./db');

const app = module.exports = new Koa();

// middleware
app
  .use(koaBody())
  .use(koaJwt({ secret: config.secret, passthrough: true }))
  .use(ErrorHandler.handleError); // 统一的异常处理

// router
app
  .use(router.v1)
  .use(router.v2);

// 404
app.use(ctx => {
  ctx.status = 404;
  ctx.body = '请求的API地址不正确或者不存在';
});

// error handle
app.on('error', err => logger.error(err)); // 记录服务器错误

if (!module.parent) app.listen(config.server_port);
