const express = require('express');
const Auth = require('./middleware/auth');
const Static = require('./controller/static');
const Captcha = require('./controller/captcha');
const User = require('./controller/user');
const Notice = require('./controller/notice');
const Topic = require('./controller/topic');
const Reply = require('./controller/reply');

const router = express.Router();

// 测试
router.get('/', (req, res) => res.send({ status: 1, data: '欢迎使用Mints(薄荷糖社区)API接口' }));

// 静态
router.get('/static/get_start', Static.getStart); // 获取快速开始文档
router.get('/static/api_introduction', Static.getApiIntroduction); // 获取API说明文档
router.get('/static/about', Static.getAbout); // 获取关于文档

// 验证码
router.get('/captcha/msg', Captcha.getMsgCaptcha);
router.get('/captcha/pic', Captcha.getPicCaptcha);

// 用户
router.post('/signup', User.signup); // 注册
router.post('/signin', User.signin); // 登录
router.get('/signout', User.signout); // 登出
router.post('/forget_pass', User.forgetPass); // 忘记密码
router.get('/info', Auth.userRequired, User.getUserInfo); // 获取当前用户信息
router.post('/update_pass', Auth.userRequired, User.updatePass); // 修改密码
router.post('/setting', Auth.userRequired, User.updateUserInfo); // 更新个人信息
router.get('/users/start', User.getStartList); // 获取星标用户列表
router.get('/users/top100', User.getTop100); // 获取积分榜前一百用户列表
router.get('/user/:nickname', User.getInfoNickname); // 获取指定昵称用户信息
router.get('/user/:nickname/likes', User.getUserLikes); // 获取用户喜欢列表
router.get('/user/:nickname/collections', User.getUserCollections);  // 获取用户收藏列表
router.get('/user/:nickname/replies', User.getUserReplies); // 用户回复的列表
router.get('/user/:nickname/follower', User.getUserFollower); // 获取用户粉丝列表
router.get('/user/:nickname/following', User.getUserFollowing); // 获取用户关注的人列表

// 话题
router.post('/topic/create', Auth.userRequired, Topic.createTopic); // 创建话题
router.get('/topic/list', Topic.getTopicList); // 获取话题列表
router.get('/topic/search', Topic.searchTopicList); // 搜索话题列表
router.get('/topics/:tid', Topic.getTopicDetail); // 获取话题详情
router.post('/topics/:tid/edit', Auth.userRequired, Topic.editTopic); // 编辑话题
router.post('/topics/:tid/like', Auth.userRequired, Topic.likeTopic); // 喜欢话题
router.post('/topucs/:tid/un_like', Auth.userRequired, Topic.unLikeTopic); // 取消喜欢话题
router.post('/topics/:tid/collect', Auth.userRequired, Topic.collectTopic); // 收藏话题
router.post('/topics/:tid/un_collect', Auth.userRequired, Topic.unCollectTopic); // 取消收藏话题

// 回复
router.post('/topisc/:tid/reply', Auth.userRequired, Reply.createReply); // 创建回复
router.post('/reply/:rid/edit', Auth.userRequired, Reply.editReply); // 编辑回复
router.delete('/reply/:rid/delete', Auth.userRequired, Reply.deleteReply); // 删除回复
router.get('/reply/:rid/up', Auth.userRequired, Reply.upReply); // 点赞回复

// 消息
router.get('/notice', Auth.userRequired, Notice.getAllNotice); // 获取所有消息
router.get('/notice/:type', Auth.userRequired, Notice.getNoticeByType); // 根据类型获取消息

module.exports = router;