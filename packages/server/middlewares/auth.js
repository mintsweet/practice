const jwt = require('jsonwebtoken');
const { secret, JWT_EXPIRES, JWT_REFRESH } = require('../config');

class Auth {
  constructor() {
    this.userRequired = this.userRequired.bind(this);
    this.adminRequired = this.adminRequired.bind(this);
    this.rootRequired = this.rootRequired.bind(this);
  }

  _validJWT(user) {
    const { id, exp, ref } = user;

    if (exp < Date.now()) {
      if (ref < Date.now()) {
        return {
          is_valid: false,
        };
      }

      const token = jwt.sign(
        {
          id,
          exp: Date.now() + JWT_EXPIRES,
          ref: Date.now() + JWT_REFRESH,
        },
        secret
      );

      return {
        is_valid: true,
        token: `Bearer ${token}`
      };
    }

    return { is_valid: true };
  }

  // 用户基础权限
  async userRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user) ctx.throw(401, '尚未登录');

    const { is_valid, token } = this._validJWT(user);
    if (!is_valid) ctx.throw(401, '登录已过期，请重新登录');
    if (token) ctx.set('token', token);

    await next();
  }

  // 管理员权限
  async adminRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user || !user.id) ctx.throw(401, '尚未登录');

    const { is_valid, token } = this._validJWT(user);
    if (!is_valid) ctx.throw(401, '登录已过期，请重新登录');
    if (token) ctx.set('token', token);

    const { role } = user;
    if (role < 1) ctx.throw(403, '需要管理员权限');

    await next();
  }

  // 超级管理员权限
  async rootRequired(ctx, next) {
    const { user } = ctx.state;
    if (!user || !user.id) ctx.throw(401, '尚未登录');

    const { is_valid, token } = this._validJWT(user);
    if (!is_valid) ctx.throw(401, '登录已过期，请重新登录');
    if (token) ctx.set('token', token);

    const { role } = user;
    if (role < 100) ctx.throw(403, '需要超级管理员权限');

    await next();
  }
}

module.exports = new Auth();
