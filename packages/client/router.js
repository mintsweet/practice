const express = require('express');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Aider = require('./controllers/aider');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Notice = require('./controllers/notice');
const Auth = require('./middlewares/auth');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

// 首页
router.get('/', wrap(Site.renderIndex));

// 静态
router.get('/static/norms', wrap(Static.renderNormsDoc));

// 辅助
router.get('/aider/captcha', wrap(Aider.getCaptcha));

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

// 消息
router.get('/notice/user', Auth.userRequired, wrap(Notice.renderNoticeUser));
router.get('/notice/system', Auth.userRequired, wrap(Notice.renderNoticeSystem));

module.exports = router;
