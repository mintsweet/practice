module.exports = class Auth {
  // 用户基础权限
  static async userRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user || !user.id) ctx.throw(401, '需要用户登录权限');
    await next();
  }

  // 管理员权限
  static async adminRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user || !user.id || user.role < 1) ctx.throw(401, '需要管理员权限');
    await next();
  }
};
