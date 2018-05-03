import express from 'express';
import Post from '../controller/post';

const router = express.Router();

router.get('/top', Post.getPostTop);
router.get('/list', Post.getPostList);

export default router;