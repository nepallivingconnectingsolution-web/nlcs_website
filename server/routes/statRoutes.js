import express from 'express';
import { body } from 'express-validator';
import { getStats, getAllStats, createStat, updateStat, deleteStat } from '../controllers/statController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const statValidators = [
  body('label').trim().notEmpty().withMessage('Label is required').isLength({ max: 60 }),
  body('value').isNumeric().withMessage('Value must be a number'),
  body('suffix').optional({ checkFalsy: true }).isLength({ max: 10 }).withMessage('Suffix must be 10 characters or fewer'),
];

router.get('/all', protect, authorize('admin', 'editor'), getAllStats);

router
  .route('/')
  .get(getStats)
  .post(protect, authorize('admin', 'editor'), statValidators, runValidation, createStat);

router
  .route('/:id')
  .put(protect, authorize('admin', 'editor'), updateStat)
  .delete(protect, authorize('admin'), deleteStat);

export default router;