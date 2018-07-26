const express = require('express');
const Aider = require('./controllers/aider');
const Static = require('./controllers/static');
const User = require('./controllers/user');
const Auth = require('./middlewares/auth');
const Topic = require('./controllers/topic');
// const Notice = require('./controllers/notice');
// const Reply = require('./controllers/reply');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

// 辅助
router.get('/', (req, res) => res.send({ status: 1, data: '欢迎使用 Mints API！' })); // 入口
router.get('/aider/captcha', Aider.getCaptcha); // 图形验证码
router.get('/aider/sms_code', wrap(Aider.getSmsCode)); // 短信验证码

// 静态
router.get('/static/quick_start', wrap(Static.getQuickStart)); // 快速开始文档
router.get('/static/api_doc', wrap(Static.getApiDoc)); // API说明文档
router.get('/static/about', wrap(Static.getAbout)); // 关于文档

// 用户
router.post('/signup', wrap(User.signup)); // 注册
router.post('/signin', wrap(User.signin)); // 登录
router.delete('/signout', User.signout); // 登出
router.patch('/forget_pass', wrap(User.forgetPass)); // 忘记密码
router.get('/info', Auth.userRequired, User.getUserInfo); // 当前登录用户信息
router.put('/setting', Auth.userRequired, wrap(User.updateUserInfo)); // 更新个人信息
router.patch('/update_pass', Auth.userRequired, wrap(User.updatePass)); // 修改密码
router.get('/users/star', wrap(User.getStarList)); // 星标用户列表
router.get('/users/top100', wrap(User.getTop100)); // 积分榜前一百用户列表
router.get('/user/:uid', wrap(User.getInfoById)); // 根据ID获取用户信息
router.get('/user/:uid/action', wrap(User.getUserAction)); // 用户动态
router.get('/user/:uid/create', wrap(User.getUserCreate)); // 用户专栏列表
router.get('/user/:uid/like', wrap(User.getUserLike)); // 用户喜欢列表
router.get('/user/:uid/collect', wrap(User.getUserCollect)); // 用户收藏列表
router.get('/user/:uid/follower', wrap(User.getUserFollower)); // 用户粉丝列表
router.get('/user/:uid/following', wrap(User.getUserFollowing)); // 用户关注列表
router.patch('/user/:uid/follow_or_un', Auth.userRequired, wrap(User.followOrUnFollow)); // 关注或者取消关注某个用户

// 话题
router.post('/create', Auth.userRequired, wrap(Topic.createTopic)); // 创建话题
router.delete('/topic/:tid/delete', Auth.userRequired, wrap(Topic.deleteTopic)); // 删除话题
router.put('/topic/:tid/edit', Auth.userRequired, wrap(Topic.editTopic)); // 编辑话题
router.get('/topics/list', wrap(Topic.getTopicList)); // 获取话题列表
router.get('/topics/search', wrap(Topic.searchTopic)); // 搜索话题列表
router.get('/topics/no_reply', wrap(Topic.getNoReplyTopic)); // 获取无人回复的话题
router.get('/topic/:tid', wrap(Topic.getTopicById)); // 根据ID获取话题详情
router.patch('/topic/:tid/star_or_un', Auth.userRequired, wrap(Topic.starOrUnStar)); // 喜欢或者取消喜欢话题
router.patch('/topic/:tid/collect_or_un', Auth.userRequired, wrap(Topic.collectOrUnCollect)); // 收藏或者取消收藏话题

// // 回复
// router.post('/topic/:tid/reply', Auth.userRequired, wrap(Reply.createReply)); // 创建回复
// router.delete('/reply/:rid/delete', Auth.userRequired, wrap(Reply.deleteReply)); // 删除回复
// router.put('/reply/:rid/edit', Auth.userRequired, wrap(Reply.editReply)); // 编辑回复
// router.patch('/reply/:rid/up', Auth.userRequired, wrap(Reply.upReply)); // 回复点赞

// // 消息
// router.get('/notice/user', Auth.userRequired, wrap(Notice.getUserNotice)); // 获取用户消息
// router.get('/notice/system', Auth.userRequired, wrap(Notice.getSystemNotice)); // 获取系统消息

module.exports = router;
