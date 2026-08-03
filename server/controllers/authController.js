import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/validate.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail, resetPasswordTemplate } from '../utils/sendEmail.js';

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.active === false) {
    res.status(403);
    throw new Error('Your account has been deactivated. Contact a super admin.');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

/**
 * @desc    Request a password reset link by email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });

  // Always return the same generic response whether or not the account
  // exists — this stops the endpoint being used to discover valid admin
  // emails by trial and error.
  const genericResponse = {
    success: true,
    message: 'If an account exists for that email, a password reset link has been sent.',
  };

  if (!user || user.active === false) {
    return res.json(genericResponse);
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  const resetUrl = `${clientUrl}/admin/reset-password/${rawToken}`;

  const mail = await sendEmail({
    to: user.email,
    subject: 'Reset your NLCITS admin password',
    html: resetPasswordTemplate(user, resetUrl),
  });

  // In development (no SMTP configured), surface the link in the API
  // response so the flow is testable without a real mail server.
  if (!mail.sent && process.env.NODE_ENV !== 'production') {
    console.log(`[auth] Password reset link for ${user.email}: ${resetUrl}`);
    return res.json({ ...genericResponse, devResetUrl: resetUrl });
  }

  res.json(genericResponse);
});

/**
 * @desc    Reset password using a token from the emailed link
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    res.status(400);
    throw new Error('This reset link is invalid or has expired. Please request a new one.');
  }

  user.password = req.body.password; // pre-save hook hashes it
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Password updated — you are now signed in.',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});