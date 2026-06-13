import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shipmentAPI } from '../services/api';

export default function TrackShipment() {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    shipmentAPI
      .track(trackingId)
      .then((res) => setShipment(res.data))
      .catch(() => setError('Shipment not found'));
  }, [trackingId]);

  if (error) {
    return (
      <div className="track-page">
        <div className="track-card">
          <h1>Track Shipment</h1>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="track-page">
        <div className="track-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="track-page">
      <div className="track-card">
        <h1>Shipment {shipment.trackingId}</h1>
        <p>
          Status: <span className={`badge ${shipment.status}`}>{shipment.status}</span>
        </p>
        <p>Customer: {shipment.customerName}</p>
        <p>From: {shipment.origin?.address}</p>
        <p>To: {shipment.destination?.address}</p>
        {shipment.eta && <p>ETA: {new Date(shipment.eta).toLocaleString()}</p>}

        <h3>Status Timeline</h3>
        <ul className="timeline">
          {shipment.statusTimeline?.map((ev, i) => (
            <li key={i}>
              <strong>{ev.status}</strong> — {ev.note}
              <small>{new Date(ev.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
