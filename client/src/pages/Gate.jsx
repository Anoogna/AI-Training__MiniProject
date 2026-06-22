import { useEffect, useState } from 'react';
import { gateAPI, shipmentAPI } from '../services/api';
import VoiceAssistant from '../components/VoiceAssistant';
import { useAuth } from '../hooks/useAuth';
import { canAccessAction } from '../config/roleAccess';

export default function Gate() {
  const [logs, setLogs] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [lane, setLane] = useState(1);
  const [shipmentId, setShipmentId] = useState('');
  const { user } = useAuth();

  const load = () => {
    gateAPI.logs().then((res) => setLogs(res.data));
    shipmentAPI.list().then((res) => setShipments(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleEntry = async () => {
    const shipment = shipments.find((s) => s.trackingId === shipmentId.toUpperCase());
    if (!shipment) return alert('Shipment not found');
    await gateAPI.entry(lane, shipment._id, shipment.assignedVehicle?._id);
    load();
  };

  const handleExit = async () => {
    const shipment = shipments.find((s) => s.trackingId === shipmentId.toUpperCase());
    if (!shipment) return alert('Shipment not found');
    await gateAPI.exit(lane, shipment._id, shipment.assignedVehicle?._id);
    load();
  };

  return (
    <div className="page">
      <h1>Smart Gate Entry/Exit</h1>
      <div className="gate-grid">
        <div className="panel">
          {canAccessAction(user?.role, 'gate', 'register_entry') && (
            <div className="gate-controls">
              <label>
                Lane:
                <select value={lane} onChange={(e) => setLane(Number(e.target.value))}>
                  <option value={1}>Gate 1</option>
                  <option value={2}>Gate 2</option>
                </select>
              </label>
              <label>
                Shipment ID:
                <input
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  placeholder="SH-102"
                />
              </label>
              <button onClick={handleEntry} type="button">
                Register Entry
              </button>
              <button onClick={handleExit} type="button" className="secondary">
                Register Exit
              </button>
            </div>
          )}
          {!canAccessAction(user?.role, 'gate', 'register_entry') && (
            <p className="form-note">Gate actions are hidden for your role.</p>
          )}

          <h3>Gate Log</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Direction</th>
                <th>Lane</th>
                <th>Shipment</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id}>
                  <td>{new Date(l.createdAt).toLocaleString()}</td>
                  <td>{l.direction}</td>
                  <td>{l.lane}</td>
                  <td>{l.shipment?.trackingId || '-'}</td>
                  <td>{l.source}</td>
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
