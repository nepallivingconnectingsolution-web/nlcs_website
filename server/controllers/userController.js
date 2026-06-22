import User from '../models/User.js';
import { asyncHandler } from '../middleware/validate.js';

/* Role hierarchy: a user may only assign/manage roles at or below their own.
   superadmin > admin > editor */
const RANK = { superadmin: 3, admin: 2, editor: 1 };
const canManage = (actor, targetRole) => RANK[actor.role] >= RANK[targetRole];

/**
 * @desc    List all users
 * @route   GET /api/users
 * @access  superadmin, admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

/**
 * @desc    Create a user
 * @route   POST /api/users
 * @access  superadmin (any role), admin (editor only)
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'editor' } = req.body;

  if (!RANK[role]) {
    res.status(400);
    throw new Error('Invalid role');
  }
  if (!canManage(req.user, role)) {
    res.status(403);
    throw new Error(`You cannot create a user with the "${role}" role`);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('A user with that email already exists');
  }

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active },
  });
});

/**
 * @desc    Update a user (name, role, active, optional password)
 * @route   PUT /api/users/:id
 * @access  superadmin, admin (with limits)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id).select('+password');
  if (!target) {
    res.status(404);
    throw new Error('User not found');
  }

  // You can only manage users at or below your own rank.
  if (!canManage(req.user, target.role)) {
    res.status(403);
    throw new Error('You cannot manage a user of equal or higher rank');
  }

  const { name, email, role, active, password } = req.body;

  // Role change rules
  if (role && role !== target.role) {
    if (!canManage(req.user, role)) {
      res.status(403);
      throw new Error(`You cannot assign the "${role}" role`);
    }
    // Don't allow removing the last superadmin
    if (target.role === 'superadmin' && role !== 'superadmin') {
      const supers = await User.countDocuments({ role: 'superadmin' });
      if (supers <= 1) {
        res.status(400);
        throw new Error('Cannot demote the last super admin');
      }
    }
    target.role = role;
  }

  if (typeof name === 'string') target.name = name;
  if (typeof email === 'string') target.email = email.toLowerCase();
  if (typeof active === 'boolean') {
    // Don't allow deactivating yourself or the last superadmin
    if (String(target._id) === String(req.user._id) && active === false) {
      res.status(400);
      throw new Error('You cannot deactivate your own account');
    }
    target.active = active;
  }
  if (password) target.password = password; // re-hashed by model pre-save

  await target.save();
  res.json({
    success: true,
    data: { id: target._id, name: target.name, email: target.email, role: target.role, active: target.active },
  });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  superadmin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(target._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  if (!canManage(req.user, target.role)) {
    res.status(403);
    throw new Error('You cannot delete a user of equal or higher rank');
  }
  if (target.role === 'superadmin') {
    const supers = await User.countDocuments({ role: 'superadmin' });
    if (supers <= 1) {
      res.status(400);
      throw new Error('Cannot delete the last super admin');
    }
  }

  await target.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});
