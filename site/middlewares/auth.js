const { getCurrentUserInfo } = require('../http/api');

class Auth {
  userRequired(req, res, next) {
    if (req.app.locals.user) {
      next();
    } else {
      res.render('exception/403', {
        title: '403'
      });
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const user = await getCurrentUserInfo();
      req.app.locals.user = user;
      next();
    } catch(err) {
      req.app.locals.user = null;
      next();
    }
  }
}

module.exports = new Auth();
