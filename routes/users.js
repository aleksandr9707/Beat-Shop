import express from 'express';
import * as userController from '../controllers/users.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

export default router;
