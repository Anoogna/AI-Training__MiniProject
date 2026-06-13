import { Router } from 'express';
import Vehicle from '../models/Vehicle.js';
import { auth, roleGuard } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver', 'name email');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:vehicleId', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      vehicleId: req.params.vehicleId.toUpperCase(),
    }).populate('assignedDriver', 'name email');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/location', auth, roleGuard('driver', 'dispatcher', 'admin'), async (req, res) => {
  try {
    const { lat, lng, status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: { lat, lng },
        ...(status && { status }),
      },
      { new: true }
    ).populate('assignedDriver', 'name email');

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const io = req.app.get('io');
    if (io) io.emit('vehicle:location', vehicle);

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
