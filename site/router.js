const express = require('express');
const Auth = require('./middleware/auth');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Common = require('./controllers/common');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Exception = require('./controllers/exception');

const router = express.Router();

// 首页
router.get('/', Site.index);

// 静态
router.get('/get_start', Static.getStart);
router.get('/api_introduction', Static.getApiIntroduction);
router.get('/about', Static.getAbout);
router.get('/markdown_style', Static.getMarkdown);

// 公共
router.get('/common/piccaptcha', Common.getPicCaptcha);
router.get('/common/msgcaptcha', Common.getMsgCaptcha);

// 用户
router.get('/signup', User.renderSignup);
router.post('/signup', User.signup);
router.get('/signin', User.renderSignin);
router.post('/signin', User.signin);
router.get('/forget_pass', User.renderForgetPass);
router.post('/forget_pass', User.forgetPass);
router.get('/signout', User.signout);
router.get('/user/:nickname', User.renderInfo);

// 主题
router.get('/topic/create', Auth.userRequired, Topic.renderCreate);
router.post('/topic/create', Auth.userRequired, Topic.createTopic);

// 其他
router.get('/exception/403', Exception.render403);
router.get('/exception/500', Exception.render500);

module.exports = router;
