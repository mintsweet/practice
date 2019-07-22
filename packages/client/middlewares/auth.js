const API = require('../utils/api');

class Auth {
  userRequired(req, res, next) {
    if (req.app.locals.user && req.app.locals.user.id) return next();

    res.render(
      'pages/exception',
      {
        title: '403',
        errorTitle: '抱歉！你无权访问该页面',
        errorMsg: [
          '尚未登录 - 请先登录用户。',
          '尚未成为管理员 - 请申请成为管理员。'
        ]
      }
    );
  }

  async validaUser(req, res, next) {
    if (!req.session.token) return next();
    if (req.app.locals.user && req.app.locals.user.id) return next();

    const user = await API.getCurrentUser(req.session.token);
    req.app.locals.user = user;

    next();
  }
}

module.exports = new Auth();
