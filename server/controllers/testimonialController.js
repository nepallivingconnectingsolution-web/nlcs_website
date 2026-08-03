import Testimonial from '../models/Testimonial.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Get active testimonials (public), optional ?featured=true
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getTestimonials = asyncHandler(async (req, res) => {
  const filter = { active: true };
  if (req.query.featured === 'true') filter.featured = true;

  const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

/**
 * @desc    List all testimonials, including inactive (admin)
 * @route   GET /api/testimonials/all
 * @access  Private
 */
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

/**
 * @desc    Create testimonial (admin)
 * @route   POST /api/testimonials
 * @access  Private
 */
export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

/**
 * @desc    Update testimonial (admin)
 * @route   PUT /api/testimonials/:id
 * @access  Private
 */
export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  res.json({ success: true, data: testimonial });
});

/**
 * @desc    Delete testimonial (admin)
 * @route   DELETE /api/testimonials/:id
 * @access  Private
 */
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  res.json({ success: true, message: 'Testimonial deleted' });
});
