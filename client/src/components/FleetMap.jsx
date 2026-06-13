import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const vehicleIcon = new L.DivIcon({
  className: 'vehicle-marker',
  html: '<div style="background:#2563eb;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">V</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function FleetMap({ vehicles = [], routes = [], focusVehicleId }) {
  const center = vehicles[0]?.currentLocation
    ? [vehicles[0].currentLocation.lat, vehicles[0].currentLocation.lng]
    : [19.076, 72.8777];

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v) => (
          <Marker
            key={v._id}
            position={[v.currentLocation.lat, v.currentLocation.lng]}
            icon={focusVehicleId === v.vehicleId ? vehicleIcon : icon}
          >
            <Popup>
              <strong>{v.vehicleId}</strong>
              <br />
              Status: {v.status}
              <br />
              Plate: {v.plate}
            </Popup>
          </Marker>
        ))}
        {routes.map((route, i) =>
          route.optimizedPath?.length > 1 ? (
            <Polyline
              key={i}
              positions={route.optimizedPath.map((p) => [p.lat, p.lng])}
              color="#ef4444"
              weight={3}
            />
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
