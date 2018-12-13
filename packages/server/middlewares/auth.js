module.exports = class Auth {
  // 用户基础权限
  static async userRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user || !user.id) ctx.throw(401, '尚未登录');
    await next();
  }
};
