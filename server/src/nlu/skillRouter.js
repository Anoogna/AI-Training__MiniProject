import { normalize } from './normalizer.js';
import { classifyIntent, getHelpForRole } from './intentClassifier.js';
import { extractEntities } from './entityExtractor.js';
import { getOrCreateSession, updateSession, getMissingSlots } from './dialogManager.js';
import {
  handleFleetSkill,
  handleWarehouseSkill,
  handleGateSkill,
  handleDeliverySkill,
  handleCommsSkill,
} from '../skills/fleetSkill.js';

export const processVoiceInput = async ({ transcript, sessionId, user, io }) => {
  const normalized = normalize(transcript);
  const entities = extractEntities(normalized);
  const intent = classifyIntent(normalized, user.role);

  const session = await getOrCreateSession(sessionId, user._id, user.role);
  const mergedEntities = { ...session.slots, ...entities };
  const missing = getMissingSlots(intent, mergedEntities);

  if (missing.length > 0 && intent !== 'unknown' && intent !== 'help') {
    const response = `I need more information: ${missing.join(', ')}.`;
    await updateSession(session, intent, mergedEntities, transcript, response);
    return { sessionId: session._id, intent, entities: mergedEntities, response, actions: [] };
  }

  let result = null;

  if (intent === 'help') {
    const commands = getHelpForRole(user.role);
    result = {
      response: `You can say: ${commands.join('. ')}.`,
      actions: [{ type: 'help', commands }],
    };
  } else {
    result =
      (await handleFleetSkill(intent, mergedEntities, user, io)) ||
      (await handleWarehouseSkill(intent, mergedEntities, user)) ||
      (await handleGateSkill(intent, mergedEntities, user, io)) ||
      (await handleDeliverySkill(intent, mergedEntities, user, io)) ||
      (await handleCommsSkill(intent, mergedEntities, user, io));

    if (!result) {
      result = {
        response: "I didn't understand that. Say 'help' for available commands.",
        actions: [],
      };
    }
  }

  await updateSession(session, intent, mergedEntities, transcript, result.response);

  return {
    sessionId: session._id,
    intent,
    entities: mergedEntities,
    response: result.response,
    actions: result.actions,
  };
};
