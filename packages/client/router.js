const express = require('express');
const passport = require('passport');
const Site = require('./controllers/site');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Reply = require('./controllers/reply');
const Notice = require('./controllers/notice');
const Auth = require('./middlewares/auth');
const { ALLOW_SIGNUP } = require('../../config');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

router.get('/', wrap(Site.renderIndex));

if (ALLOW_SIGNUP) {
  router.get('/signup', wrap(User.renderSignup));
  router.post('/signup', wrap(User.signup));
} else {
  router.get('/auth/github', passport.authenticate('github'));
  router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/signin' }), User.github);
}

router.get('/captcha', wrap(Site.getCaptcha));
router.get('/send_mail', wrap(User.sendMail));
router.get('/signin', wrap(User.renderSignin));
router.post('/signin', wrap(User.signin));
router.get('/signout', wrap(User.signout));
router.get('/forget_pass', wrap(User.renderForgetPass));
router.post('/forget_pass', wrap(User.forgetPass));
router.get('/setting', Auth.userRequired, wrap(User.renderSetting));
router.post('/setting', Auth.userRequired, wrap(User.setting));
router.get('/update_pass', Auth.userRequired, wrap(User.renderUpdatePass));
router.post('/update_pass', Auth.userRequired, wrap(User.updatePass));

// 用户
router.get('/users/top100', wrap(User.renderUsersTop100));
router.get('/user/:uid', wrap(User.renderUserInfo));
router.get('/user/:uid/create', wrap(User.renderUserCreate));
router.get('/user/:uid/like', wrap(User.renderUserLike));
router.get('/user/:uid/collect', wrap(User.renderUserCollect));
router.get('/user/:uid/follower', wrap(User.renderUserFollower));
router.get('/user/:uid/following', wrap(User.renderUserFollowing));
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
