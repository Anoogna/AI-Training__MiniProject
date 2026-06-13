import { useState } from 'react';
import { deliveryAPI, messageAPI } from '../services/api';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am the delivery coordination bot. Try "run bot" or type a command.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      let reply = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('run bot') || lower.includes('assign')) {
        const res = await deliveryAPI.runBot();
        reply = res.data.message;
        if (res.data.suggestions?.length) {
          reply += ' ' + res.data.suggestions.map((s) => `${s.shipmentId}→${s.vehicleId}`).join(', ');
        }
      } else if (lower.includes('pending')) {
        const res = await deliveryAPI.tasks();
        reply = `${res.data.length} pending/assigned tasks.`;
      } else if (lower.startsWith('broadcast ')) {
        const text = userMsg.slice(10);
        const res = await messageAPI.broadcast(text);
        reply = res.data.message;
      } else {
        reply = 'Commands: "run bot", "show pending", "broadcast <message>"';
      }

      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: err.response?.data?.message || 'Error processing command' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">Delivery Coordination Bot</div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
