import { Router } from 'express';
import { auth, roleGuard } from '../middleware/auth.js';
import { registerGateEvent, listGateLogs } from '../services/gateService.js';
import Shipment from '../models/Shipment.js';

const router = Router();

router.get('/logs', auth, roleGuard('admin', 'dispatcher', 'gate'), async (req, res) => {
  try {
    const logs = await listGateLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/entry', auth, roleGuard('gate', 'admin', 'dispatcher'), async (req, res) => {
  try {
    const { lane, shipmentId, vehicleId } = req.body;
    const io = req.app.get('io');
    const log = await registerGateEvent({
      direction: 'entry',
      lane,
      shipmentId,
      vehicleId,
      source: 'manual',
      operatorId: req.user._id,
      io,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/exit', auth, roleGuard('gate', 'admin', 'dispatcher'), async (req, res) => {
  try {
    const { lane, shipmentId, vehicleId } = req.body;
    const io = req.app.get('io');
    const log = await registerGateEvent({
      direction: 'exit',
      lane,
      shipmentId,
      vehicleId,
      source: 'manual',
      operatorId: req.user._id,
      io,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
