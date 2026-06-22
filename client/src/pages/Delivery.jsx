import { useEffect, useState } from 'react';
import { deliveryAPI } from '../services/api';
import ChatPanel from '../components/ChatPanel';
import { useAuth } from '../hooks/useAuth';

export default function Delivery() {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  const load = () => deliveryAPI.tasks().then((res) => setTasks(res.data));

  useEffect(() => {
    load();
  }, []);

  const runBot = async () => {
    await deliveryAPI.runBot();
    load();
  };

  return (
    <div className="page">
      <h1>Delivery Coordination</h1>
      <div className="delivery-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Task Queue</h2>
            {user && ['admin', 'dispatcher'].includes(user.role) && (
              <button onClick={runBot} type="button">
                Run Assignment Bot
              </button>
            )}
            {!user || !['admin', 'dispatcher'].includes(user.role) ? (
              <small>Only admin/dispatcher can run the assignment bot</small>
            ) : null}
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Vehicle</th>
                <th>Bot Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.shipment?.trackingId}</td>
                  <td>{t.priority}</td>
                  <td>
                    <span className={`badge ${t.status}`}>{t.status}</span>
                  </td>
                  <td>{t.assignedVehicle?.vehicleId || '-'}</td>
                  <td>{t.botReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ChatPanel />
      </div>
    </div>
  );
}
