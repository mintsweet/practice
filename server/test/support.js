const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const TopicModel = require('../models/topic');
const BehaviorModel = require('../models/behavior');

exports.createUser = function(nickname, mobile) {
  return UserModel.create({
    nickname,
    mobile,
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10))
  });
};

exports.deleteUser = function(mobile) {
  return UserModel.findOneAndRemove({
    mobile
  });
};

exports.createTopic = function(authorId) {
  return TopicModel.create({
    tab: 'ask',
    title: '测试问题标题',
    content: '# 嘻嘻哈哈哈的内容',
    authorId
  });
};

exports.deleteTopic = function(authorId) {
  return TopicModel.findOneAndRemove({
    authorId
  });
};

exports.deleteBehavior = function(authorId) {
  return BehaviorModel.findOneAndRemove({
    authorId
  });
};
