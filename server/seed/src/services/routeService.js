const OSRM_BASE = () => process.env.OSRM_BASE_URL || 'http://router.project-osrm.org';

export const fetchRoute = async (origin, destination) => {
  const url = `${OSRM_BASE()}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) {
      return simulateRoute(origin, destination);
    }

    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));

    return {
      waypoints: [origin, destination],
      optimizedPath: coords,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      baselineDurationSeconds: route.duration,
    };
  } catch {
    return simulateRoute(origin, destination);
  }
};

const simulateRoute = (origin, destination) => {
  const dist =
    Math.sqrt(
      (destination.lat - origin.lat) ** 2 + (destination.lng - origin.lng) ** 2
    ) * 111000;

  return {
    waypoints: [origin, destination],
    optimizedPath: [origin, destination],
    distanceMeters: dist,
    durationSeconds: dist / 10,
    baselineDurationSeconds: dist / 10,
  };
};

export const optimizeRouteForShipment = async (shipment, RoutePlan) => {
  if (!shipment.origin?.lat || !shipment.destination?.lat) return null;

  const routeData = await fetchRoute(shipment.origin, shipment.destination);

  let plan = await RoutePlan.findOne({ shipment: shipment._id });
  if (!plan) {
    plan = new RoutePlan({ shipment: shipment._id });
  }

  Object.assign(plan, routeData, { lastRecalculatedAt: new Date() });
  await plan.save();
  return plan;
};
