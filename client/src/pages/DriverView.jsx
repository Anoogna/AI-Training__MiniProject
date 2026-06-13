import { useEffect, useState } from 'react';
import { vehicleAPI, shipmentAPI, routeAPI, trafficAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';

export default function DriverView() {
  const [vehicle, setVehicle] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const { notifications } = useSocket({
    onVehicleLocation: (v) => {
      if (vehicle && v._id === vehicle._id) setVehicle(v);
    },
  });

  useEffect(() => {
    Promise.all([vehicleAPI.list(), shipmentAPI.list(), trafficAPI.alerts()]).then(
      ([v, s, a]) => {
        const inTransit = v.data.find((veh) => veh.status === 'in_transit');
        setVehicle(inTransit || v.data[0]);
        setShipments(s.data.filter((sh) => sh.status === 'in_transit'));
        setAlerts(a.data);
      }
    );
  }, []);

  const updateLocation = async () => {
    if (!vehicle) return;
    const lat = vehicle.currentLocation.lat + (Math.random() - 0.5) * 0.01;
    const lng = vehicle.currentLocation.lng + (Math.random() - 0.5) * 0.01;
    const res = await vehicleAPI.updateLocation(vehicle._id, lat, lng, 'in_transit');
    setVehicle(res.data);
  };

  return (
    <div className="page">
      <h1>Driver Dashboard</h1>

      {vehicle && (
        <div className="panel driver-info">
          <h2>Your Vehicle: {vehicle.vehicleId}</h2>
          <p>Status: {vehicle.status}</p>
          <p>
            Location: {vehicle.currentLocation.lat.toFixed(4)}, {vehicle.currentLocation.lng.toFixed(4)}
          </p>
          <button onClick={updateLocation} type="button">
            Update GPS Location
          </button>
        </div>
      )}

      <div className="panel">
        <h3>Active Deliveries</h3>
        {shipments.map((s) => (
          <div key={s._id} className="delivery-card">
            <strong>{s.trackingId}</strong> → {s.destination?.address}
            <span className={`badge ${s.status}`}>{s.status}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Route Optimization Alerts</h3>
        {alerts.slice(0, 5).map((a) => (
          <div key={a._id} className="alert-card">
            {a.segment} — {a.delayMinutes} min delay ({a.severity})
          </div>
        ))}
        {notifications
          .filter((n) => n.type === 'route')
          .slice(0, 3)
          .map((n) => (
            <div key={n.id} className="alert-card live">
              {n.data?.message}
            </div>
          ))}
      </div>
    </div>
  );
}
