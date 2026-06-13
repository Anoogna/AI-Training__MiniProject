import mongoose from 'mongoose';

const routePlanSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    waypoints: [{ lat: Number, lng: Number }],
    optimizedPath: [{ lat: Number, lng: Number }],
    distanceMeters: Number,
    durationSeconds: Number,
    trafficScore: { type: Number, default: 0 },
    lastRecalculatedAt: Date,
    baselineDurationSeconds: Number,
  },
  { timestamps: true }
);

export default mongoose.model('RoutePlan', routePlanSchema);
