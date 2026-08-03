import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { uploadSingle, processImage } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'editor'), uploadSingle, processImage, uploadImage);

export default router;
