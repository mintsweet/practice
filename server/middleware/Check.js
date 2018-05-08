const AdminModel = require('../models/admin');

class Check {
  async isRoot(req, res, next) {
    const admin = req.session.admin;
    if (!admin) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_SIGNIN',
        message: '尚未登录'
      });
    } else if (admin.role < 100) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_PERMISSIONS',
        message: '不是超级管路员'
      });
    } else {
      next();
    }
  }

  async isAdmin(req, res, next) {
    const admin = req.session.admin;
    if (!admin) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_SIGNIN',
        message: '尚未登录'
      });
    } else if (admin.role < 1) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_PERMISSIONS',
        message: '不是管理员'
      });
    } else {
      next();
    }
  }
  }
}

module.exports = new Check();