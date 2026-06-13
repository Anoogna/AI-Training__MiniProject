import DeliveryTask from '../models/DeliveryTask.js';
import Shipment from '../models/Shipment.js';
import Vehicle from '../models/Vehicle.js';

const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestIdleVehicle = async (lat, lng) => {
  const vehicles = await Vehicle.find({ status: 'idle' });
  if (!vehicles.length) return null;

  let nearest = vehicles[0];
  let minDist = Infinity;
  for (const v of vehicles) {
    const dist = haversine(lat, lng, v.currentLocation.lat, v.currentLocation.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = v;
    }
  }
  return { vehicle: nearest, distanceKm: minDist };
};

export const runDeliveryBot = async () => {
  const pendingTasks = await DeliveryTask.find({ status: 'pending' })
    .populate('shipment')
    .sort({ priority: -1, createdAt: 1 });

  const suggestions = [];

  for (const task of pendingTasks) {
    const shipment = task.shipment;
    if (!shipment?.origin?.lat) continue;

    const result = await findNearestIdleVehicle(
      shipment.origin.lat,
      shipment.origin.lng
    );

    if (result) {
      task.botSuggested = true;
      task.botReason = `Nearest idle vehicle ${result.vehicle.vehicleId} (${result.distanceKm.toFixed(1)} km away)`;
      task.assignedVehicle = result.vehicle._id;
      task.status = 'assigned';
      await task.save();

      shipment.assignedVehicle = result.vehicle._id;
      await shipment.save();

      suggestions.push({
        taskId: task._id,
        shipmentId: shipment.trackingId,
        vehicleId: result.vehicle.vehicleId,
        reason: task.botReason,
      });
    }
  }

  return {
    message: `Assigned ${suggestions.length} pending deliveries`,
    suggestions,
  };
};

export const listPendingTasks = () =>
  DeliveryTask.find({ status: { $in: ['pending', 'assigned'] } })
    .populate('shipment')
    .populate('assignedVehicle')
    .sort({ priority: -1 });

export const assignDelivery = async (taskId, vehicleId, driverId) => {
  const task = await DeliveryTask.findById(taskId).populate('shipment');
  if (!task) throw new Error('Task not found');

  task.status = 'assigned';
  task.assignedVehicle = vehicleId;
  task.assignedDriver = driverId;
  await task.save();

  if (task.shipment) {
    task.shipment.assignedVehicle = vehicleId;
    task.shipment.assignedDriver = driverId;
    await task.shipment.save();
  }
  return task;
};
