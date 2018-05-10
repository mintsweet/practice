const express = require('express');
const Post = require('../controller/post');

const router = express.Router();

router.get('/top', Post.getTop);
router.get('/list', Post.getList);
router.get('/:id', Post.getInfoById)
router.get('/:id/like', Post.likePost);
router.get('/:id/collect', Post.collectPost);
router.get('/:id/comment', Post.commentPost);

module.exports = router;