import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Upload + optimize an image, return its URL
 * @route   POST /api/uploads
 * @access  Private (admin, editor)
 */
export const uploadImage = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      url: req.uploadedUrl,
    },
  });
});
