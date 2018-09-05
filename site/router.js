const express = require('express');
const Auth = require('./middlewares/auth');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Aider = require('./controllers/aider');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Notice = require('./controllers/notice');
const Reply = require('./controllers/reply');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

/*
* 控制器中带 render 字段皆为页面渲染路由
*/

// 首页
router.get('/', wrap(Site.renderIndex));

// 静态
router.get('/quick_start', wrap(Static.renderQuickStartDoc));
router.get('/api_doc', wrap(Static.renderApiDoc));
router.get('/about', wrap(Static.renderAboutDoc));

// 验证码
router.get('/aider/captcha', wrap(Aider.getCaptcha));
router.get('/aider/sms_code', wrap(Aider.getSmsCode));

// 用户
router.get('/signup', wrap(User.renderSignup));
router.post('/signup', wrap(User.signup));
router.get('/signin', wrap(User.renderSignin));
router.post('/signin', wrap(User.signin));
router.get('/forget_pass', wrap(User.renderForgetPass));
router.post('/forget_pass', wrap(User.forgetPass));
router.get('/signout', wrap(User.signout));
router.get('/users/top100', wrap(User.renderUsersTop100));
router.get('/user/:uid', wrap(User.renderUserInfo));
router.get('/user/:uid/create', wrap(User.renderUserCreate));
router.get('/user/:uid/like', wrap(User.renderUserLike));
router.get('/user/:uid/collect', wrap(User.renderUserCollect));
router.get('/user/:uid/follower', wrap(User.renderUserFollower));
router.get('/user/:uid/following', wrap(User.renderUserFollowing));
router.get('/setting', Auth.userRequired, wrap(User.renderSetting));
router.post('/setting', Auth.userRequired, wrap(User.setting));
router.get('/update_pass', Auth.userRequired, wrap(User.renderUpdatePass));
router.post('/update_pass', Auth.userRequired, wrap(User.updatePass));
router.post('/user/:uid/follow_or_un', wrap(User.followOrUn));

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
