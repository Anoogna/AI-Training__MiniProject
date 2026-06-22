import { Router } from 'express';
import { auth, roleGuard } from '../middleware/auth.js';
import {
  runDeliveryBot,
  listPendingTasks,
  assignDelivery,
} from '../services/deliveryBotService.js';

const router = Router();

router.get('/tasks', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const tasks = await listPendingTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bot/run', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const result = await runDeliveryBot();
    const io = req.app.get('io');
    if (io) io.emit('delivery:bot_run', result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/assign', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const { taskId, vehicleId, driverId } = req.body;
    const task = await assignDelivery(taskId, vehicleId, driverId);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
