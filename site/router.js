const express = require('express');
// const Auth = require('./middleware/auth');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Captcha = require('./controllers/captcha');
const User = require('./controllers/user');
// const Topic = require('./controllers/topic');
// const Message = require('./controllers/message');

const router = express.Router();

// 首页
router.get('/', Site.index);

// 静态
router.get('/get_start', Static.getStart);
router.get('/api_introduction', Static.getApiIntroduction);
router.get('/about', Static.getAbout);

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
router.get('/users/top100', User.renderTop100);
router.get('/user/:uid', User.renderInfo);
router.get('/user/:uid/likes', User.renderLikes);
router.get('/user/:uid/collections', User.renderCollections);
router.get('/user/:uid/replies', User.renderReplies);
router.get('/user/:uid/follower', User.renderFollower);
router.get('/user/:uid/following', User.renderFolloing);

// 话题
// router.get('/topic/create', Auth.userRequired, Topic.renderCreate);
// router.post('/topic/create', Auth.userRequired, Topic.createTopic);
// router.get('/topics/:id', Topic.renderDetail);
// router.get('/topics/:id/edit', Auth.userRequired, Topic.renderEdit);

// // 消息
// router.get('/message/user', Auth.userRequired, Message.renderMessage);
// router.get('/message/system', Auth.userRequired, Message.renderSystemMessage);

module.exports = router;
