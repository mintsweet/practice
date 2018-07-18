const { getCurrentUserInfo } = require('../http/api');

class Auth {
  userRequired(req, res, next) {
    if (!req.app.locals.user) {
      return res.status(403).render('exception/403', {
        title: '403'
      });
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
