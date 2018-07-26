class Auth {
  // auth user
  userRequired(req, res, next) {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }
    next();
  }
}

module.exports = new Auth();
