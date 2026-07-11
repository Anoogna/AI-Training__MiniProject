import natural from 'natural';

const TRAINING_DATA = {
  get_vehicle_status: [
    'where is vehicle T-05',
    'hey where is my truck',
    'can you locate my vehicle',
    'track vehicle T-07 for me',
    'what is the current location of van 12',
    'give me the live status of truck 18',
    'show me where the vehicle is right now',
    'which route is my truck on',
    'is vehicle T-05 moving',
    'find the location of my delivery truck',
  ],
  list_active_fleet: [
    'list active fleet',
    'show me all active vehicles',
    'how many vehicles are on the road',
    'display the fleet status',
    'which trucks are currently active',
    'give me the live fleet overview',
    'list all vehicles in service',
    'what is the active vehicle count',
    'show the dispatch fleet',
    'pull up the current fleet list',
  ],
  locate_driver: [
    'locate driver',
    'where is driver Ahmed',
    'find driver Priya',
    'show me the driver location',
    'track my driver right now',
    'what is the current position of the driver',
    'can you tell me where the driver is',
    'get driver location for me',
    'which gate is the driver at',
    'help me find the assigned driver',
  ],
  check_inventory: [
    'check inventory',
    'what stock do we have in aisle B3',
    'show inventory levels for zone A',
    'how much stock is left in the warehouse',
    'look up inventory at rack 4',
    'what items are available right now',
    'check the warehouse stock count',
    'tell me the inventory for bin 12',
    'scan inventory at aisle C2',
    'do we have enough stock for order 44',
  ],
  assign_picking_task: [
    'assign picking task',
    'create a pick list for shipment SH-10',
    'send a picker to aisle B4',
    'start a picking job for order 22',
    'schedule picking for the outbound load',
    'assign someone to pick the items now',
    'prepare a picking task for the warehouse team',
    'give the next pick to the floor staff',
    'mark this shipment for picking',
    'set up a warehouse pick request',
  ],
  confirm_load: [
    'confirm load',
    'mark the pick as complete',
    'loading is finished for shipment SH-10',
    'confirm that the truck is loaded',
    'the parcel has been loaded onto the vehicle',
    'record loading completion for the shipment',
    'approve the load now',
    'we have finished loading the truck',
    'close the loading task',
    'confirm the outbound load is ready',
  ],
  register_entry: [
    'register entry',
    'vehicle entered gate 2',
    'log this truck at the entrance',
    'record the arrival at the gate',
    'mark vehicle entry for the yard',
    'the driver just came through the gate',
    'check in the vehicle at security',
    'add an entry log for truck T-05',
    'start gate entry for the shipment vehicle',
    'confirm arrival at the depot gate',
  ],
  register_exit: [
    'register exit',
    'vehicle left gate 1',
    'log truck exit from the yard',
    'record departure from the warehouse',
    'mark the vehicle as exited',
    'the driver just cleared the gate',
    'check out the vehicle at security',
    'add an exit log for truck T-09',
    'confirm the truck is leaving the site',
    'close the gate exit for this shipment',
  ],
  verify_shipment_at_gate: [
    'verify shipment at gate',
    'check this shipment before it leaves the gate',
    'is shipment SH-22 at the checkpoint',
    'validate the parcel at the gate',
    'confirm the shipment against the gate log',
    'does the shipment match the manifest',
    'inspect the shipment at gate 3',
    'make sure the cargo is correct at the gate',
    'verify the package before exit',
    'compare the shipment details at the gate',
  ],
  list_pending: [
    'list pending deliveries',
    'show pending shipments',
    'what deliveries are still waiting',
    'give me all open delivery jobs',
    'which orders are pending right now',
    'pull up the backlog of shipments',
    'display all unassigned deliveries',
    'list everything waiting for dispatch',
    'show me the queued shipments',
    'what is still pending for delivery',
  ],
  assign_delivery: [
    'assign delivery',
    'run assignment for the pending deliveries',
    'dispatch the open shipment now',
    'allocate this delivery to a driver',
    'assign the next shipment to vehicle T-05',
    'start delivery assignment',
    'send the pending order to a truck',
    'match the delivery with an available vehicle',
    'create a delivery assignment for the route',
    'put the shipment on a driver schedule',
  ],
  send_message: [
    'send message',
    'message the driver',
    'notify driver about the delay',
    'send a note to the fleet team',
    'text the assigned driver',
    'pass a message to warehouse staff',
    'inform the driver of the update',
    'deliver a message to the dispatch team',
    'send instructions to the vehicle operator',
    'ping the driver with the new route',
  ],
  broadcast_alert: [
    'broadcast alert',
    'alert all drivers',
    'send a fleet-wide warning',
    'broadcast the traffic update',
    'notify everyone on the dispatch team',
    'push an urgent alert to all vehicles',
    'send the message to every driver',
    'announce the update to the fleet',
    'raise an alert for the whole team',
    'broadcast the delay to all drivers',
  ],
  help: [
    'help',
    'what can you do',
    'show me the commands',
    'what voice commands are available',
    'give me help for dispatch',
    'how do I use this assistant',
    'list the things you can handle',
    'what should I say to you',
    'show help options',
    'i need assistance',
  ],
};

const classifier = new natural.BayesClassifier();

for (const [intent, phrases] of Object.entries(TRAINING_DATA)) {
  for (const phrase of phrases) {
    classifier.addDocument(phrase, intent);
  }
}

classifier.train();

export const classifyIntentML = (text) => {
  const input = typeof text === 'string' ? text.trim().toLowerCase() : '';
  if (!input) {
    return 'unknown';
  }

  const classifications = classifier.getClassifications(input);
  const top = classifications[0];

  if (!top || !top.label) {
    return 'unknown';
  }

  const second = classifications[1];
  const confidence = top.value;
  const margin = second ? top.value - second.value : top.value;

  if (confidence < 0.001 || margin < 0.0005) {
    return 'unknown';
  }

  return top.label;
};
