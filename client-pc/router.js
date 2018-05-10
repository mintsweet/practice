const express = require('express');
const Home = require('./controllers/home');
const User = require('./controllers/user');


const router = express.Router();

// Home
router.get('/', Home.index);

// User
router.get('/user/:name', User.index); // 用户主页


module.exports = router;
