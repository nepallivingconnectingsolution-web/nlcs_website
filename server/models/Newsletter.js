import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
    source: { type: String, default: 'footer' }, // where on the site they signed up
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);
