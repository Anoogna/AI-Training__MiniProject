import { Router } from 'express';
import Shipment from '../models/Shipment.js';
import { auth, roleGuard } from '../middleware/auth.js';
import {
  listShipments,
  getShipmentByTrackingId,
  updateShipmentStatus,
} from '../services/shipmentService.js';
import DeliveryTask from '../models/DeliveryTask.js';

const router = Router();

router.get('/track/:trackingId', async (req, res) => {
  try {
    const shipment = await getShipmentByTrackingId(req.params.trackingId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const shipments = await listShipments();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const { trackingId, origin, destination, customerName, customerPhone, priority } = req.body;
    const shipment = await Shipment.create({
      trackingId: trackingId.toUpperCase(),
      origin,
      destination,
      customerName,
      customerPhone,
      priority: priority || 1,
      statusTimeline: [{ status: 'created', note: 'Shipment created' }],
    });

    await DeliveryTask.create({ shipment: shipment._id, priority: priority || 1 });

    const io = req.app.get('io');
    if (io) io.emit('shipment:updated', shipment);

    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const io = req.app.get('io');

    // Basic role-based status transition validation
    const role = req.user?.role;
    const s = (status || '').toString().toLowerCase();

    const transitionRoles = {
      picked: ['warehouse'],
      in_transit: ['driver', 'dispatcher', 'admin'],
      delivered: ['driver', 'admin'],
      at_gate: ['gate'],
      exit: ['gate'],
      created: ['admin', 'dispatcher'],
    };

    if (role !== 'admin') {
      const allowed = transitionRoles[s];
      if (allowed && !allowed.includes(role)) {
        return res.status(403).json({ message: 'Forbidden: role cannot set this status' });
      }
    }

    const shipment = await updateShipmentStatus(req.params.id, status, note, io);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('assignedVehicle')
      .populate('assignedDriver', 'name email');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
