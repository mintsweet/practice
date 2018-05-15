const express = require('express');
const Auth = require('./middleware/auth');
const User = require('./controller/user');
const Common = require('./controller/common');

const router = express.Router();

// 公共
router.get('/common/piccaptcha', Common.getPicCaptcha);
router.get('/common/msgcaptcha', Common.getMsgCaptcha);

// 用户
router.get('/user/info', User.getInfo);
router.post('/user/signin', User.signin);
router.post('/user/signup', User.signup);
router.post('/user/forget', User.forget);
router.get('/user/:nickname', User.getInfoById);

module.exports = router;