const bcrypt = require('bcryptjs');
const UserModel = require('../model/user');
const TopicModel = require('../model/topic');
const NoticeModel = require('../model/notice');
const ActionModel = require('../model/action');
const ReplyModel = require('../model/reply');

exports.createUser = function(email, props = {}) {
  return UserModel.create({
    email,
    nickname: '测试用户',
    password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
    ...props,
  });
};

exports.deleteUser = function(email) {
  return UserModel.findOneAndDelete({ email });
};

exports.createTopic = function(aid) {
  return TopicModel.create({
    tab: 'ask',
    title: '这是一个测试标题',
    content: '这是测试内容',
    aid,
  });
};

exports.deleteTopic = function(aid) {
  return TopicModel.deleteMany({
    aid,
  });
};

exports.createNotice = function(params) {
  return NoticeModel.create(params);
};

exports.deleteNotice = function(uid) {
  return NoticeModel.deleteMany({
    uid,
  });
};

exports.createAction = function(params) {
  return ActionModel.create(params);
};

exports.deleteAction = function(aid) {
  return ActionModel.deleteMany({ aid });
};

exports.createReply = function(aid, tid) {
  return ReplyModel.create({
    aid,
    tid,
    content: '# 回复',
  });
};

exports.deleteReply = function(tid) {
  return ReplyModel.deleteMany({
    tid,
  });
};
