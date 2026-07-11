import Shipment from '../models/Shipment.js';

export const addStatusEvent = (shipment, status, note) => {
  shipment.status = status;
  shipment.statusTimeline.push({ status, note, timestamp: new Date() });
};

export const updateShipmentStatus = async (shipmentId, status, note, io) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate('assignedVehicle')
    .populate('assignedDriver', 'name email');
  if (!shipment) return null;

  addStatusEvent(shipment, status, note);
  await shipment.save();

  if (io) {
    io.emit('shipment:updated', shipment);
  }
  return shipment;
};

export const getShipmentByTrackingId = (trackingId) =>
  Shipment.findOne({ trackingId: trackingId.toUpperCase() })
    .populate('assignedVehicle')
    .populate('assignedDriver', 'name email');

export const listShipments = (filter = {}) =>
  Shipment.find(filter)
    .populate('assignedVehicle')
    .populate('assignedDriver', 'name email')
    .sort({ createdAt: -1 });
