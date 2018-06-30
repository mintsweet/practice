class Auth {
  // auth user
  userRequired(req, res, next) {
    if (!req.session || !req.session.userInfo || !req.session.userInfo.id) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_SIGNIN',
        message: '尚未登录'
      });
    }

    next();
  }

  // auth admin
  adminRequired(req, res, next) {
    if (!req.session.userInfo) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_SIGNIN',
        message: '尚未登录'
      });
    }
  
    if (!req.session.userInfo.is_admin && res.session.userInfo.role > 0) {
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
    if (!req.session.userInfo) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_SIGNIN',
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