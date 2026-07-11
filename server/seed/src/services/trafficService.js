import TrafficAlert from '../models/TrafficAlert.js';
import Shipment from '../models/Shipment.js';
import { optimizeRouteForShipment } from './routeService.js';
import RoutePlan from '../models/RoutePlan.js';

export const simulateTrafficDelay = () => Math.floor(Math.random() * 25);

export const checkTrafficAndReroute = async (io) => {
  const inTransit = await Shipment.find({ status: 'in_transit' });
  const alerts = [];

  for (const shipment of inTransit) {
    const delay = simulateTrafficDelay();
    if (delay < 8) continue;

    const plan = await optimizeRouteForShipment(shipment, RoutePlan);
    const severity = delay > 18 ? 'high' : delay > 12 ? 'medium' : 'low';
    const newDuration = (plan?.durationSeconds || 0) + delay * 60;

    if (plan) {
      plan.trafficScore = delay;
      plan.durationSeconds = newDuration;
      plan.lastRecalculatedAt = new Date();
      await plan.save();
    }

    const alert = await TrafficAlert.create({
      segment: `${shipment.trackingId} corridor`,
      severity,
      delayMinutes: delay,
      suggestedReroute: plan?.optimizedPath || [],
      affectedShipments: [shipment._id],
      notified: true,
    });

    alerts.push(alert);

    if (io) {
      io.emit('route:alert', {
        alert,
        shipment,
        message: `Traffic delay of ${delay} min on ${shipment.trackingId}. Reroute suggested.`,
      });
    }
  }

  return alerts;
};

export const listTrafficAlerts = () =>
  TrafficAlert.find().populate('affectedShipments').sort({ createdAt: -1 }).limit(20);
