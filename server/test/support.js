const bcrypt = require('bcryptjs');
const UserProxy = require('../proxy/user');

exports.createUser = function(mobile, nickname) {
  const password = bcrypt.hashSync('a123456', bcrypt.genSaltSync(10));
  return UserProxy.createUser(mobile, password, nickname);
};

exports.deleteUser = function(mobile) {
  return UserProxy.deleteUserByMobile(mobile);
};
