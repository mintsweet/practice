const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');

exports.createUser = function(mobile, nickname) {
  return UserModel.create({
    mobile,
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
    nickname
  });
};

exports.deleteUser = function(mobile) {
  return UserModel.findOneAndRemove({ mobile });
};
