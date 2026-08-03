import Newsletter from '../models/Newsletter.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Subscribe an email to the newsletter (public, upsert-safe)
 * @route   POST /api/newsletter
 * @access  Public
 */
export const subscribe = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase().trim();

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'subscribed';
      await existing.save();
    }
    return res.json({ success: true, message: "You're already on the list — thanks for sticking around!" });
  }

  await Newsletter.create({
    email,
    source: req.body.source || 'footer',
    meta: { ip: req.ip, userAgent: req.headers['user-agent'] || '' },
  });

  res.status(201).json({ success: true, message: 'Subscribed! Watch your inbox for updates.' });
});

/**
 * @desc    Unsubscribe (public — used by the link in emails)
 * @route   POST /api/newsletter/unsubscribe
 * @access  Public
 */
export const unsubscribe = asyncHandler(async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  await Newsletter.findOneAndUpdate({ email }, { status: 'unsubscribed' });
  res.json({ success: true, message: "You've been unsubscribed." });
});

/**
 * @desc    List subscribers (admin)
 * @route   GET /api/newsletter
 * @access  Private
 */
export const getSubscribers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(200, parseInt(req.query.limit, 10) || 50);

  const [items, total] = await Promise.all([
    Newsletter.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Newsletter.countDocuments(),
  ]);

  res.json({ success: true, count: items.length, total, page, pages: Math.ceil(total / limit), data: items });
});
