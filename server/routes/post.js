import express from 'express';
import Post from '../controller/post';

const router = express.Router();

router.get('/top', Post.getTop);
router.get('/list', Post.getList);
router.get('/:id', Post.getInfoById)
router.post('/:id/like', Post.likePost);
router.post('/:id/comment', Post.commentPost);

export default router;