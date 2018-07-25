class ErrorHandler {
  async handleError(ctx, next) {
    try {
      await next();
    } catch(err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  }
}

module.exports = new ErrorHandler();
