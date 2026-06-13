import { useEffect, useState } from 'react';
import { messageAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [broadcastText, setBroadcastText] = useState('');

  const load = () => messageAPI.list().then((res) => setMessages(res.data));

  useSocket();

  useEffect(() => {
    load();
  }, []);

  const sendBroadcast = async (e) => {
    e.preventDefault();
    await messageAPI.broadcast(broadcastText);
    setBroadcastText('');
    load();
  };

  return (
    <div className="page">
      <h1>Driver Communication</h1>

      <form onSubmit={sendBroadcast} className="broadcast-form">
        <input
          value={broadcastText}
          onChange={(e) => setBroadcastText(e.target.value)}
          placeholder="Broadcast message to all drivers..."
        />
        <button type="submit">Broadcast</button>
      </form>

      <div className="messages-list">
        {messages.map((m) => (
          <div key={m._id} className={`message-item ${m.channel}`}>
            <div className="msg-header">
              <strong>{m.sender?.name}</strong>
              {m.channel === 'broadcast' && <span className="badge broadcast">broadcast</span>}
              <small>{new Date(m.createdAt).toLocaleString()}</small>
            </div>
            <p>{m.text}</p>
            {m.receiver && <small>To: {m.receiver.name}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}
