const express = require('express');
const User = require('../controller/user');

const router = express.Router();

router.get('/info', User.getInfo);
router.post('/signin', User.signin);
router.post('/signup', User.signup);
router.post('/forget', User.forget);
router.get('/:id', User.getInfoById);

module.exports = router;
