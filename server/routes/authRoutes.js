import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { runValidation } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Brute-force protection: a handful of attempts per IP per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// Separate, slightly looser limiter for password-reset requests — still
// tight enough to prevent using the endpoint to spam an inbox.
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required'),
  ],
  runValidation,
  login
);

router.post(
  '/forgot-password',
  resetLimiter,
  [body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail()],
  runValidation,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  resetLimiter,
  [body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  runValidation,
  resetPassword
);

router.get('/me', protect, getMe);

export default router;