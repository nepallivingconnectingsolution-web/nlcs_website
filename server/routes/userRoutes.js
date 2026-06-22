import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user-management routes require authentication.
router.use(protect);

const createValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router
  .route('/')
  .get(authorize('superadmin', 'admin'), getUsers)
  .post(authorize('superadmin', 'admin'), createValidators, runValidation, createUser);

router
  .route('/:id')
  .put(authorize('superadmin', 'admin'), updateUser)
  .delete(authorize('superadmin'), deleteUser);

export default router;
