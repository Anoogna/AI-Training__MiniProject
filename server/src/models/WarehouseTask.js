import mongoose from 'mongoose';

const warehouseTaskSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['pick', 'load', 'scan'], required: true },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('WarehouseTask', warehouseTaskSchema);
