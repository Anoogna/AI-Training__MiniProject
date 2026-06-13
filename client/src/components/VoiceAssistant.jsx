import { useState } from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

export default function VoiceAssistant({ onAction }) {
  const {
    listening,
    transcript,
    response,
    actions,
    startListening,
    stopListening,
    processTranscript,
  } = useVoiceAssistant();

  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const result = await processTranscript(textInput.trim());
    if (result?.actions) onAction?.(result.actions);
    setTextInput('');
  };

  const handleVoice = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="voice-assistant">
      <div className="voice-header">
        <h3>Voice Assistant</h3>
        <button
          className={`voice-btn ${listening ? 'listening' : ''}`}
          onClick={handleVoice}
          type="button"
        >
          {listening ? 'Listening...' : 'Push to Talk'}
        </button>
      </div>

      <form onSubmit={handleTextSubmit} className="voice-text-fallback">
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Or type command (fallback)..."
        />
        <button type="submit">Process</button>
      </form>

      {transcript && (
        <div className="voice-block">
          <label>You said:</label>
          <p>{transcript}</p>
        </div>
      )}

      {response && (
        <div className="voice-block response">
          <label>Assistant:</label>
          <p>{response}</p>
        </div>
      )}

      {actions?.length > 0 && (
        <div className="voice-actions">
          {actions.map((a, i) => (
            <span key={i} className="action-tag">
              {a.type}
            </span>
          ))}
        </div>
      )}

      <div className="voice-hints">
        <small>
          Try: &quot;Where is vehicle T-07?&quot;, &quot;List active fleet&quot;, &quot;Register exit gate 2
          shipment SH-102&quot;, &quot;Confirm pick for shipment SH-102 aisle B3&quot;
        </small>
      </div>
    </div>
  );
}
