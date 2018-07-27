const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
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
  .use(koaLogger())
  .use(koaJwt({ secret: config.secret }).unless({ path: [/signin/] }))
  .use(ErrorHandler.handleAuth)
  .use(ErrorHandler.handleError);

// router
app.use(router.v1);
app.use(router.v2);

// 404
app.use(ctx => {
  ctx.status = 404;
  ctx.body = '请求的API地址不正确或者不存在';
});

// error handle
app.on('error', err => logger.error(err));

if (!module.parent) app.listen(config.server_port);
