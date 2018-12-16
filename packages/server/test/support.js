const bcrypt = require('bcryptjs');
const UserProxy = require('../proxy/user');
const TopicProxy = require('../proxy/topic');
const ActionProxy = require('../proxy/action');

exports.createUser = function(email, nickname, other = {}) {
  const password = bcrypt.hashSync('a123456', bcrypt.genSaltSync(10))
  return UserProxy.createUser(email, password, nickname, other);
};

exports.deleteUser = function(email) {
  return UserProxy.deleteUserByQuery({ email });
};

exports.deleteTopic = function(id) {
  return TopicProxy.deleteById(id);
};

exports.deleteAction = function(author_id) {
  return ActionProxy.delete({ id: author_id });
};
