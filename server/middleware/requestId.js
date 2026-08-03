import crypto from 'crypto';

/* Attach a short unique id to every request (visible in prod logs and
   returned as X-Request-Id) so a user-reported issue can be traced
   through the logs. */
export const requestId = (req, res, next) => {
  req.id = crypto.randomBytes(6).toString('hex');
  res.setHeader('X-Request-Id', req.id);
  next();
};
