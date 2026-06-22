import { validationResult } from 'express-validator';

/* Wrap async route handlers so thrown errors reach the error middleware
   without try/catch in every controller. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* Collect express-validator results and respond 422 on failure. */
export const runValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
