import mongoose from 'mongoose';

const deliveryTaskSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    priority: { type: Number, default: 1 },
    windowStart: Date,
    windowEnd: Date,
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed'],
      default: 'pending',
    },
    botSuggested: { type: Boolean, default: false },
    botReason: String,
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryTask', deliveryTaskSchema);
