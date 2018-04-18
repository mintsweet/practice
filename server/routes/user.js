import express from 'express';
import User from '../controller/user';

const router = express.Router();

router.get('/signin', User.signin);

export default router;

