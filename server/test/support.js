const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = function(nickname, mobile) {
  return UserModel.create({
    nickname,
    mobile,
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10))
  });
}

exports.deleteUser = function(mobile) {
  return UserModel.findOneAndRemove({
    mobile
  });
}
