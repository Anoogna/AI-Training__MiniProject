import { Router } from 'express';
import { auth, roleGuard } from '../middleware/auth.js';
import {
  listWarehouseTasks,
  completeWarehouseTask,
  assignPickingTask,
} from '../services/warehouseService.js';

const router = Router();

router.get('/tasks', auth, roleGuard('warehouse', 'dispatcher', 'admin'), async (req, res) => {
  try {
    const tasks = await listWarehouseTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/tasks/:id/complete', auth, roleGuard('warehouse', 'admin'), async (req, res) => {
  try {
    const task = await completeWarehouseTask(req.params.id, req.body.location);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/tasks', auth, roleGuard('warehouse', 'admin', 'dispatcher'), async (req, res) => {
  try {
    const { shipmentId, location } = req.body;
    const task = await assignPickingTask(shipmentId, location, req.user._id);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
