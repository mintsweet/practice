const express = require('express');
const Common = require('../controller/common');

const router = express.Router();

router.get('/piccaptcha', Common.getPicCaptcha);
router.get('/msgcaptcha', Common.getMsgCaptcha);

module.exports = router;

