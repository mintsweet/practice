module.exports = class Auth {
  // 用户基础权限
  static async userRequired(ctx, next) {
    try {
      const { user } = ctx.state;
      if (!user || !user.uid) throw new Error('需要用户登录权限');
      await next();
    } catch(err) {
      ctx.throw(401, err.message);
    }
  }

  // 管理员权限
  static async adminRequired(ctx, next) {
    try {
      const { user } = ctx.state;
      if (!user || !user.uid || user.role < 1) throw new Error('需要管理员权限');
      await next();
    } catch(err) {
      ctx.throw(401, err.message);
    }
  }
};
