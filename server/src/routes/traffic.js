import { Router } from 'express';
import { auth, roleGuard } from '../middleware/auth.js';
import { checkTrafficAndReroute, listTrafficAlerts } from '../services/trafficService.js';

const router = Router();

router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await listTrafficAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/check', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const io = req.app.get('io');
    const alerts = await checkTrafficAndReroute(io);
    res.json({ message: `Generated ${alerts.length} traffic alerts`, alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
