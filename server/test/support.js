const UserModel = require('../models/user');

exports.createUser = function(obj) {
  return UserModel.create(obj);
}

exports.deleteUser = function(mobile) {
  return UserModel.findOneAndRemove({
      mobile: mobile
    });
}
