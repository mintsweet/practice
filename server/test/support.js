const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = function(obj) {
  return UserModel.create({ ...obj, password: bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10)) });
}

exports.deleteUser = function(mobile) {
  return UserModel.findOneAndRemove({
      mobile: mobile
    });
}
