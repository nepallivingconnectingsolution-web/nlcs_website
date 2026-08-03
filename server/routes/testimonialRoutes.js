import express from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const testimonialValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('quote').trim().notEmpty().withMessage('Quote is required').isLength({ max: 600 }),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
];

router.get('/all', protect, authorize('admin', 'editor'), getAllTestimonials);

router
  .route('/')
  .get(getTestimonials)
  .post(protect, authorize('admin', 'editor'), testimonialValidators, runValidation, createTestimonial);

router
  .route('/:id')
  .put(protect, authorize('admin', 'editor'), updateTestimonial)
  .delete(protect, authorize('admin'), deleteTestimonial);

export default router;
