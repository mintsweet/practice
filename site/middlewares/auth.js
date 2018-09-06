const { getCurrentUserInfo } = require('../http/api');

class Auth {
  userRequired(req, res, next) {
    if (!req.app.locals.user) {
      return res.render('pages/403', {
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
      req.app.locals.user = null;
      next();
    }
  }
}

module.exports = new Auth();
