import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Dashboard', roles: ['admin', 'dispatcher', 'driver', 'warehouse', 'gate'] },
  { path: '/fleet', label: 'Fleet', roles: ['admin', 'dispatcher', 'driver'] },
  { path: '/shipments', label: 'Shipments', roles: ['admin', 'dispatcher'] },
  { path: '/delivery', label: 'Delivery Bot', roles: ['admin', 'dispatcher'] },
  { path: '/messages', label: 'Messages', roles: ['admin', 'dispatcher', 'driver'] },
  { path: '/warehouse', label: 'Warehouse', roles: ['admin', 'warehouse', 'dispatcher'] },
  { path: '/gate', label: 'Gate', roles: ['admin', 'gate', 'dispatcher'] },
  { path: '/driver', label: 'Driver View', roles: ['driver'] },
];

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const visible = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <nav className="navbar">
      <div className="nav-brand">Logistics Dispatch</div>
      <div className="nav-links">
        {visible.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="nav-user">
        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <span>{user?.name} ({user?.role})</span>
        <button onClick={logout} type="button">
          Logout
        </button>
      </div>
    </nav>
  );
}
