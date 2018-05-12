const express = require('express');
const Home = require('./controllers/home');

const router = express.Router();

// Home
router.get('/', Home.index);



module.exports = router;
