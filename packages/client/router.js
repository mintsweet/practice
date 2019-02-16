const express = require('express');
const Site = require('./controllers/site');
const Static = require('./controllers/static');
const Aider = require('./controllers/aider');
const User = require('./controllers/user');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

router.get('/', wrap(Site.renderIndex));
router.get('/static/norms', wrap(Static.renderNormsDoc));
router.get('/aider/captcha', wrap(Aider.getCaptcha));
router.get('/signup', wrap(User.renderSignup));
router.post('/signup', wrap(User.signup));
router.get('/signin', wrap(User.renderSignin));
router.post('/signin', wrap(User.signin));
router.get('/forget_pass', wrap(User.renderForgetPass));
router.post('/forget_pass', wrap(User.forgetPass));
router.get('/signout', wrap(User.signout));
router.get('/users/top100', wrap(User.renderUsersTop100));
router.get('/user/:uid', wrap(User.renderUserInfo));

module.exports = router;
