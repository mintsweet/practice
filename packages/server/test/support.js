const bcrypt = require('bcryptjs');
const UserProxy = require('../proxy/user');

exports.createUser = function(email, nickname, other = {}) {
  const password = bcrypt.hashSync('a123456', bcrypt.genSaltSync(10))
  return UserProxy.createUser(email, password, nickname, other);
};

exports.deleteUser = function(email) {
  return UserProxy.deleteUserByQuery({ email });
};
