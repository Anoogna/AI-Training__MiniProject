import { useEffect, useState } from 'react';
import { shipmentAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { canAccessAction } from '../config/roleAccess';

const STATUSES = ['created', 'picked', 'in_transit', 'at_gate', 'delivered'];

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({
    trackingId: '',
    customerName: '',
    customerPhone: '',
    originAddress: '',
    originLat: '',
    originLng: '',
    destinationAddress: '',
    destinationLat: '',
    destinationLng: '',
    priority: '1',
  });
  const { user } = useAuth();

  useSocket();

  const load = () => shipmentAPI.list().then((res) => setShipments(res.data));

  const canCreateShipment = user && ['admin', 'dispatcher'].includes(user.role);

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

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      trackingId: '',
      customerName: '',
      customerPhone: '',
      originAddress: '',
      originLat: '',
      originLng: '',
      destinationAddress: '',
      destinationLat: '',
      destinationLng: '',
      priority: '1',
    });
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!canCreateShipment) {
      setCreateError('You are not authorized to create shipments.');
      return;
    }

    const trackingId = form.trackingId.trim();
    const customerName = form.customerName.trim();

    if (!trackingId || !customerName) {
      setCreateError('Tracking ID and customer name are required.');
      return;
    }

    const origin = {
      address: form.originAddress.trim(),
      ...(form.originLat !== '' ? { lat: Number(form.originLat) } : {}),
      ...(form.originLng !== '' ? { lng: Number(form.originLng) } : {}),
    };

    const destination = {
      address: form.destinationAddress.trim(),
      ...(form.destinationLat !== '' ? { lat: Number(form.destinationLat) } : {}),
      ...(form.destinationLng !== '' ? { lng: Number(form.destinationLng) } : {}),
    };

    if (!origin.address || !destination.address) {
      setCreateError('Origin and destination addresses are required.');
      return;
    }

    setCreateLoading(true);
    try {
      await shipmentAPI.create({
        trackingId,
        customerName,
        customerPhone: form.customerPhone.trim(),
        origin,
        destination,
        priority: Number(form.priority) || 1,
      });
      await load();
      setShowCreateForm(false);
      resetForm();
      setSelected(null);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create shipment.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Shipment Management</h1>
      <p>Customers can track any shipment via /track/:trackingId.</p>

      {canCreateShipment && (
        <div style={{ margin: '1rem 0' }}>
          <button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>
            {showCreateForm ? 'Cancel New Shipment' : 'New Shipment'}
          </button>
        </div>
      )}

      {showCreateForm && canCreateShipment && (
        <div className="panel" style={{ marginBottom: '1rem' }}>
          <h3>New Shipment</h3>
          <form onSubmit={handleCreateShipment} className="shipment-form" style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label>
                Tracking ID
                <input value={form.trackingId} onChange={handleFormChange('trackingId')} placeholder="SH-201" />
              </label>
              <label>
                Customer Name
                <input value={form.customerName} onChange={handleFormChange('customerName')} placeholder="ABC Corp" />
              </label>
              <label>
                Customer Phone
                <input value={form.customerPhone} onChange={handleFormChange('customerPhone')} placeholder="+91..." />
              </label>
              <label>
                Priority
                <input type="number" min="1" max="5" value={form.priority} onChange={handleFormChange('priority')} />
              </label>
            </div>

            <div className="panel" style={{ padding: '0.75rem' }}>
              <h4>Origin</h4>
              <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label>
                  Address
                  <input value={form.originAddress} onChange={handleFormChange('originAddress')} placeholder="Mumbai Hub" />
                </label>
                <label>
                  Latitude
                  <input type="number" step="any" value={form.originLat} onChange={handleFormChange('originLat')} placeholder="19.076" />
                </label>
                <label>
                  Longitude
                  <input type="number" step="any" value={form.originLng} onChange={handleFormChange('originLng')} placeholder="72.8777" />
                </label>
              </div>
            </div>

            <div className="panel" style={{ padding: '0.75rem' }}>
              <h4>Destination</h4>
              <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label>
                  Address
                  <input value={form.destinationAddress} onChange={handleFormChange('destinationAddress')} placeholder="Pune Depot" />
                </label>
                <label>
                  Latitude
                  <input type="number" step="any" value={form.destinationLat} onChange={handleFormChange('destinationLat')} placeholder="18.5204" />
                </label>
                <label>
                  Longitude
                  <input type="number" step="any" value={form.destinationLng} onChange={handleFormChange('destinationLng')} placeholder="73.8567" />
                </label>
              </div>
            </div>

            {createError && <div className="error-message">{createError}</div>}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Shipment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateError('');
                  resetForm();
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}

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
