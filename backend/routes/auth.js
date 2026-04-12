import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/admin/all', protect, admin, getAllUsers);

export default router;
