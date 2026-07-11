import { useState } from 'react';
import { deliveryAPI, messageAPI, voiceAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am the delivery coordination bot. You can type a command or just say hello.' },
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
        if (!user || !['admin', 'dispatcher'].includes(user.role)) {
          reply = 'Forbidden: only admin or dispatcher can run the assignment bot.';
        } else {
          const res = await deliveryAPI.runBot();
          reply = res.data.message;
          if (res.data.suggestions?.length) {
          reply += ' ' + res.data.suggestions.map((s) => `${s.shipmentId}→${s.vehicleId}`).join(', ');
        }
        }
        
      } else if (lower.includes('pending')) {
        if (!user || !['admin', 'dispatcher'].includes(user.role)) {
          reply = 'Forbidden: only admin or dispatcher can view pending tasks.';
        } else {
          const res = await deliveryAPI.tasks();
          reply = `${res.data.length} pending/assigned tasks.`;
        }
      } else if (lower.startsWith('broadcast ')) {
        if (!user || !['admin', 'dispatcher'].includes(user.role)) {
          reply = 'Forbidden: only admin or dispatcher can broadcast messages.';
        } else {
          const text = userMsg.slice(10);
          const res = await messageAPI.broadcast(text);
          reply = res.data.message;
        }
      } else {
        const res = await voiceAPI.chat(userMsg);
        reply = res.data.reply;
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
