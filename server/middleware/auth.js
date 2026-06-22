import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './validate.js';

/* Verify a Bearer JWT and attach the user to req.user. */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }
  req.user = user;
  next();
});

/* Restrict a route to specific roles. superadmin is always allowed. */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || (req.user.role !== 'superadmin' && !roles.includes(req.user.role))) {
      res.status(403);
      return next(new Error('Forbidden: insufficient permissions'));
    }
    next();
  };
