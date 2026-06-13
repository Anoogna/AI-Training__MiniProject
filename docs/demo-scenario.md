# End-to-End Demo Script (Viva / Presentation)

Use this script to demonstrate all 8 features in one connected story.

## Preparation

1. Start MongoDB and run `npm run seed`
2. Run `npm run dev` (client + server)
3. Open http://localhost:5173

## Demo Flow (~10 minutes)

### Step 1: Dispatcher Dashboard (Features 1, 5, 6, 8)

1. Login: `dispatcher@logistics.com` / `password123`
2. Show **Operations Dashboard** — stats, live fleet map
3. **Voice:** "Where is vehicle T-07?" → map focuses, spoken response with location
4. **Voice:** "List active fleet" → fleet summary
5. Go to **Shipments** → show status timeline for SH-103
6. Open new tab: `/track/SH-103` → customer tracking (no login)

### Step 2: Delivery Coordination (Feature 2)

1. Go to **Delivery Bot**
2. Click **Run Assignment Bot** → pending shipments assigned to nearest vehicles
3. In chat panel, type `run bot` or `show pending`

### Step 3: Driver Communication (Feature 3)

1. Go to **Messages**
2. Broadcast: "Route change expected on Western Express Highway. Check alerts."
3. Logout → login as `driver1@logistics.com`
4. Go to **Driver View** → see active deliveries and route alerts

### Step 4: Traffic & Route Optimization (Features 6, 8)

1. As dispatcher, call API or wait for cron (every 5 min)
2. Or: POST `/api/traffic/check` from dashboard notifications
3. Show route alert on driver dashboard
4. Explain OSRM integration in **Routes** (background job)

### Step 5: Warehouse Voice (Feature 4)

1. Logout → login as `warehouse@logistics.com`
2. Go to **Warehouse** → show task list (Aisle B3, etc.)
3. **Voice:** "Confirm pick for shipment SH-102 aisle B3"
4. Task marked completed

### Step 6: Smart Gate (Feature 7)

1. Logout → login as `gate@logistics.com`
2. Go to **Gate**
3. **Voice:** "Register exit gate 2 shipment SH-102"
4. Show gate log entry with source: voice
5. Shipment status updates automatically

### Step 7: Architecture Highlights (for evaluators)

- Custom NLU in `server/src/nlu/` (not a black-box widget)
- Socket.io real-time: shipment, vehicle, gate, route events
- Role-based JWT auth on all protected routes
- MongoDB collections for full audit trail

## Quick Voice Command Reference

See [voice-commands.md](./voice-commands.md)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Mic not working | Use text fallback input |
| MongoDB error | Start MongoDB or update `MONGODB_URI` in `.env` |
| Map empty | Run seed script for vehicle locations |
