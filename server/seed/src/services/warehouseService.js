import WarehouseTask from '../models/WarehouseTask.js';

export const listWarehouseTasks = (filter = {}) =>
  WarehouseTask.find(filter)
    .populate('shipment')
    .populate('assignedStaff', 'name')
    .sort({ createdAt: -1 });

export const completeWarehouseTask = async (taskId, location) => {
  const task = await WarehouseTask.findById(taskId).populate('shipment');
  if (!task) return null;

  task.status = 'completed';
  if (location) task.location = location;
  await task.save();
  return task;
};

export const assignPickingTask = async (shipmentId, location, staffId) => {
  return WarehouseTask.create({
    type: 'pick',
    shipment: shipmentId,
    location,
    assignedStaff: staffId,
    status: 'in_progress',
  });
};

export const getTasksByLocation = (location) =>
  WarehouseTask.find({
    location: new RegExp(location, 'i'),
    status: { $ne: 'completed' },
  }).populate('shipment');
