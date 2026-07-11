import { normalize } from './normalizer.js';
import { classifyIntent, getHelpForRole } from './intentClassifier.js';
import { classifyIntentML } from './bayesClassifier.js';
import { classifyIntentLLM, generateConversationReply } from './llmFallback.js';
import { extractEntities } from './entityExtractor.js';
import { getOrCreateSession, updateSession, getMissingSlots } from './dialogManager.js';
import {
  handleFleetSkill,
  handleWarehouseSkill,
  handleGateSkill,
  handleDeliverySkill,
  handleCommsSkill,
} from '../skills/fleetSkill.js';

export const isCasualConversation = (text) => {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) return false;

  const casualStarts = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you'];
  if (casualStarts.some((phrase) => lower === phrase || lower.startsWith(`${phrase} `))) {
    return true;
  }

  const commandHints = [
    'vehicle',
    'shipment',
    'inventory',
    'gate',
    'driver',
    'assign',
    'broadcast',
    'pending',
    'route',
    'task',
    'load',
    'exit',
    'entry',
    'confirm',
    'register',
  ];

  return !commandHints.some((hint) => lower.includes(hint));
};

export const processVoiceInput = async ({ transcript, sessionId, user, io }) => {
  const normalized = normalize(transcript);
  const entities = extractEntities(normalized);
  let intent = classifyIntent(normalized, user.role);
  let matchedBy = intent === 'unknown' ? null : 'regex';
  let conversationReply = null;

  if (isCasualConversation(normalized)) {
    conversationReply = await generateConversationReply(normalized, { role: user.role });
    matchedBy = 'groq-chat';
    intent = 'unknown';
  }

  if (!conversationReply && intent === 'unknown') {
    const mlIntent = classifyIntentML(normalized);
    if (mlIntent !== 'unknown') {
      intent = mlIntent;
      matchedBy = 'ml';
    }
  }

  if (!conversationReply && intent === 'unknown') {
    const llmIntent = await classifyIntentLLM(normalized);
    if (llmIntent !== 'unknown') {
      intent = llmIntent;
      matchedBy = 'llm';
    } else {
      conversationReply = await generateConversationReply(normalized, { role: user.role });
      matchedBy = 'groq-chat';
    }
  }

  if (matchedBy) {
    console.log(`NLU matched via ${matchedBy}: ${conversationReply ? 'conversation' : intent}`);
  }

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
  } else if (conversationReply) {
    result = {
      response: conversationReply,
      actions: [],
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
