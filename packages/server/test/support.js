const bcrypt = require('bcryptjs');
const UserProxy = require('../proxy/user');
const TopicProxy = require('../proxy/topic');
const ReplyProxy = require('../proxy/reply');
const NoticeProxy = require('../proxy/notice');
const ActionProxy = require('../proxy/action');

exports.createUser = function(email, nickname, other = {}) {
  return UserProxy.create({
    email,
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
    nickname,
    ...other
  });
};

exports.deleteUser = function(email) {
  return UserProxy.delete({ email });
};

exports.createTopic = function(author_id) {
  return TopicProxy.create({
    tab: 'ask',
    title: '这是一个测试标题',
    content: '这是测试内容',
    author_id
  });
};

exports.deleteTopic = function(condition) {
  return TopicProxy.delete(condition);
};

exports.createAction = function(type, author_id, target_id) {
  return ActionProxy.create({
    type,
    author_id,
    target_id
  });
};

exports.deleteAction = function(author_id) {
  return ActionProxy.delete({ author_id });
};

exports.createReply = function(author_id, topic_id) {
  return ReplyProxy.create({
    author_id,
    topic_id,
    content: '# 回复哈哈哈哈'
  });
};

exports.deleteReply = function(topic_id) {
  return ReplyProxy.delete({
    topic_id
  });
};

exports.deleteNotice = function(target_id) {
  return NoticeProxy.delete({
    target_id
  });
};
