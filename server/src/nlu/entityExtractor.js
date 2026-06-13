export const extractEntities = (text) => {
  const entities = {};

  const vehicleMatch = text.match(/\b(?:vehicle|t|v)[-\s]?(\d{1,3})\b/i);
  if (vehicleMatch) {
    entities.vehicleId = `T-${vehicleMatch[1].padStart(2, '0')}`;
  }

  const shipmentMatch = text.match(/\b(?:sh|shipment)[-\s]?(\d{1,4})\b/i);
  if (shipmentMatch) {
    entities.shipmentId = `SH-${shipmentMatch[1].padStart(3, '0')}`;
  }

  const gateMatch = text.match(/\bgate\s*(\d)\b/i);
  if (gateMatch) {
    entities.gateLane = parseInt(gateMatch[1], 10);
  }

  const aisleMatch = text.match(/\baisle\s*([a-z]\d+)\b/i);
  if (aisleMatch) {
    entities.aisle = aisleMatch[1].toUpperCase();
  }

  const directionMatch = text.match(/\b(entry|enter|exit|leave)\b/i);
  if (directionMatch) {
    const d = directionMatch[1].toLowerCase();
    entities.direction = d === 'enter' || d === 'entry' ? 'entry' : 'exit';
  }

  return entities;
};
