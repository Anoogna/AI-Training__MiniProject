import { Router } from 'express';
import RoutePlan from '../models/RoutePlan.js';
import Shipment from '../models/Shipment.js';
import { auth } from '../middleware/auth.js';
import { optimizeRouteForShipment } from '../services/routeService.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const plans = await RoutePlan.find().populate('shipment').sort({ updatedAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/optimize/:shipmentId', auth, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const plan = await optimizeRouteForShipment(shipment, RoutePlan);
    const io = req.app.get('io');
    if (io) {
      io.emit('route:optimized', { shipment, plan });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
