# Architecture Overview

## System Diagram

```
React Client (Dashboard, Maps, Voice, Chat)
        │
        ├── REST API (Express)
        └── WebSocket (Socket.io)
                │
        ┌───────┴───────┐
        │               │
   MongoDB         External APIs
                  (OSRM routing)
```

## Custom NLU Pipeline

Located in `server/src/nlu/`:

1. **normalizer.js** — Text preprocessing
2. **entityExtractor.js** — Extract vehicle ID, shipment ID, gate lane, aisle
3. **intentClassifier.js** — Pattern-based intent matching (20+ patterns)
4. **dialogManager.js** — Session state and slot filling
5. **skillRouter.js** — Routes intents to skill handlers

Skill handlers in `server/src/skills/fleetSkill.js` handle fleet, warehouse, gate, delivery, and comms intents.

## Real-time Events

| Event | Trigger |
|-------|---------|
| shipment:updated | Status change |
| vehicle:location | GPS update or simulation |
| route:alert | Traffic reroute (cron every 5 min) |
| message:new | New message or broadcast |
| gate:event | Gate entry/exit |
| delivery:bot_run | Bot assignment run |

## Background Jobs

- **GPS simulation** — Every 3 minutes, moves in-transit vehicles toward destination
- **Traffic check** — Every 5 minutes, generates traffic alerts for in-transit shipments

## Data Models

See README for collection list: User, Vehicle, Shipment, DeliveryTask, Message, RoutePlan, TrafficAlert, GateLog, WarehouseTask, VoiceSession.
