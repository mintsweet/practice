const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const TopicModel = require('../models/topic');

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

exports.createTopic = function(author_id) {
  return TopicModel.create({
    tab: 'ask',
    title: '测试问题标题',
    content: '# 嘻嘻哈哈哈的内容',
    author_id
  });
}

exports.deleteTopic = function() {
  return TopicModel.findOneAndRemove({
    title: '测试问题标题'
  });
}
