import VoiceSession from '../models/VoiceSession.js';

export const getOrCreateSession = async (sessionId, userId, role) => {
  if (sessionId) {
    const existing = await VoiceSession.findById(sessionId);
    if (existing) return existing;
  }
  return VoiceSession.create({ userId, role, slots: {}, history: [] });
};

export const updateSession = async (session, intent, entities, transcript, response) => {
  session.lastIntent = intent;
  session.slots = { ...session.slots, ...entities };
  session.history.push({ transcript, intent, response });
  if (session.history.length > 20) {
    session.history = session.history.slice(-20);
  }
  await session.save();
  return session;
};

export const getMissingSlots = (intent, entities) => {
  const required = {
    register_entry: ['gateLane', 'shipmentId'],
    register_exit: ['gateLane', 'shipmentId'],
    get_vehicle_status: ['vehicleId'],
    confirm_load: ['shipmentId'],
    assign_picking_task: ['shipmentId', 'aisle'],
  };

  const needed = required[intent] || [];
  return needed.filter((slot) => !entities[slot]);
};
