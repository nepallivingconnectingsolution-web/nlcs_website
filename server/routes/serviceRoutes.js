import express from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const serviceValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
];

router
  .route('/')
  .get(getServices)
  .post(protect, authorize('admin', 'editor'), serviceValidators, runValidation, createService);

router.get('/:slug', getServiceBySlug);

router
  .route('/:id')
  .put(protect, authorize('admin', 'editor'), updateService)
  .delete(protect, authorize('admin'), deleteService);

export default router;
