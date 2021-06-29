const jwt = require('jsonwebtoken');
const {
  jwt: { SECRET, EXPIRSE, REFRESH },
} = require('../../../config');

module.exports = (need = 0) => {
  return async (ctx, next) => {
    const { user } = ctx.state;

    if (!user || !user.id) {
      ctx.throw(401, '尚未登录');
    }

    const { id, exp, ref, role } = user;

    if (exp < Date.now() && ref < Date.now()) {
      ctx.throw(401, '登录已过期，请重新登录');
    }

    if (ref > Date.now()) {
      const token = jwt.sign(
        {
          id,
          exp: Date.now() + EXPIRSE,
          ref: Date.now() + REFRESH,
        },
        SECRET,
      );

      ctx.set('token', token);
    }

    const { uid } = ctx.params;

    if (uid && uid === user.id) {
      ctx.throw(403, '不能操作自身');
    }

    if (role < need) {
      ctx.throw(403, '权限不足');
    }

    await next();
  };
};
