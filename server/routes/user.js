import express from 'express';
import User from '../controller/user';

const router = express.Router();

router.get('/info', User.getInfo);
router.post('/signin', User.signin);
router.post('/signup', User.signup);
router.post('/forget', User.forget);

export default router;
