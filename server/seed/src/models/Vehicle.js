import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true, unique: true },
    plate: { type: String, required: true },
    type: { type: String, default: 'truck' },
    status: {
      type: String,
      enum: ['idle', 'in_transit', 'at_gate', 'maintenance'],
      default: 'idle',
    },
    currentLocation: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 },
    },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
