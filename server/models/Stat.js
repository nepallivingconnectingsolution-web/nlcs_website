import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 60 }, // e.g. "Projects Delivered"
    value: { type: Number, required: true }, // e.g. 60
    suffix: { type: String, default: '', trim: true, maxlength: 10 }, // e.g. "+", "%", "/7"
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

statSchema.index({ order: 1, createdAt: 1 });

export default mongoose.model('Stat', statSchema);