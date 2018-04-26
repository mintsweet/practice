import express from 'express';
import User from '../controller/user';

const router = express.Router();

router.get('/info', User.getInfo);
router.post('/signup', User.signup);

export default router;

