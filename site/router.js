const express = require('express');
const Site = require('./controllers/site');
const Static = require('./controllers/static');

const router = express.Router();

// 首页
router.get('/', Site.index);

// 静态
router.get('/get_start', Static.getStart);
router.get('/api_introduction', Static.apiIntroduction);
router.get('/about', Static.about);

module.exports = router;
