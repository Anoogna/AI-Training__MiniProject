export const roleHomes = {
  admin: '/dashboard',
  dispatcher: '/dashboard',
  driver: '/driver',
  warehouse: '/warehouse',
  gate: '/gate',
};

export const featureAccess = {
  Dashboard: ['admin', 'dispatcher', 'driver', 'warehouse', 'gate'],
  Fleet: ['admin', 'dispatcher', 'driver'],
  Shipments: ['admin', 'dispatcher'],
  Delivery: ['admin', 'dispatcher'],
  Messages: ['admin', 'dispatcher', 'driver'],
  Warehouse: ['admin', 'warehouse', 'dispatcher'],
  Gate: ['admin', 'gate', 'dispatcher'],
  Driver: ['driver'],
  Leads: ['admin'],
};

export const routeAccess = {
  '/': ['admin', 'dispatcher', 'driver', 'warehouse', 'gate'],
  '/dashboard': ['admin', 'dispatcher', 'driver', 'warehouse', 'gate'],
  '/fleet': ['admin', 'dispatcher', 'driver'],
  '/shipments': ['admin', 'dispatcher'],
  '/delivery': ['admin', 'dispatcher'],
  '/messages': ['admin', 'dispatcher', 'driver'],
  '/warehouse': ['admin', 'warehouse', 'dispatcher'],
  '/gate': ['admin', 'gate', 'dispatcher'],
  '/driver': ['driver'],
  '/leads': ['admin'],
};

export const actionAccess = {
  shipments: {
    created: ['admin', 'dispatcher'],
    picked: ['admin'],
    in_transit: ['admin', 'dispatcher'],
    at_gate: ['admin'],
    delivered: ['admin'],
  },
  warehouse: {
    complete_task: ['admin', 'warehouse'],
    create_task: ['admin', 'warehouse', 'dispatcher'],
  },
  gate: {
    register_entry: ['admin', 'gate', 'dispatcher'],
    register_exit: ['admin', 'gate', 'dispatcher'],
  },
};

export const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/fleet', label: 'Fleet' },
  { path: '/shipments', label: 'Shipments' },
  { path: '/delivery', label: 'Delivery Bot' },
  { path: '/messages', label: 'Messages' },
  { path: '/warehouse', label: 'Warehouse' },
  { path: '/gate', label: 'Gate' },
  { path: '/driver', label: 'Driver View' },
  { path: '/leads', label: 'Leads' },
];

export const getRoleHome = (role) => roleHomes[role] || '/dashboard';

export const canAccess = (role, path) => (routeAccess[path] || []).includes(role);

export const visibleNavItems = (role) => navItems.filter((item) => canAccess(role, item.path));

export const canAccessAction = (role, group, action) => (actionAccess[group]?.[action] || []).includes(role);
