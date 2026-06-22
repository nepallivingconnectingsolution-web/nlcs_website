import Service from '../models/Service.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Get active services (public)
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: services.length, data: services });
});

/**
 * @desc    Get one service by slug (public)
 * @route   GET /api/services/:slug
 * @access  Public
 */
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, active: true });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, data: service });
});

/**
 * @desc    Create service (admin)
 * @route   POST /api/services
 * @access  Private
 */
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

/**
 * @desc    Update service (admin)
 * @route   PUT /api/services/:id
 * @access  Private
 */
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, data: service });
});

/**
 * @desc    Delete service (admin)
 * @route   DELETE /api/services/:id
 * @access  Private
 */
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, message: 'Service deleted' });
});
