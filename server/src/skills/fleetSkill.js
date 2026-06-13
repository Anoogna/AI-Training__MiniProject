import Vehicle from '../models/Vehicle.js';
import Shipment from '../models/Shipment.js';
import User from '../models/User.js';
import { registerGateEvent } from '../services/gateService.js';
import { runDeliveryBot, listPendingTasks } from '../services/deliveryBotService.js';
import {
  listWarehouseTasks,
  completeWarehouseTask,
  getTasksByLocation,
} from '../services/warehouseService.js';
import Message from '../models/Message.js';

export const handleFleetSkill = async (intent, entities, user, io) => {
  switch (intent) {
    case 'get_vehicle_status': {
      const vehicle = await Vehicle.findOne({
        vehicleId: entities.vehicleId?.toUpperCase(),
      }).populate('assignedDriver', 'name');
      if (!vehicle) {
        return { response: `Vehicle ${entities.vehicleId} not found.`, actions: [] };
      }
      const driverName = vehicle.assignedDriver?.name || 'unassigned';
      return {
        response: `Vehicle ${vehicle.vehicleId} is ${vehicle.status} at latitude ${vehicle.currentLocation.lat.toFixed(4)}, longitude ${vehicle.currentLocation.lng.toFixed(4)}. Driver: ${driverName}.`,
        actions: [{ type: 'focus_vehicle', vehicleId: vehicle.vehicleId }],
      };
    }
    case 'list_active_fleet': {
      const vehicles = await Vehicle.find({ status: { $ne: 'maintenance' } });
      const summary = vehicles.map((v) => `${v.vehicleId}:${v.status}`).join(', ');
      return {
        response: `Active fleet: ${summary || 'none'}.`,
        actions: [{ type: 'show_fleet' }],
      };
    }
    case 'locate_driver': {
      const drivers = await User.find({ role: 'driver' });
      return {
        response: `There are ${drivers.length} drivers registered: ${drivers.map((d) => d.name).join(', ')}.`,
        actions: [],
      };
    }
    default:
      return null;
  }
};

export const handleWarehouseSkill = async (intent, entities, user) => {
  switch (intent) {
    case 'check_inventory': {
      const tasks = entities.aisle
        ? await getTasksByLocation(entities.aisle)
        : await listWarehouseTasks({ status: { $ne: 'completed' } });
      return {
        response: `Found ${tasks.length} active warehouse tasks${entities.aisle ? ` at aisle ${entities.aisle}` : ''}.`,
        actions: [{ type: 'show_warehouse_tasks' }],
      };
    }
    case 'confirm_load':
    case 'assign_picking_task': {
      let shipment = null;
      if (entities.shipmentId) {
        shipment = await Shipment.findOne({
          trackingId: entities.shipmentId.toUpperCase(),
        });
      }
      if (shipment) {
        const tasks = await listWarehouseTasks({
          shipment: shipment._id,
          status: { $ne: 'completed' },
        });
        if (tasks[0]) {
          await completeWarehouseTask(tasks[0]._id, entities.aisle);
          return {
            response: `Confirmed ${intent === 'confirm_load' ? 'load' : 'pick'} for shipment ${shipment.trackingId}${entities.aisle ? ` at aisle ${entities.aisle}` : ''}.`,
            actions: [{ type: 'task_completed', shipmentId: shipment.trackingId }],
          };
        }
      }
      return {
        response: `Could not find pending warehouse task for shipment ${entities.shipmentId || 'unknown'}.`,
        actions: [],
      };
    }
    default:
      return null;
  }
};

export const handleGateSkill = async (intent, entities, user, io) => {
  const shipment = entities.shipmentId
    ? await Shipment.findOne({ trackingId: entities.shipmentId.toUpperCase() })
    : null;

  switch (intent) {
    case 'register_entry':
    case 'register_exit': {
      if (!entities.gateLane || !shipment) {
        return {
          response: 'Please provide gate lane number and shipment ID.',
          actions: [],
        };
      }
      const direction = intent === 'register_entry' ? 'entry' : 'exit';
      await registerGateEvent({
        direction,
        lane: entities.gateLane,
        shipmentId: shipment._id,
        vehicleId: shipment.assignedVehicle,
        source: 'voice',
        operatorId: user._id,
        io,
      });
      return {
        response: `Registered ${direction} at gate ${entities.gateLane} for shipment ${shipment.trackingId}.`,
        actions: [{ type: 'gate_event', direction, shipmentId: shipment.trackingId }],
      };
    }
    case 'verify_shipment_at_gate': {
      if (!shipment) {
        return { response: 'Shipment not found.', actions: [] };
      }
      return {
        response: `Shipment ${shipment.trackingId} status is ${shipment.status}.`,
        actions: [{ type: 'verify_shipment', shipmentId: shipment.trackingId }],
      };
    }
    default:
      return null;
  }
};

export const handleDeliverySkill = async (intent, entities, user, io) => {
  switch (intent) {
    case 'list_pending': {
      const tasks = await listPendingTasks();
      return {
        response: `There are ${tasks.length} pending or assigned delivery tasks.`,
        actions: [{ type: 'show_pending' }],
      };
    }
    case 'assign_delivery': {
      const result = await runDeliveryBot();
      if (io) io.emit('delivery:bot_run', result);
      return {
        response: result.message,
        actions: [{ type: 'bot_assignments', suggestions: result.suggestions }],
      };
    }
    default:
      return null;
  }
};

export const handleCommsSkill = async (intent, entities, user, io) => {
  switch (intent) {
    case 'broadcast_alert': {
      const drivers = await User.find({ role: 'driver' });
      const text = entities.alertText || 'Dispatcher broadcast alert. Check your dashboard.';
      for (const driver of drivers) {
        await Message.create({
          sender: user._id,
          receiver: driver._id,
          channel: 'broadcast',
          text,
        });
      }
      if (io) io.emit('message:new', { channel: 'broadcast', text });
      return {
        response: `Broadcast sent to ${drivers.length} drivers.`,
        actions: [{ type: 'broadcast_sent' }],
      };
    }
    default:
      return null;
  }
};
