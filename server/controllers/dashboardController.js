import Contact from '../models/Contact.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Testimonial from '../models/Testimonial.js';
import Newsletter from '../models/Newsletter.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Aggregate counts + recent enquiries for the dashboard
 * @route   GET /api/dashboard/stats
 * @access  authenticated
 */
export const getStats = asyncHandler(async (req, res) => {
  const [contacts, newContacts, services, projects, users, testimonials, subscribers, recent] =
    await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Service.countDocuments(),
      Project.countDocuments(),
      User.countDocuments(),
      Testimonial.countDocuments(),
      Newsletter.countDocuments({ status: 'subscribed' }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: {
      totals: { contacts, newContacts, services, projects, users, testimonials, subscribers },
      recent,
    },
  });
});

/**
 * @desc    Time-series + breakdown data for dashboard charts:
 *          enquiries per day (last 14 days) and enquiries by requested service.
 * @route   GET /api/dashboard/analytics
 * @access  authenticated
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const days = Math.min(90, Math.max(7, parseInt(req.query.days, 10) || 14));
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const [byDayRaw, byService] = await Promise.all([
    Contact.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Contact.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);

  // Fill in zero-count days so the chart has a continuous x-axis.
  const byDayMap = new Map(byDayRaw.map((d) => [d._id, d.count]));
  const byDay = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    byDay.push({ date: key, count: byDayMap.get(key) || 0 });
  }

  res.json({
    success: true,
    data: {
      byDay,
      byService: byService.map((s) => ({ service: s._id || 'General Inquiry', count: s.count })),
    },
  });
});
