import express from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const contactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
  body('service').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 5, max: 4000 })
    .withMessage('Message must be between 5 and 4000 characters'),
];

router
  .route('/')
  .post(contactValidators, runValidation, createContact)
  .get(protect, authorize('admin', 'editor'), getContacts);

router
  .route('/:id')
  .patch(protect, authorize('admin', 'editor'), updateContactStatus)
  .delete(protect, authorize('admin'), deleteContact);

export default router;
