const express = require('express');
const Post = require('../controller/post');

const router = express.Router();

router.get('/top', Post.getTop);
router.get('/list', Post.getList);
router.get('/:id', Post.getInfoById)
router.post('/:id/like', Post.likePost);
router.post('/:id/comment', Post.commentPost);

module.exports = router;