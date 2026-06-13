import { useEffect, useState } from 'react';
import { vehicleAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import FleetMap from '../components/FleetMap';
import VoiceAssistant from '../components/VoiceAssistant';

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [focusVehicleId, setFocusVehicleId] = useState(null);

  useSocket({
    onVehicleLocation: (vehicle) => {
      setVehicles((prev) => prev.map((v) => (v._id === vehicle._id ? vehicle : v)));
    },
  });

  useEffect(() => {
    vehicleAPI.list().then((res) => setVehicles(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Fleet Tracking</h1>
      <div className="fleet-grid">
        <div className="panel map-panel">
          <FleetMap vehicles={vehicles} focusVehicleId={focusVehicleId} />
        </div>
        <div className="panel">
          <VoiceAssistant
            onAction={(actions) => {
              actions.forEach((a) => {
                if (a.type === 'focus_vehicle') setFocusVehicleId(a.vehicleId);
              });
            }}
          />
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plate</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td>{v.vehicleId}</td>
                  <td>{v.plate}</td>
                  <td>
                    <span className={`badge ${v.status}`}>{v.status}</span>
                  </td>
                  <td>
                    {v.currentLocation.lat.toFixed(3)}, {v.currentLocation.lng.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
