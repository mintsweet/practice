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
    const { jwt } = req.app.locals;
    try {
      const user = await getCurrentUserInfo(jwt);
      req.app.locals.user = user;
      next();
    } catch(err) {
      next();
    }
  }
}

module.exports = new Auth();
