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

exports.createTopic = function(author_id) {
  return TopicProxy.create('ask', '这是一个测试标题', '这是测试内容', author_id);
};

exports.deleteTopic = function(condition) {
  return TopicProxy.deleteOne(condition);
};

exports.createAction = function(type, author_id, target_id) {
  return ActionProxy.create(type, author_id, target_id);
};

exports.deleteAction = function(author_id) {
  return ActionProxy.delete({ id: author_id });
};
