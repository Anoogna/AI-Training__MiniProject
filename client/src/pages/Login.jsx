import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const getRoleHome = (role) => {
  if (role === 'driver') return '/driver';
  if (role === 'warehouse') return '/warehouse';
  if (role === 'gate') return '/gate';
  return '/dashboard';
};

export default function Login() {
  const [email, setEmail] = useState('dispatcher@logistics.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(getRoleHome(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero-panel">
        <div className="hero-badge">AI-powered logistics control center</div>
        <h1>Fleet dispatch, delivery intelligence, and live operations in one sleek workspace.</h1>
        <p className="hero-copy">
          Monitor vehicles, automate assignments, coordinate drivers, and keep shipment operations moving with a modern command center built for dispatch teams.
        </p>

        <div className="feature-pills">
          <span>Live fleet tracking</span>
          <span>Voice command assistant</span>
          <span>Traffic & route alerts</span>
          <span>Warehouse + gate orchestration</span>
        </div>

        <div className="hero-visual-grid">
          <article className="visual-card large-card glow-card">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
              alt="Professional logistics team in business suits"
            />
            <div className="visual-caption">
              <strong>Dispatch leadership</strong>
              <span>Professional team coordination with real-time shipment visibility.</span>
            </div>
          </article>

          <article className="visual-card mini-card">
            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80"
              alt="Smart logistics dashboard preview"
            />
            <div className="visual-caption">
              <strong>Operations dashboard</strong>
              <span>Fleet map, route alerts, and shipment insights at a glance.</span>
            </div>
          </article>
        </div>

        <div className="mini-stats">
          <article className="mini-stat-card">
            <strong>24/7</strong>
            <span>Live fleet visibility</span>
          </article>
          <article className="mini-stat-card">
            <strong>8</strong>
            <span>Smart operations modules</span>
          </article>
          <article className="mini-stat-card">
            <strong>AI</strong>
            <span>Voice + routing assistance</span>
          </article>
        </div>
      </section>

      <section className="login-card-panel">
        <div className="login-card">
          <div className="login-card-head">
            <p className="eyebrow">Secure access</p>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in with your logistics role to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Sign In</button>
          </form>

          <div className="demo-accounts">
            <p>Demo accounts (password: password123)</p>
            <ul>
              <li>dispatcher@logistics.com</li>
              <li>driver1@logistics.com</li>
              <li>warehouse@logistics.com</li>
              <li>gate@logistics.com</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
