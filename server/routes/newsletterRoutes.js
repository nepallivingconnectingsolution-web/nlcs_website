import express from 'express';
import { body } from 'express-validator';
import { subscribe, unsubscribe, getSubscribers } from '../controllers/newsletterController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const emailValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

router
  .route('/')
  .post(emailValidator, runValidation, subscribe)
  .get(protect, authorize('admin'), getSubscribers);

router.post('/unsubscribe', emailValidator, runValidation, unsubscribe);

export default router;
