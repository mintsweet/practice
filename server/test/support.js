const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = function() {
  return UserModel.create({
    nickname: '青湛',
    mobile: '18800000000',
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10))
  });
}

exports.deleteUser = function() {
  return UserModel.findOneAndRemove({
    mobile: '18800000000'
  });
}

exports.deleteUserByMobile = function(mobile) {
  return UserModel.findOneAndRemove({
    mobile
  });
}
