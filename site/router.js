const express = require('express');
const Auth = require('./middlewares/auth');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Captcha = require('./controllers/captcha');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Notice = require('./controllers/notice');
const Reply = require('./controllers/reply');

const router = express.Router();

/*
* 控制器中带 render 字段皆为页面渲染路由
*/

// 首页
router.get('/', Site.index);

// 静态
router.get('/start', Static.renderStartDoc);
router.get('/api', Static.renderApiDoc);
router.get('/about', Static.renderAboutDoc);

// 验证码
router.get('/captcha/pic', Captcha.getPicCaptcha);
router.get('/captcha/sms', Captcha.getSmsCaptcha);

// 用户
router.get('/signup', User.renderSignup);
router.post('/signup', User.signup);
router.get('/signin', User.renderSignin);
router.post('/signin', User.signin);
router.get('/forget_pass', User.renderForgetPass);
router.post('/forget_pass', User.forgetPass);
router.get('/signout', User.signout);
router.get('/users/top100', User.renderUserTop100);
router.get('/user/:uid', User.renderUserInfo);
router.get('/user/:uid/stars', User.renderUserStars);
router.get('/user/:uid/collections', User.renderUserCollections);
router.get('/user/:uid/replies', User.renderUserReplies);
router.get('/user/:uid/follower', User.renderUserFollower);
router.get('/user/:uid/following', User.renderUserFolloing);
router.get('/setting', Auth.userRequired, User.renderSetting);
router.post('/setting', Auth.userRequired, User.setting);
router.get('/update_pass', Auth.userRequired, User.renderUpdatePass);
router.post('/update_pass', Auth.userRequired, User.updatePass);
router.get('/user/:uid/follow_or_un', Auth.userRequired, User.followOrUnfollowUser);

// 话题
router.get('/topics/create', Auth.userRequired, Topic.renderCreateTopic);
router.post('/topics/create', Auth.userRequired, Topic.createTopic);
router.get('/topics/search', Topic.renderSearch);
router.get('/topic/:tid', Topic.renderDetail);
router.get('/topic/:tid/star_or_un', Topic.starOrUnstarTopic);
router.get('/topic/:tid/collect_or_un', Topic.collectOrUncollectTopic);

// 回复
router.post('/topic/:tid/reply', Reply.createReply);

// 消息
router.get('/notice/user', Auth.userRequired, Notice.renderNoticeUser);
router.get('/notice/system', Auth.userRequired, Notice.renderNoticeSystem);

module.exports = router;
