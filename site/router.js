const express = require('express');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const User = require('./controllers/user');

const router = express.Router();

// 首页
router.get('/', Site.index);

// 静态
router.get('/get_start', Static.getStart);
router.get('/api_introduction', Static.getApiIntroduction);
router.get('/about', Static.getAbout);
router.get('/markdown_style', Static.getMarkdown);

// 用户
router.get('/signup', User.renderSignup);
router.get('/signin', User.renderSignin);
router.post('/signin', User.signin);
router.get('/signout', User.signout);

module.exports = router;
