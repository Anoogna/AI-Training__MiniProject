import mongoose from 'mongoose';

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true },
    origin: {
      address: String,
      lat: Number,
      lng: Number,
    },
    destination: {
      address: String,
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['created', 'picked', 'in_transit', 'at_gate', 'delivered'],
      default: 'created',
    },
    statusTimeline: [statusEventSchema],
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eta: { type: Date },
    customerName: String,
    customerPhone: String,
    priority: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model('Shipment', shipmentSchema);
