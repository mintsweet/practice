module.exports = class ErrorHandler {
  static handleAuth(ctx, next) {
    return next().catch((err) => {
      console.log(1);
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = '无权访问受限资源';
      } else {
        throw err;
      }
    });
  }

  static async handleError(ctx, next) {
    try {
      await next();
    } catch(err) {
      console.log(2);
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  }
}
