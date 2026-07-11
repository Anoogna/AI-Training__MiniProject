import { useState, useRef, useCallback } from 'react';
import { voiceAPI } from '../services/api';

export const useVoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [actions, setActions] = useState([]);
  const recognitionRef = useRef(null);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const isCasualConversation = useCallback((text) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return false;

    const casualStarts = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
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
  }, []);

  const processTranscript = useCallback(
    async (text) => {
      setTranscript(text);
      try {
        if (isCasualConversation(text)) {
          const chatRes = await voiceAPI.chat(text);
          setResponse(chatRes.data.reply);
          setActions([]);
          speak(chatRes.data.reply);
          return { response: chatRes.data.reply, actions: [] };
        }

        const res = await voiceAPI.process(text, sessionId);
        setSessionId(res.data.sessionId);
        setResponse(res.data.response);
        setActions(res.data.actions || []);
        speak(res.data.response);
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || 'Voice processing failed';
        setResponse(msg);
        return null;
      }
    },
    [isCasualConversation, sessionId, speak]
  );

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponse('Speech recognition not supported. Use text input instead.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      processTranscript(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [processTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return {
    listening,
    transcript,
    response,
    actions,
    sessionId,
    startListening,
    stopListening,
    processTranscript,
    speak,
  };
};
