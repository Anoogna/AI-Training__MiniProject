import { Router } from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { auth, roleGuard } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const filter =
      req.user.role === 'driver'
        ? { $or: [{ receiver: req.user._id }, { sender: req.user._id }, { channel: 'broadcast' }] }
        : {};

    const messages = await Message.find(filter)
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text, channel } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      channel: channel || 'direct',
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name role')
      .populate('receiver', 'name role');

    const io = req.app.get('io');
    if (io) io.emit('message:new', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/broadcast', auth, roleGuard('admin', 'dispatcher'), async (req, res) => {
  try {
    const { text } = req.body;
    const drivers = await User.find({ role: 'driver' });
    const messages = [];

    for (const driver of drivers) {
      const msg = await Message.create({
        sender: req.user._id,
        receiver: driver._id,
        channel: 'broadcast',
        text,
      });
      messages.push(msg);
    }

    const io = req.app.get('io');
    if (io) io.emit('message:new', { channel: 'broadcast', text, count: messages.length });

    res.json({ message: `Broadcast sent to ${messages.length} drivers`, count: messages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
