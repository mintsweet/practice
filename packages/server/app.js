const Koa = require('koa');
const koaBody = require('koa-body');
const koaJwt = require('koa-jwt');
const path = require('path');
const { jwt: { SECRET }, PORT, FILE_LIMIT } = require('./config');
const router = require('./router');
const logger = require('./utils/logger');
const ErrorHandler = require('./middlewares/error-handler');

require('./db/mongodb');

const app = module.exports = new Koa();

// middleware
app
  .use(koaBody({
    multipart: true,
    formidable: {
      uploadDir: `${__dirname}/uploads`,
      keepExtensions: true,
      multiples: false,
      maxFieldsSize: FILE_LIMIT, // 限制上传文件大小为 512kb
      onFileBegin(name, file) {
        const dir = path.dirname(file.path);
        file.path = path.join(dir, file.name);
      }
    }
  }))
  .use(koaJwt({
    SECRET,
    passthrough: true
  }))
  .use(ErrorHandler.handleError);

// router
app
  .use(router.rt)
  .use(router.v1)
  .use(router.v2);

// 404
app.use(ctx => {
  ctx.status = 404;
  ctx.body = '请求的API地址不正确或者不存在';
});

// error handle
app.on('error', err => logger.error(err)); // 记录服务器错误

if (!module.parent) app.listen(PORT);
