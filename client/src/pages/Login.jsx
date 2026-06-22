import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleHome } from '../config/roleAccess';

const featurePills = ['Live fleet tracking', 'Voice assistant', 'Route intelligence', 'Gate operations'];

const heroCards = [
  {
    title: 'Dispatch control',
    description: 'Coordinate fleets, shipments, and drivers from one calm command surface.',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    alt: 'Professional logistics team in business suits',
    large: true,
  },
  {
    title: 'Live operations',
    description: 'Monitor route updates, live alerts, and shipment activity in real time.',
    src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    alt: 'Smart logistics dashboard preview',
    large: false,
  },
];

const stats = [
  { value: '24/7', label: 'Fleet visibility' },
  { value: '8+', label: 'Operations modules' },
  { value: 'AI', label: 'Voice and routing' },
];

const loginVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
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
    <main className="login-page">
      <motion.section
        className="login-showcase"
        variants={loginVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="login-badge" variants={itemVariants}>
          AI-powered logistics control center
        </motion.div>
        <motion.h1 variants={itemVariants}>
          Fleet dispatch, delivery intelligence, and live operations in one polished workspace.
        </motion.h1>
        <motion.p className="login-copy" variants={itemVariants}>
          Monitor vehicles, automate assignments, coordinate drivers, and keep shipment operations moving with a premium command center built for dispatch teams.
        </motion.p>

        <motion.div className="login-pill-row" variants={itemVariants}>
          {featurePills.map((pill) => (
            <span key={pill}>{pill}</span>
          ))}
        </motion.div>

        <motion.div className="login-image-grid" variants={itemVariants}>
          {heroCards.map((card) => (
            <HeroVisualCard key={card.title} {...card} />
          ))}
        </motion.div>

        <motion.div className="login-stat-row" variants={itemVariants}>
          {stats.map((item) => (
            <article key={item.label} className="login-stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="login-panel"
        variants={loginVariants}
        initial="hidden"
        animate="show"
      >
        <div className="login-panel-card">
          <motion.div className="login-panel-head" variants={itemVariants}>
            <p className="login-eyebrow">Secure access</p>
            <h2>Welcome back</h2>
            <p>Sign in with your logistics role to access the dashboard.</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="login-form" variants={itemVariants}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="login-error">{error}</p>}
            <button type="submit">Sign In</button>
          </motion.form>

          <motion.div className="login-demo" variants={itemVariants}>
            <p>Demo accounts</p>
            <ul>
              <li>dispatcher@logistics.com</li>
              <li>driver1@logistics.com</li>
              <li>warehouse@logistics.com</li>
              <li>gate@logistics.com</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

function HeroVisualCard({ src, alt, title, description, large }) {
  return (
    <article className={`login-visual-card ${large ? 'is-large' : 'is-small'}`}>
      <div className="login-visual-frame">
        <img src={src} alt={alt} />
        <div className="login-visual-overlay" />
      </div>
      <div className="visual-caption">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </article>
  );
}
