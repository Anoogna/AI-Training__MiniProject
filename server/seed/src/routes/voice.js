import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { processVoiceInput } from '../nlu/skillRouter.js';
import { generateConversationReply } from '../nlu/llmFallback.js';

const router = Router();

router.post('/process', auth, async (req, res) => {
  try {
    const { transcript, sessionId } = req.body;
    if (!transcript) {
      return res.status(400).json({ message: 'Transcript required' });
    }

    const io = req.app.get('io');
    const result = await processVoiceInput({
      transcript,
      sessionId,
      user: req.user,
      io,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message required' });
    }

    const reply = await generateConversationReply(message, { role: req.user?.role });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
