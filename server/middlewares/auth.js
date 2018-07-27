module.exports = class Auth {
  static async admin(ctx, next) {
    try {
      if(ctx.state.user.role < 200) throw new Error('啦啦啦');
      await next();
    } catch(err) {
      ctx.throw(401, err.message);
    }
  }
}