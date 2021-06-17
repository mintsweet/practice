const express = require('express');
const Site = require('./controllers/site');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Reply = require('./controllers/reply');
const Notice = require('./controllers/notice');
const Auth = require('./middlewares/auth');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

router.get('/', wrap(Site.renderIndex)); // 首页
router.get('/captcha', wrap(User.getCaptcha)); // 获取图形验证码
router.get('/signup', wrap(User.renderSignup)); // 注册页
router.post('/signup', wrap(User.signup)); // 注册
router.get('/signin', wrap(User.renderSignin)); // 登录页
router.post('/signin', wrap(User.signin)); // 登录
router.get('/signout', wrap(User.signout)); // 退出登录
router.get('/forget_pass', wrap(User.renderForgetPass)); // 忘记密码页
router.post('/forget_pass', wrap(User.forgetPass)); // 忘记密码
router.get('/setting', Auth.userRequired, wrap(User.renderSetting)); // 设置页
router.post('/setting', Auth.userRequired, wrap(User.setting)); // 更新设置
router.get('/update_pass', Auth.userRequired, wrap(User.renderUpdatePass)); // 修改密码页
router.post('/update_pass', Auth.userRequired, wrap(User.updatePass)); // 修改密码

// 用户
router.get('/users/top100', wrap(User.renderUsersTop100)); // 获取积分榜前一百的用户
router.get('/user/:uid', wrap(User.renderUserInfo)); // 获取用户详情
router.get('/user/:uid/create', wrap(User.renderUserCreate)); // 获取用户主题
router.get('/user/:uid/like', wrap(User.renderUserLike)); // 获取用户点赞
router.get('/user/:uid/collect', wrap(User.renderUserCollect)); // 获取用户收藏
router.get('/user/:uid/follower', wrap(User.renderUserFollower)); // 获取用户粉丝
router.get('/user/:uid/following', wrap(User.renderUserFollowing)); // 获取用户关注
router.post('/user/:uid/follow_or_un', wrap(User.followOrUn)); // 关注或者取消关注用户

// 话题
router.get('/topics/create', Auth.userRequired, wrap(Topic.renderCreate));
router.post('/topics/create', Auth.userRequired, wrap(Topic.createTopic));
router.get('/topic/:tid/delete', Auth.userRequired, wrap(Topic.deleteTopic));
router.get('/topic/:tid/edit', Auth.userRequired, wrap(Topic.renderEdit));
router.post('/topic/:tid/edit', Auth.userRequired, wrap(Topic.editTopic));
router.get('/topics/search', wrap(Topic.renderSearch));
router.get('/topic/:tid', wrap(Topic.renderDetail));
router.post('/topic/:tid/like_or_un', wrap(Topic.likeOrUn));
router.post('/topic/:tid/collect_or_un', wrap(Topic.collectOrUn));

// 回复
router.post('/topic/:tid/reply', wrap(Reply.createReply));
router.post('/reply/:rid/delete', wrap(Reply.deleteReply));
router.post('/reply/:rid/edit', wrap(Reply.editReply));
router.post('/reply/:rid/up', wrap(Reply.upReplyOrUn));

// 消息
router.get('/notice/user', Auth.userRequired, wrap(Notice.renderNoticeUser));
router.get('/notice/system', Auth.userRequired, wrap(Notice.renderNoticeSystem));

module.exports = router;
