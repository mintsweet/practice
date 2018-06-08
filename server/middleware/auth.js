class Auth {
  // auth user
  userRequired(req, res, next) {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_SIGNIN',
        message: '尚未登录'
      });
    }

    next();
  }

  // auth admin
  adminRequired(req, res, next) {
    if (!req.session.user) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_SIGNIN',
        message: '尚未登录'
      });
    }
  
    if (!req.session.user.is_admin && res.session.user.role > 0) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_AUTHORITY',
        message: '需要管理员权限'
      });
    }
  
    next();
  };

  // auth root
  rootRequired(req, res, next) {
    if (!req.session.user) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_SIGNIN',
        message: '尚未登录'
      });
    }

    if (req.session.is_admin && req.session.role > 100) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_AUTHORITY',
        message: '需要超级管理员权限'
      });
    }

    next();
  }
}

module.exports = new Auth();