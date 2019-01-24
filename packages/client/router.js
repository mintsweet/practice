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
router.get('/signin', wrap(User.renderSignin));

module.exports = router;
