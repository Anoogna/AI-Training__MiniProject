import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';

import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import vehicleRoutes from './routes/vehicles.js';
import deliveryRoutes from './routes/delivery.js';
import messageRoutes from './routes/messages.js';
import routeRoutes from './routes/routes.js';
import trafficRoutes from './routes/traffic.js';
import gateRoutes from './routes/gate.js';
import warehouseRoutes from './routes/warehouse.js';
import voiceRoutes from './routes/voice.js';
import { setupSockets } from './sockets/index.js';
import { checkTrafficAndReroute } from './services/trafficService.js';
import Vehicle from './models/Vehicle.js';
import Shipment from './models/Shipment.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH'] },
});

app.set('io', io);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Logistics Dispatch API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/gate', gateRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/voice', voiceRoutes);

setupSockets(io);

const simulateGpsMovement = async () => {
  const inTransitVehicles = await Vehicle.find({ status: 'in_transit' });
  for (const vehicle of inTransitVehicles) {
    const shipment = await Shipment.findOne({
      assignedVehicle: vehicle._id,
      status: 'in_transit',
    });
    if (!shipment?.destination?.lat) continue;

    const lat =
      vehicle.currentLocation.lat +
      (shipment.destination.lat - vehicle.currentLocation.lat) * 0.02;
    const lng =
      vehicle.currentLocation.lng +
      (shipment.destination.lng - vehicle.currentLocation.lng) * 0.02;

    vehicle.currentLocation = { lat, lng };
    await vehicle.save();
    io.emit('vehicle:location', vehicle);
  }
};

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    cron.schedule('*/3 * * * *', () => simulateGpsMovement());
    cron.schedule('*/5 * * * *', () => checkTrafficAndReroute(io));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
