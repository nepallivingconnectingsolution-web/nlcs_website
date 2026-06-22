import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Get active projects (public), optional ?featured=true & ?category=
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req, res) => {
  const filter = { active: true };
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.category) filter.category = req.query.category;

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

/**
 * @desc    Get one project by slug (public)
 * @route   GET /api/projects/:slug
 * @access  Public
 */
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, active: true });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: project });
});

/**
 * @desc    Create project (admin)
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

/**
 * @desc    Update project (admin)
 * @route   PUT /api/projects/:id
 * @access  Private
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: project });
});

/**
 * @desc    Delete project (admin)
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, message: 'Project deleted' });
});
