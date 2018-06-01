const express = require('express');
const Home = require('./controllers/home');
const User = require('./controllers/user');
const Topic = require('./controllers/topic');
const Reply = require('./controllers/reply');

const router = express.Router();

// 首页
router.get('/', Home.index);
// 新手入门
router.get('/get_start', Home.getStart);
// API说明
router.get('/api_introduction', Home.apiIntroduction);
// 关于
router.get('/about', Home.about);

// 用户
router.get('/signin', User.renderSignin); // 渲染登录页
router.post('/signin', User.signin); // 登录

// 话题
router.get('/topic/create', Topic.renderCreate); // 渲染新建话题页

module.exports = router;
