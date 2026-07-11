const INTENT_PATTERNS = [
  { intent: 'get_vehicle_status', patterns: [/where is vehicle/, /vehicle status/, /locate vehicle/, /find vehicle/] },
  { intent: 'list_active_fleet', patterns: [/list fleet/, /active fleet/, /show all vehicles/, /how many vehicles/] },
  { intent: 'locate_driver', patterns: [/locate driver/, /where is driver/, /find driver/] },
  { intent: 'check_inventory', patterns: [/check inventory/, /inventory at/, /stock at aisle/] },
  { intent: 'assign_picking_task', patterns: [/assign pick/, /picking task/, /pick for shipment/] },
  { intent: 'confirm_load', patterns: [/confirm load/, /confirm pick/, /mark pick complete/, /loading complete/] },
  { intent: 'register_entry', patterns: [/register entry/, /vehicle entry/, /gate entry/, /enter gate/] },
  { intent: 'register_exit', patterns: [/register exit/, /vehicle exit/, /gate exit/, /exit gate/] },
  { intent: 'verify_shipment_at_gate', patterns: [/verify shipment/, /check shipment at gate/, /shipment at gate/] },
  { intent: 'list_pending', patterns: [/pending deliveries/, /list pending/, /show pending shipments/] },
  { intent: 'assign_delivery', patterns: [/assign delivery/, /assign pending/, /run assignment/] },
  { intent: 'send_message', patterns: [/send message/, /message driver/, /notify driver/] },
  { intent: 'broadcast_alert', patterns: [/broadcast/, /alert all drivers/, /send alert/] },
  { intent: 'help', patterns: [/help/, /what can you do/, /commands/] },
];

export const classifyIntent = (text, role) => {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(text))) {
      if (role === 'warehouse' && intent.startsWith('register_')) continue;
      if (role === 'gate' && ['check_inventory', 'assign_picking_task'].includes(intent)) continue;
      return intent;
    }
  }
  return 'unknown';
};

export const getHelpForRole = (role) => {
  const help = {
    dispatcher: ['Where is vehicle T-07?', 'List active fleet', 'Assign pending deliveries'],
    driver: ['Where is vehicle T-07?', 'List pending deliveries'],
    warehouse: ['Confirm pick for shipment SH-102 aisle B3', 'Check inventory at aisle A1'],
    gate: ['Register exit gate 2 shipment SH-102', 'Verify shipment at gate'],
    admin: ['List active fleet', 'Broadcast alert all drivers'],
  };
  return help[role] || help.dispatcher;
};
