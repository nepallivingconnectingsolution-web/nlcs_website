import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { runValidation } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const projectValidators = [body('title').trim().notEmpty().withMessage('Title is required')];

router
  .route('/')
  .get(getProjects)
  .post(protect, authorize('admin', 'editor'), projectValidators, runValidation, createProject);

router.get('/:slug', getProjectBySlug);

router
  .route('/:id')
  .put(protect, authorize('admin', 'editor'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

export default router;
