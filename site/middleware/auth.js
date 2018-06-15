class Auth {
  userRequired(req, res, next) {
    if (req.app.locals.user) {
      next();
    } else {
      res.redirect('/exception/403');
    }
  }
}

module.exports = new Auth();