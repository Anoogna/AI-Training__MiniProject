import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
import Vehicle from '../src/models/Vehicle.js';
import Shipment from '../src/models/Shipment.js';
import DeliveryTask from '../src/models/DeliveryTask.js';
import WarehouseTask from '../src/models/WarehouseTask.js';
import RoutePlan from '../src/models/RoutePlan.js';
import { optimizeRouteForShipment } from '../src/services/routeService.js';

const locations = {
  mumbaiHub: { address: 'Mumbai Hub', lat: 19.076, lng: 72.8777 },
  puneDepot: { address: 'Pune Depot', lat: 18.5204, lng: 73.8567 },
  nashikWH: { address: 'Nashik Warehouse', lat: 19.9975, lng: 73.7898 },
  thaneGate: { address: 'Thane Distribution', lat: 19.2183, lng: 72.9781 },
  naviMumbai: { address: 'Navi Mumbai Client', lat: 19.033, lng: 73.0297 },
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Shipment.deleteMany({}),
    DeliveryTask.deleteMany({}),
    WarehouseTask.deleteMany({}),
    RoutePlan.deleteMany({}),
  ]);

  const password = await bcrypt.hash('password123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@logistics.com',
    password,
    role: 'admin',
  });

  const dispatcher = await User.create({
    name: 'Dispatch Manager',
    email: 'dispatcher@logistics.com',
    password,
    role: 'dispatcher',
  });

  const drivers = await User.insertMany([
    { name: 'Raj Driver', email: 'driver1@logistics.com', password, role: 'driver', driverId: 'DRV-01' },
    { name: 'Amit Driver', email: 'driver2@logistics.com', password, role: 'driver', driverId: 'DRV-02' },
    { name: 'Suresh Driver', email: 'driver3@logistics.com', password, role: 'driver', driverId: 'DRV-03' },
  ]);

  const warehouseStaff = await User.create({
    name: 'Warehouse Operator',
    email: 'warehouse@logistics.com',
    password,
    role: 'warehouse',
    warehouseId: 'WH-01',
  });

  const gateOperator = await User.create({
    name: 'Gate Operator',
    email: 'gate@logistics.com',
    password,
    role: 'gate',
  });

  const vehicles = await Vehicle.insertMany([
    { vehicleId: 'T-01', plate: 'MH-01-AB-1234', status: 'idle', currentLocation: locations.mumbaiHub, assignedDriver: drivers[0]._id },
    { vehicleId: 'T-02', plate: 'MH-02-CD-5678', status: 'idle', currentLocation: locations.puneDepot, assignedDriver: drivers[1]._id },
    { vehicleId: 'T-03', plate: 'MH-03-EF-9012', status: 'idle', currentLocation: locations.nashikWH, assignedDriver: drivers[2]._id },
    { vehicleId: 'T-04', plate: 'MH-04-GH-3456', status: 'maintenance', currentLocation: locations.mumbaiHub },
    { vehicleId: 'T-05', plate: 'MH-05-IJ-7890', status: 'idle', currentLocation: locations.thaneGate },
    { vehicleId: 'T-07', plate: 'MH-07-KL-1122', status: 'in_transit', currentLocation: { lat: 19.05, lng: 72.95 }, assignedDriver: drivers[0]._id },
  ]);

  const shipmentData = [
    { trackingId: 'SH-101', origin: locations.mumbaiHub, destination: locations.puneDepot, status: 'created', customerName: 'ABC Corp', priority: 2 },
    { trackingId: 'SH-102', origin: locations.nashikWH, destination: locations.naviMumbai, status: 'picked', customerName: 'XYZ Ltd', priority: 3 },
    { trackingId: 'SH-103', origin: locations.puneDepot, destination: locations.thaneGate, status: 'in_transit', customerName: 'Quick Retail', priority: 1 },
    { trackingId: 'SH-104', origin: locations.mumbaiHub, destination: locations.naviMumbai, status: 'in_transit', customerName: 'Metro Supplies', priority: 2 },
    { trackingId: 'SH-105', origin: locations.thaneGate, destination: locations.puneDepot, status: 'at_gate', customerName: 'Fresh Foods', priority: 1 },
    { trackingId: 'SH-106', origin: locations.nashikWH, destination: locations.mumbaiHub, status: 'delivered', customerName: 'BuildCo', priority: 1 },
    { trackingId: 'SH-107', origin: locations.mumbaiHub, destination: locations.nashikWH, status: 'created', customerName: 'Tech Parts', priority: 2 },
    { trackingId: 'SH-108', origin: locations.puneDepot, destination: locations.naviMumbai, status: 'picked', customerName: 'HomeStyle', priority: 3 },
    { trackingId: 'SH-109', origin: locations.thaneGate, destination: locations.mumbaiHub, status: 'created', customerName: 'City Mart', priority: 1 },
    { trackingId: 'SH-110', origin: locations.naviMumbai, destination: locations.puneDepot, status: 'in_transit', customerName: 'AutoZone', priority: 2 },
  ];

  const shipments = [];
  for (const data of shipmentData) {
    const shipment = await Shipment.create({
      ...data,
      assignedVehicle: data.status === 'in_transit' ? vehicles[5]._id : data.trackingId === 'SH-103' ? vehicles[2]._id : undefined,
      assignedDriver: data.status === 'in_transit' ? drivers[0]._id : undefined,
      statusTimeline: [{ status: data.status, note: `Seeded as ${data.status}` }],
      eta: new Date(Date.now() + 3600000 * 4),
    });
    shipments.push(shipment);

    await DeliveryTask.create({
      shipment: shipment._id,
      priority: data.priority,
      status: ['created', 'picked'].includes(data.status) ? 'pending' : 'assigned',
      assignedVehicle: shipment.assignedVehicle,
      assignedDriver: shipment.assignedDriver,
    });

    if (data.status === 'in_transit') {
      await optimizeRouteForShipment(shipment, RoutePlan);
    }
  }

  await WarehouseTask.insertMany([
    { type: 'pick', shipment: shipments[1]._id, location: 'Aisle B3', status: 'in_progress', assignedStaff: warehouseStaff._id },
    { type: 'load', shipment: shipments[2]._id, location: 'Dock 2', status: 'pending' },
    { type: 'scan', shipment: shipments[7]._id, location: 'Aisle A1', status: 'pending', assignedStaff: warehouseStaff._id },
    { type: 'pick', shipment: shipments[0]._id, location: 'Aisle C2', status: 'pending' },
  ]);

  console.log('\n=== Seed completed ===');
  console.log('Demo accounts (password: password123):');
  console.log('  admin@logistics.com       - admin');
  console.log('  dispatcher@logistics.com  - dispatcher');
  console.log('  driver1@logistics.com     - driver');
  console.log('  warehouse@logistics.com   - warehouse');
  console.log('  gate@logistics.com        - gate');
  console.log(`\nCreated ${vehicles.length} vehicles, ${shipments.length} shipments`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
