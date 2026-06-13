# Logistics & Vehicle Dispatch Automation

MERN stack platform for logistics dispatch with fleet tracking, delivery coordination bots, driver communication, warehouse voice operations, shipment tracking, AI traffic coordination, smart gate management, and route optimization notifications.

## Features

1. **Fleet tracking voice assistant** — Voice/text NLU queries for vehicle status and fleet overview
2. **Delivery coordination bot** — Auto-assigns pending deliveries to nearest idle vehicles
3. **Driver communication assistant** — Messaging and broadcast alerts to drivers
4. **Warehouse voice operations** — Voice commands to confirm picks and check inventory
5. **Shipment status updates** — Full lifecycle tracking with public customer page
6. **AI-powered traffic coordination** — Simulated traffic analysis with reroute alerts
7. **Smart gate entry/exit assistant** — Manual and voice gate registration with audit log
8. **Route optimization notifications** — OSRM routing with live reroute notifications

## Tech Stack

- **Frontend:** React, Vite, React Router, Leaflet, Socket.io-client, Web Speech API
- **Backend:** Node.js, Express, Socket.io, Mongoose, node-cron
- **Database:** MongoDB
- **Routing:** OSRM (Open Source Routing Machine)

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup

```bash
# Install all dependencies
npm run install:all

# Configure environment (edit server/.env if needed)
# Default: mongodb://127.0.0.1:27017/logistics_dispatch

# Seed demo data
npm run seed

# Run both client and server
npm run dev
```

- **Client:** http://localhost:5173
- **API:** http://localhost:5000/api/health

## Demo Accounts

Password for all: `password123`

| Email | Role |
|-------|------|
| admin@logistics.com | admin |
| dispatcher@logistics.com | dispatcher |
| driver1@logistics.com | driver |
| warehouse@logistics.com | warehouse |
| gate@logistics.com | gate |

## Voice Commands

| Role | Example |
|------|---------|
| Dispatcher | "Where is vehicle T-07?" |
| Dispatcher | "List active fleet" |
| Dispatcher | "Assign pending deliveries" |
| Warehouse | "Confirm pick for shipment SH-102 aisle B3" |
| Gate | "Register exit gate 2 shipment SH-102" |
| Any | "Help" |

## Public Tracking

Visit `/track/SH-103` (no login required) for customer shipment tracking.

## Project Structure

```
client/          React frontend
server/src/
  models/        MongoDB schemas
  routes/        REST API endpoints
  services/      Business logic
  nlu/           Custom voice NLP pipeline
  skills/        Intent handlers (fleet, warehouse, gate)
  sockets/       Real-time WebSocket handlers
server/seed/     Database seed script
docs/            Additional documentation
```

## Environment Variables

See `server/.env.example` for all options.

## End-to-End Demo Scenario

1. Login as **dispatcher@logistics.com**
2. Open Dashboard — view live fleet map and stats
3. Go to **Delivery Bot** → Run Assignment Bot
4. Use **Voice Assistant**: "Where is vehicle T-07?"
5. Go to **Shipments** → update status to `in_transit`
6. Login as **warehouse@logistics.com** → voice: "Confirm pick for shipment SH-102 aisle B3"
7. Login as **gate@logistics.com** → voice: "Register exit gate 2 shipment SH-102"
8. Open `/track/SH-103` in a new tab for customer tracking
9. Login as **driver1@logistics.com** → view route optimization alerts
