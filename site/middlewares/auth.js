const { getCurrentUserInfo } = require('../http/api');

class Auth {
  userRequired(req, res, next) {
    if (!req.app.locals.user) {
      res.status(403).redirect('/exception/403');
    }
    next();
  }

  async getUserInfo(req, res, next) {
    try {
      const user = await getCurrentUserInfo();
      req.app.locals.user = user;
      next();
    } catch(err) {
      req.app.locals.user = null;
      if (err.name === 'RequestError') {
        next(err);
      } else {
        next();
      }
    }
  }
}

module.exports = new Auth();
