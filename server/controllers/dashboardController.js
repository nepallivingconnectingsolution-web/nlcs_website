import Contact from '../models/Contact.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc    Aggregate counts + recent enquiries for the dashboard
 * @route   GET /api/dashboard/stats
 * @access  authenticated
 */
export const getStats = asyncHandler(async (req, res) => {
  const [contacts, newContacts, services, projects, users, recent] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Service.countDocuments(),
    Project.countDocuments(),
    User.countDocuments(),
    Contact.find().sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    success: true,
    data: {
      totals: { contacts, newContacts, services, projects, users },
      recent,
    },
  });
});
