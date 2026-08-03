import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, default: '', trim: true, maxlength: 140 }, // e.g. "Founder, Himalayan Treks"
    company: { type: String, default: '', trim: true, maxlength: 140 },
    quote: { type: String, required: true, trim: true, maxlength: 600 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: String, default: '' }, // uploaded image URL
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model('Testimonial', testimonialSchema);
