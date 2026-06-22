import express from 'express';
import { body } from 'express-validator';
import { login, getMe } from '../controllers/authController.js';
import { runValidation } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required'),
  ],
  runValidation,
  login
);

router.get('/me', protect, getMe);

export default router;
