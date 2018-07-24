const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const router = require('./router');
const ErrorHandler = require('./middlewares/error-handler');

const app = module.exports = new Koa();

// middleware
app.use(koaBody());
app.use(logger());
app.use(ErrorHandler.handleError);

// router
app.use(router.v1);
app.use(router.v2);

// 404
app.use(ctx => {
  ctx.status = 404;
  ctx.body = '请求的API地址不正确或者不存在';
});

// error handle
app.on('error', function(err) {
  console.error('sent error %s to the cloud', err.message);
  console.error(err);
});

if (!module.parent) app.listen(3000);
