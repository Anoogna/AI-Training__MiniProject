import mongoose from 'mongoose';

const trafficAlertSchema = new mongoose.Schema(
  {
    segment: String,
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    delayMinutes: Number,
    suggestedReroute: [{ lat: Number, lng: Number }],
    affectedShipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' }],
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('TrafficAlert', trafficAlertSchema);
