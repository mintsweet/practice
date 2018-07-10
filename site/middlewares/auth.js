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
      const response = await getCurrentUserInfo();
      if (response.status === 1) {
        req.app.locals.user = response.data;
      } else {
        req.app.locals.user = null;
      }
      next();
    } catch(err) {
      res.render('exception/500', {
        title: '500'
      });
    }
  }
}

module.exports = new Auth();
