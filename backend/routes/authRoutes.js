import express from 'express';
import { getProfile, loginUser, registerUser, updatePassword } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.put('/update-password', authenticate, updatePassword);
router.get('/get-profile', authenticate, getProfile);

export default router;
