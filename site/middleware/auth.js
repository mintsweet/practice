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
}

module.exports = new Auth();