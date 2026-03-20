import express from 'express';
import upload from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';
import {
  register,
  login,
  refreshToken,
  logout,
  googleAuth,
  facebookAuth,
  getProfile,
  updateProfile,
  updatePushToken,
  deactivateAccount,
} from '../controllers/authController.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/oauth/google', googleAuth);
router.post('/oauth/facebook', facebookAuth);

// Protected
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/push-token', protect, updatePushToken);
router.post('/logout', protect, logout);
router.delete('/deactivate', protect, deactivateAccount);

export default router;