const { getCurrentUserInfo } = require('../http/api');

class Auth {
  userRequired(req, res, next) {
    if (!req.app.locals.user) {
      res.render('exception/403', {
        title: '403'
      });
    }

    next();
  }

  async getUserInfo(req, res, next) {
    try {
      const user = await getCurrentUserInfo();
      req.app.locals.user = user;
    } catch(err) {
      req.app.locals.user = null;
    }
    next();
  }
}

module.exports = new Auth();
