import { useEffect, useState } from 'react';
import { warehouseAPI } from '../services/api';
import VoiceAssistant from '../components/VoiceAssistant';

export default function Warehouse() {
  const [tasks, setTasks] = useState([]);

  const load = () => warehouseAPI.tasks().then((res) => setTasks(res.data));

  useEffect(() => {
    load();
  }, []);

  const completeTask = async (id) => {
    await warehouseAPI.complete(id);
    load();
  };

  return (
    <div className="page">
      <h1>Warehouse Operations</h1>
      <div className="warehouse-grid">
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Shipment</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.type}</td>
                  <td>{t.shipment?.trackingId || '-'}</td>
                  <td>{t.location}</td>
                  <td>
                    <span className={`badge ${t.status}`}>{t.status}</span>
                  </td>
                  <td>
                    {t.status !== 'completed' && (
                      <button onClick={() => completeTask(t._id)} type="button">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <VoiceAssistant onAction={() => load()} />
      </div>
    </div>
  );
}
