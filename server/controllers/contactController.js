import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/validate.js';
import { sendEmail, contactNotificationTemplate } from '../utils/sendEmail.js';

/**
 * @desc    Submit a contact enquiry (public)
 * @route   POST /api/contacts
 * @access  Public
 */
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    service,
    message,
    meta: {
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
    },
  });

  // Fire-and-await email but never fail the request because of it.
  const mail = await sendEmail({
    subject: `New enquiry from ${contact.name}`,
    html: contactNotificationTemplate(contact),
    replyTo: contact.email,
  });

  res.status(201).json({
    success: true,
    message: "Thanks! Your message has been received — we'll get back to you within one business day.",
    emailed: mail.sent,
    data: { id: contact._id },
  });
});

/**
 * @desc    List enquiries (admin)
 * @route   GET /api/contacts
 * @access  Private
 */
export const getContacts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Contact.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: items.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: items,
  });
});

/**
 * @desc    Update enquiry status (admin)
 * @route   PATCH /api/contacts/:id
 * @access  Private
 */
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  res.json({ success: true, data: contact });
});

/**
 * @desc    Delete enquiry (admin)
 * @route   DELETE /api/contacts/:id
 * @access  Private
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  res.json({ success: true, message: 'Enquiry deleted' });
});
