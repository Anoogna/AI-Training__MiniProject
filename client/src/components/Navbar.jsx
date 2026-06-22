import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { visibleNavItems } from '../config/roleAccess';

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const visible = visibleNavItems(user?.role).map((item) => ({
    ...item,
    path: item.path === '/dashboard' ? '/' : item.path,
  }));

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
