import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { shipmentAPI, vehicleAPI, routeAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import FleetMap from '../components/FleetMap';
import VoiceAssistant from '../components/VoiceAssistant';
import ChatPanel from '../components/ChatPanel';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
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

  const quickLinks = [
    { to: '/fleet', label: 'Fleet', roles: ['admin', 'dispatcher', 'driver'] },
    { to: '/shipments', label: 'Shipments', roles: ['admin', 'dispatcher'] },
    { to: '/delivery', label: 'Delivery Bot', roles: ['admin', 'dispatcher'] },
    { to: '/warehouse', label: 'Warehouse', roles: ['admin', 'warehouse', 'dispatcher'] },
    { to: '/gate', label: 'Gate', roles: ['admin', 'gate', 'dispatcher'] },
    { to: '/driver', label: 'Driver View', roles: ['driver'] },
  ].filter((item) => item.roles.includes(user?.role));

  const roleLabel = {
    admin: 'Admin Control Center',
    dispatcher: 'Dispatcher Overview',
    driver: 'Driver Workspace',
    warehouse: 'Warehouse Operations',
    gate: 'Gate Operations',
  }[user?.role] || 'Operations Dashboard';

  return (
    <div className="dashboard">
      <section className="dashboard-hero panel">
        <div>
          <p className="eyebrow">Role-based landing page</p>
          <h1>{roleLabel}</h1>
          <p className="hero-copy">
            Welcome {user?.name || 'operator'}. This dashboard shows the modules available for your role and keeps the fleet view focused on the tasks you are allowed to run.
          </p>
        </div>
        <div className="hero-badges">
          <span className="role-chip">Role: {user?.role || 'user'}</span>
          <span className="role-chip">Active vehicles: {stats.vehicles}</span>
          <span className="role-chip">In transit: {stats.inTransit}</span>
        </div>
      </section>

      <div className="dashboard-links">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to} className="dashboard-link-card">
            <strong>{item.label}</strong>
            <span>Open this workspace</span>
          </Link>
        ))}
      </div>

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
