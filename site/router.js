const express = require('express');
const Site = require('./controllers/site');

const router = express.Router();

// 首页
router.get('/', Site.index);

module.exports = router;
