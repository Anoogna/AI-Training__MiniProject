import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'dispatcher', 'driver', 'warehouse', 'gate'],
      required: true,
    },
    driverId: { type: String },
    warehouseId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
