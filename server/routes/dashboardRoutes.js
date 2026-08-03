import express from 'express';
import { getStats, getAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/analytics', protect, getAnalytics);

export default router;
