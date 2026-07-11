import GateLog from '../models/GateLog.js';
import Vehicle from '../models/Vehicle.js';
import { updateShipmentStatus } from './shipmentService.js';

export const registerGateEvent = async ({
  direction,
  lane,
  shipmentId,
  vehicleId,
  source,
  operatorId,
  io,
}) => {
  const log = await GateLog.create({
    direction,
    lane,
    shipment: shipmentId,
    vehicle: vehicleId,
    source: source || 'manual',
    operator: operatorId,
  });

  if (vehicleId) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      status: direction === 'entry' ? 'at_gate' : 'in_transit',
    });
  }

  if (shipmentId) {
    const status = direction === 'entry' ? 'at_gate' : 'in_transit';
    await updateShipmentStatus(
      shipmentId,
      status,
      `Gate ${direction} at lane ${lane}`,
      io
    );
  }

  if (io) {
    io.emit('gate:event', log);
  }

  return log;
};

export const listGateLogs = () =>
  GateLog.find()
    .populate('vehicle')
    .populate('shipment')
    .populate('operator', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
