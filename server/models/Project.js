import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'Web Development', trim: true },
    client: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true, maxlength: 500 },
    description: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    url: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1, createdAt: -1 });

projectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Project', projectSchema);
