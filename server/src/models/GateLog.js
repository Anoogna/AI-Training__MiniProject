import mongoose from 'mongoose';

const gateLogSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    lane: { type: Number, required: true },
    direction: { type: String, enum: ['entry', 'exit'], required: true },
    source: { type: String, enum: ['voice', 'manual', 'kiosk'], default: 'manual' },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('GateLog', gateLogSchema);
