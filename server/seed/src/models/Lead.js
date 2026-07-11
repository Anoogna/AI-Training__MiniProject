import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['demo_request', 'newsletter', 'contact'],
      required: true,
      index: true,
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, required: true, index: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: 'landing_page' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'closed'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ type: 1, email: 1, createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
