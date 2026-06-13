import mongoose from 'mongoose';

const voiceSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    slots: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastIntent: String,
    history: [
      {
        transcript: String,
        intent: String,
        response: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('VoiceSession', voiceSessionSchema);
