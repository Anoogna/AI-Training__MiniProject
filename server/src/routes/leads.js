import { Router } from 'express';
import { auth, roleGuard } from '../middleware/auth.js';
import Lead from '../models/Lead.js';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createLead = async (req, res, type) => {
  try {
    const { name, email, company, phone, message } = req.body;

    if (!email || !emailRegex.test(String(email))) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    if (type === 'demo_request' && (!name || !company || !phone)) {
      return res.status(400).json({ message: 'Name, company, and phone are required' });
    }

    const lead = await Lead.create({
      type,
      name,
      email,
      company,
      phone,
      message,
    });

    res.status(201).json({
      message: type === 'newsletter' ? 'Thanks for subscribing' : 'Demo request submitted successfully',
      lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.post('/demo', (req, res) => createLead(req, res, 'demo_request'));
router.post('/newsletter', (req, res) => createLead(req, res, 'newsletter'));
router.post('/contact', (req, res) => createLead(req, res, 'contact'));

router.get('/', auth, roleGuard('admin'), async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', auth, roleGuard('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const update = {};
    if (status) update.status = status;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
