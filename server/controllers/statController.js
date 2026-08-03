import Stat from '../models/Stat.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Get active stats, in display order (public)
 * @route   GET /api/stats
 * @access  Public
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await Stat.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: stats.length, data: stats });
});

/**
 * @desc    List all stats, including inactive (admin)
 * @route   GET /api/stats/all
 * @access  Private
 */
export const getAllStats = asyncHandler(async (req, res) => {
  const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: stats.length, data: stats });
});

/**
 * @desc    Create a stat (admin)
 * @route   POST /api/stats
 * @access  Private
 */
export const createStat = asyncHandler(async (req, res) => {
  const stat = await Stat.create(req.body);
  res.status(201).json({ success: true, data: stat });
});

/**
 * @desc    Update a stat (admin)
 * @route   PUT /api/stats/:id
 * @access  Private
 */
export const updateStat = asyncHandler(async (req, res) => {
  const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!stat) {
    res.status(404);
    throw new Error('Stat not found');
  }
  res.json({ success: true, data: stat });
});

/**
 * @desc    Delete a stat (admin)
 * @route   DELETE /api/stats/:id
 * @access  Private
 */
export const deleteStat = asyncHandler(async (req, res) => {
  const stat = await Stat.findByIdAndDelete(req.params.id);
  if (!stat) {
    res.status(404);
    throw new Error('Stat not found');
  }
  res.json({ success: true, message: 'Stat deleted' });
});