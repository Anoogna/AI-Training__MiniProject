import { useEffect, useState, useCallback } from 'react';
import { shipmentAPI, vehicleAPI, routeAPI, trafficAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import FleetMap from '../components/FleetMap';
import VoiceAssistant from '../components/VoiceAssistant';
import ChatPanel from '../components/ChatPanel';

export default function Dashboard() {
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [focusVehicleId, setFocusVehicleId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [s, v, r] = await Promise.all([
        shipmentAPI.list(),
        vehicleAPI.list(),
        routeAPI.list(),
      ]);
      setShipments(s.data);
      setVehicles(v.data);
      setRoutes(r.data);
    } catch {
      /* auth handled elsewhere */
    }
  }, []);

  const { notifications } = useSocket({
    onVehicleLocation: (vehicle) => {
      setVehicles((prev) => prev.map((v) => (v._id === vehicle._id ? vehicle : v)));
    },
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleVoiceAction = (actions) => {
    actions.forEach((a) => {
      if (a.type === 'focus_vehicle') setFocusVehicleId(a.vehicleId);
    });
    loadData();
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    pending: shipments.filter((s) => ['created', 'picked'].includes(s.status)).length,
    vehicles: vehicles.filter((v) => v.status !== 'maintenance').length,
  };

  return (
    <div className="dashboard">
      <h1>Operations Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Shipments</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.inTransit}</span>
          <span className="stat-label">In Transit</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.vehicles}</span>
          <span className="stat-label">Active Vehicles</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel map-panel">
          <h2>Live Fleet Map</h2>
          <FleetMap vehicles={vehicles} routes={routes} focusVehicleId={focusVehicleId} />
        </div>

        <div className="panel side-panel">
          <VoiceAssistant onAction={handleVoiceAction} />
          <ChatPanel />
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="notifications-panel">
          <h3>Live Notifications</h3>
          {notifications.slice(0, 5).map((n) => (
            <div key={n.id} className={`notification ${n.type}`}>
              <strong>{n.type}</strong>
              <span>{n.data?.message || JSON.stringify(n.data).slice(0, 80)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
