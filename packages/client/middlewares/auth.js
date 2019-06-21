const API = require('../utils/api');

class Auth {
  userRequired(req, res, next) {
    if (!req.app.locals.user) {
      return res.render('pages/exception', {
        title: '403',
        errorTitle: '抱歉！你无权访问该页面',
        errorMsg: [
          '尚未登录 - 请先登录用户。',
          '尚未成为管理员 - 请申请成为管理员。'
        ]
      });
    }
    next();
  }

  async getUserInfo(req, res, next) {
    if (!req.session.token) {
      req.app.locals.user = null;
      next();
    } else if (req.app.locals.user && req.app.locals.user.id) {
      next();
    } else {
      try {
        const user = await API.getCurrentUser(req.session.token);
        req.app.locals.user = user;
        next();
      } catch(err) {
        req.app.locals.user = null;
        next();
      }
    }
  }
}

module.exports = new Auth();
