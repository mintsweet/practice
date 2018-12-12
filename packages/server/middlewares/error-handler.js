module.exports = class ErrorHandler {
  static async handleError(ctx, next) {
    try {
      await next();
    } catch(err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      if (ctx.status === 500) ctx.app.emit('error', err, ctx);
    }
  }
};
