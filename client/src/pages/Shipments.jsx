import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shipmentAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { canAccessAction } from '../config/roleAccess';

const STATUSES = ['created', 'picked', 'in_transit', 'at_gate', 'delivered'];

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useSocket();

  const load = () => shipmentAPI.list().then((res) => setShipments(res.data));

  useEffect(() => {
    load();
  }, []);

  const roleAllowedForStatus = (role, status) => {
    if (!role) return false;
    return canAccessAction(role, 'shipments', status);
  };

  const updateStatus = async (id, status) => {
    if (!user || !roleAllowedForStatus(user.role, status)) {
      return alert('You are not authorized to set this status');
    }
    await shipmentAPI.updateStatus(id, status, `Updated to ${status}`);
    load();
    if (selected?._id === id) {
      const updated = await shipmentAPI.get(id);
      setSelected(updated.data);
    }
  };

  return (
    <div className="page">
      <h1>Shipment Management</h1>
      <p>
        Public tracking: <Link to="/track/SH-103">/track/SH-103</Link>
      </p>

      <div className="shipments-grid">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Vehicle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s._id} onClick={() => setSelected(s)} className={selected?._id === s._id ? 'selected' : ''}>
                <td>{s.trackingId}</td>
                <td>{s.customerName}</td>
                <td>
                  <span className={`badge ${s.status}`}>{s.status}</span>
                </td>
                <td>{s.assignedVehicle?.vehicleId || '-'}</td>
                <td>
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUSES.filter((st) => (user ? roleAllowedForStatus(user.role, st) || user.role === 'admin' : false)).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <div className="panel detail-panel">
            <h3>{selected.trackingId} Timeline</h3>
            <ul className="timeline">
              {selected.statusTimeline?.map((ev, i) => (
                <li key={i}>
                  <strong>{ev.status}</strong> — {ev.note}
                  <small>{new Date(ev.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
