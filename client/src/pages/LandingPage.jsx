import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Boxes,
  Globe2,
  MapPinned,
  MessageSquareText,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  Warehouse,
  X,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { leadAPI } from '../services/api';
import './LandingPage.css';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const trustLogos = ['NorthStar Freight', 'Vertex Logistics', 'Apex Transport', 'BlueHarbor Cargo', 'RouteChain'];

const stats = [
  { value: '40%', label: 'fewer missed calls' },
  { value: '24/7', label: 'dispatch coverage' },
  { value: '3x', label: 'faster driver response' },
  { value: '60%', label: 'less manual coordination' },
];

const painPoints = [
  'Dispatch teams lose time to repetitive calls, manual status checks, and fragmented updates.',
  'Drivers, warehouse staff, and gate teams often work from different systems and inconsistent information.',
  'Customers expect instant updates while operations still rely on slow, error-prone workflows.',
];

const featureCards = [
  {
    icon: Sparkles,
    title: 'Fleet Tracking Voice Assistant',
    description:
      'Ask for live vehicle locations, ETA changes, and trip status updates through natural voice commands. Dispatch teams get instant visibility without hunting through multiple screens.',
  },
  {
    icon: Boxes,
    title: 'Delivery Coordination Bot',
    description:
      'Automate scheduling, rerouting, and delivery confirmations with an AI assistant that keeps assignments moving and reduces manual dispatch work.',
  },
  {
    icon: MessageSquareText,
    title: 'Driver Communication Assistant',
    description:
      'Send hands-free check-ins, alerts, and broadcast updates to drivers so they can stay focused on the road while operations remain aligned.',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Voice Operations',
    description:
      'Use voice commands to manage inventory checks, loading, and unloading tasks while warehouse teams keep pace with live operational changes.',
  },
  {
    icon: MapPinned,
    title: 'Shipment Status Updates',
    description:
      'Automatically notify customers and stakeholders about shipment milestones, improving transparency while reducing repetitive support calls.',
  },
  {
    icon: Activity,
    title: 'AI-Powered Traffic Coordination',
    description:
      'Continuously evaluate traffic conditions and recommend route changes so deliveries can avoid delays before they become costly.',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Gate Entry/Exit Assistant',
    description:
      'Automate gate check-ins and check-outs with voice-based workflows that create a cleaner yard management audit trail.',
  },
  {
    icon: Globe2,
    title: 'Route Optimization Notifications',
    description:
      'Receive proactive alerts about route improvements, bottlenecks, and reroute opportunities so every shipment stays on the best path.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Connect your systems',
    text: 'Import vehicles, drivers, shipments, and warehouse workflows from your existing stack.',
  },
  {
    number: '02',
    title: 'Launch voice agents',
    text: 'Enable AI assistants across dispatch, fleet, gate, and warehouse operations in minutes.',
  },
  {
    number: '03',
    title: 'Monitor live operations',
    text: 'Track status, voice logs, route alerts, and performance metrics from a unified dashboard.',
  },
  {
    number: '04',
    title: 'Continuously optimize',
    text: 'Use real-time data and AI insights to keep routes efficient and teams synchronized.',
  },
];

const testimonials = [
  {
    quote:
      'We cut down dispatch call volume dramatically and now our fleet team spends more time solving exceptions instead of chasing updates.',
    name: 'Anika Sharma',
    title: 'Operations Director',
    company: 'NorthStar Freight',
    initials: 'AS',
  },
  {
    quote:
      'The voice assistant and live route alerts made warehouse handoffs cleaner, faster, and much easier for our team to manage on busy days.',
    name: 'Rohit Mehta',
    title: 'Logistics Manager',
    company: 'Vertex Logistics',
    initials: 'RM',
  },
  {
    quote:
      'Our drivers, gate staff, and dispatchers finally work from the same source of truth. That alone has improved responsiveness across the board.',
    name: 'Priya Nair',
    title: 'Fleet Program Lead',
    company: 'BlueHarbor Cargo',
    initials: 'PN',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Custom',
    blurb: 'Best for small teams getting started with voice automation.',
    features: ['Voice assistant', 'Basic shipment tracking', 'Manual dispatch workflows', 'Email support'],
    accent: false,
  },
  {
    name: 'Professional',
    price: 'Custom',
    blurb: 'Ideal for growing fleets and dispatch operations.',
    features: ['All Starter features', 'Automated routing insights', 'Driver messaging', 'Gate and warehouse voice operations', 'Priority support'],
    accent: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'Built for large logistics networks and complex integrations.',
    features: ['All Professional features', 'Advanced analytics', 'Custom integrations', 'Dedicated success manager', 'Security review and SSO'],
    accent: false,
  },
];

const faqs = [
  {
    question: 'How long does implementation take?',
    answer:
      'Most teams can launch the core workflows in a few weeks, depending on integrations, data structure, and the number of operational roles involved.',
  },
  {
    question: 'Can DispatchAI integrate with our existing tools?',
    answer:
      'Yes. The platform is designed to connect with fleet, dispatch, warehouse, and communication systems through APIs and custom workflows.',
  },
  {
    question: 'How is security and data privacy handled?',
    answer:
      'The product is designed with role-based access, authentication, and auditable events so teams can control who can see and change operational data.',
  },
  {
    question: 'Do you support voice and mobile workflows?',
    answer:
      'Yes. Dispatch, warehouse, and gate workflows are designed to support voice commands and mobile-friendly interfaces.',
  },
  {
    question: 'What size teams is this for?',
    answer:
      'DispatchAI scales from small fleets to enterprise logistics networks with multiple depots, warehouses, and yard locations.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'Pricing is tailored to the scope of deployment, required integrations, and support model. Contact sales to get a custom proposal.',
  },
];

const dashboardHighlights = [
  { label: 'Live vehicles', value: '18 active', tone: 'accent' },
  { label: 'Voice calls', value: '42 today', tone: 'muted' },
  { label: 'Traffic alerts', value: '5 reroutes', tone: 'warning' },
  { label: 'Warehouse tasks', value: '12 in progress', tone: 'success' },
];

const dashboardActivity = [
  { time: '08:14', title: 'Driver check-in', text: 'Vehicle T-07 confirmed departure from Pune depot.' },
  { time: '08:41', title: 'Dispatch update', text: 'Shipment SH-103 rerouted because of traffic congestion.' },
  { time: '09:03', title: 'Gate entry', text: 'Gate 2 checked in shipment SH-102 for loading.' },
];

const defaultDemo = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
};

function scrollToId(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function useRevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function validateDemoForm(values) {
  const nextErrors = {};
  if (!values.name.trim()) nextErrors.name = 'Name is required.';
  if (!values.email.trim()) nextErrors.email = 'Email is required.';
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Enter a valid email address.';
  if (!values.company.trim()) nextErrors.company = 'Company is required.';
  if (!values.phone.trim()) nextErrors.phone = 'Phone number is required.';
  if (values.phone && !/^[+\d()\-\s]{7,}$/.test(values.phone)) nextErrors.phone = 'Enter a valid phone number.';
  return nextErrors;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [demoForm, setDemoForm] = useState(defaultDemo);
  const [demoErrors, setDemoErrors] = useState({});
  const [demoMessage, setDemoMessage] = useState('');
  const nameFieldRef = useRef(null);

  useRevealOnScroll();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isDemoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isDemoOpen]);

  useEffect(() => {
    if (isDemoOpen) {
      window.requestAnimationFrame(() => {
        nameFieldRef.current?.focus();
      });
    }
  }, [isDemoOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDemoOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      scrollToId(href.slice(1));
    }
  };

  const handleDemoSubmit = (event) => {
    event.preventDefault();
    const errors = validateDemoForm(demoForm);
    setDemoErrors(errors);
    if (Object.keys(errors).length) {
      setDemoMessage('');
      return;
    }

    leadAPI
      .demo(demoForm)
      .then(() => {
        setDemoMessage('Thanks. Your demo request has been sent and saved in MongoDB. Our team will reach out shortly.');
        setDemoErrors({});
        setDemoForm(defaultDemo);
      })
      .catch((error) => {
        setDemoMessage('');
        setDemoErrors({ submit: error.response?.data?.message || 'Unable to submit demo request.' });
      });
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    leadAPI
      .newsletter(newsletterEmail)
      .then(() => {
        setNewsletterMessage('Thanks for subscribing. Your email is stored in MongoDB.');
        setNewsletterEmail('');
      })
      .catch((error) => {
        setNewsletterMessage(error.response?.data?.message || 'Unable to subscribe right now.');
      });
  };

  const floatingStats = useMemo(() => [
    { label: 'Dispatch queue', value: '09 pending' },
    { label: 'AI voice sessions', value: '16 active' },
    { label: 'Late shipments', value: '03 flagged' },
  ], []);

  return (
    <div className="marketing-page" id="top">
      <header className={`marketing-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="DispatchAI home">
          <span className="brand-mark">D</span>
          <span className="brand-copy">
            <strong>DispatchAI</strong>
            <small>Logistics & Transportation Vehicle Dispatch Automation</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="ghost-action login-action" to="/login">
            Login
          </Link>
          <button className="primary-action sticky-action" type="button" onClick={() => setIsDemoOpen(true)}>
            Book a Demo
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className={`drawer-backdrop ${isMenuOpen ? 'is-open' : ''}`} onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
      <aside id="mobile-drawer" className={`mobile-drawer ${isMenuOpen ? 'is-open' : ''}`} aria-label="Mobile menu">
        <div className="drawer-top">
          <span className="drawer-title">Menu</span>
          <button type="button" className="drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu">
            <X aria-hidden="true" />
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link className="ghost-action mobile-login-action" to="/login" onClick={() => setIsMenuOpen(false)}>
          Login
        </Link>
        <button type="button" className="primary-action mobile-demo-action" onClick={() => { setIsMenuOpen(false); setIsDemoOpen(true); }}>
          Book a Demo
        </button>
      </aside>

      <main>
        <section className="hero-section section-shell">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">
              <Zap aria-hidden="true" />
              AI voice and automation for fleet, dispatch, and warehouse teams
            </p>
            <h1>Automate Your Fleet & Dispatch Operations with AI Voice Agents</h1>
            <p className="hero-description">
              Reduce dispatch calls, speed up driver response times, and maintain 24/7 operational coverage with a trustworthy SaaS platform built for modern logistics teams.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => setIsDemoOpen(true)}>
                Book a Demo
              </button>
              <button type="button" className="secondary-action" onClick={() => scrollToId('how-it-works')}>
                See How It Works
              </button>
            </div>

            <div className="trust-strip" aria-label="Trusted by logistics companies">
              <span className="trust-label">Trusted by 200+ logistics companies</span>
              <div className="trust-logos">
                {trustLogos.map((logo) => (
                  <span key={logo} className="trust-logo">{logo}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-visual" data-reveal>
            <div className="hero-dashboard-card">
              <div className="hero-dashboard-header">
                <span className="live-dot" />
                Live operations overview
                <span className="hero-dashboard-tag">AI active</span>
              </div>
              <DispatchIllustration />
              <div className="floating-metrics">
                {floatingStats.map((item) => (
                  <article key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section section-shell" id="stats" data-reveal>
          <div className="section-heading compact">
            <p className="eyebrow">Why teams switch</p>
            <h2>Manual dispatch creates delays, blind spots, and lost productivity.</h2>
            <p>
              DispatchAI replaces repetitive coordination with AI-assisted workflows that keep fleet, gate, warehouse, and customer updates in sync.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
          <div className="pain-points">
            {painPoints.map((point) => (
              <article key={point} className="pain-card">
                <Users aria-hidden="true" />
                <p>{point}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section section-shell" id="features" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">Core features</p>
            <h2>Eight production-grade modules for logistics operations</h2>
            <p>Each feature is designed for a real dispatch workflow, from voice-based fleet lookup to traffic-aware route optimization.</p>
          </div>
          <div className="feature-grid">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="feature-card">
                <div className="feature-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <button type="button" className="learn-more" onClick={() => setIsDemoOpen(true)}>
                  Learn more
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section section-shell" id="how-it-works" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>A simple rollout that scales from single site to enterprise networks</h2>
            <p>Connect your systems, activate AI voice flows, and monitor the entire operation from a modern command center.</p>
          </div>
          <div className="timeline">
            {steps.map((step, index) => (
              <article key={step.number} className="timeline-step">
                <div className="timeline-badge">
                  <span>{step.number}</span>
                </div>
                <div className="timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                {index < steps.length - 1 ? <div className="timeline-line" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section section-shell" id="demo" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">Interactive demo</p>
            <h2>Preview the dispatch dashboard your team will use every day</h2>
            <p>Mocked dashboard modules show live vehicle status, voice logs, AI alerts, and warehouse activity in a clean enterprise layout.</p>
          </div>
          <div className="dashboard-preview">
            <div className="preview-sidebar">
              <div>
                <span className="preview-kicker">Fleet summary</span>
                <h3>Operations at a glance</h3>
              </div>
              <div className="preview-list">
                {[
                  ['T-07', 'On route', 'north'],
                  ['T-12', 'Queued for load', 'pending'],
                  ['T-19', 'Gate check-in', 'warning'],
                  ['T-21', 'Delivered', 'success'],
                ].map(([vehicle, status, tone]) => (
                  <article key={vehicle} className={`preview-row ${tone}`}>
                    <strong>{vehicle}</strong>
                    <span>{status}</span>
                  </article>
                ))}
              </div>
            </div>
            <div className="preview-main">
              <div className="preview-metrics-row">
                {dashboardHighlights.map((item) => (
                  <article key={item.label} className={`preview-metric ${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
              <div className="preview-chart-card">
                <div className="chart-header">
                  <strong>Voice call logs</strong>
                  <span>Live updates</span>
                </div>
                <div className="chart-bars" aria-hidden="true">
                  {[72, 42, 88, 55, 64, 48, 79, 91].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="preview-activity">
                {dashboardActivity.map((item) => (
                  <article key={item.time}>
                    <time>{item.time}</time>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section section-shell" id="testimonials" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>Trusted by teams that need reliable execution and measurable speed</h2>
            <p>The desktop layout uses a three-column grid, while smaller screens become a snap-scrolling carousel for easy browsing.</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <div className="testimonial-avatar" aria-hidden="true">
                  {item.initials}
                </div>
                <p className="testimonial-quote">“{item.quote}”</p>
                <div className="testimonial-meta">
                  <strong>{item.name}</strong>
                  <span>{item.title}</span>
                  <small>{item.company}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section section-shell" id="pricing" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">Pricing</p>
            <h2>Simple tiers for teams of every size</h2>
            <p>All plans are customized to your fleet size, integrations, and support requirements.</p>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <article key={tier.name} className={`pricing-card ${tier.accent ? 'accent' : ''}`}>
                <p className="tier-name">{tier.name}</p>
                <strong className="tier-price">{tier.price}</strong>
                <p className="tier-copy">{tier.blurb}</p>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button type="button" className={tier.accent ? 'primary-action' : 'secondary-action'} onClick={() => setIsDemoOpen(true)}>
                  Contact Sales
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section section-shell" id="faq" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Common questions from logistics teams</h2>
            <p>Everything from implementation to security and pricing is covered in this quick reference.</p>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => {
              const open = activeFaq === index;
              return (
                <article key={item.question} className={`faq-item ${open ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={open}
                    onClick={() => setActiveFaq(open ? -1 : index)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown aria-hidden="true" className="faq-icon" />
                  </button>
                  <div className="faq-answer" hidden={!open}>
                    <p>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="final-cta section-shell" id="contact" data-reveal>
          <div>
            <p className="eyebrow">Ready to automate your dispatch operations?</p>
            <h2>See how DispatchAI can simplify fleet, warehouse, and gate coordination.</h2>
          </div>
          <button type="button" className="primary-action" onClick={() => setIsDemoOpen(true)}>
            Book a Demo
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid section-shell">
          <div>
            <a className="brand footer-brand" href="#top">
              <span className="brand-mark">D</span>
              <span className="brand-copy">
                <strong>DispatchAI</strong>
                <small>Enterprise logistics automation</small>
              </span>
            </a>
            <p className="footer-copy">
              AI voice and automation for fleet dispatch, warehouse tasks, shipment visibility, and intelligent routing.
            </p>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="#how-it-works">How it Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <h3>Newsletter</h3>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Work email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterMessage ? <p className="form-note" aria-live="polite">{newsletterMessage}</p> : null}
          </div>
        </div>
        <div className="footer-bottom section-shell">
          <p>© 2026 DispatchAI. All rights reserved.</p>
          <div className="footer-socials" aria-label="Social media links">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="X">x</a>
            <a href="#" aria-label="YouTube">yt</a>
          </div>
        </div>
      </footer>

      {isDemoOpen ? (
        <div className="modal-overlay" role="presentation" onClick={() => setIsDemoOpen(false)}>
          <div
            className="demo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setIsDemoOpen(false)} aria-label="Close demo form">
              <X aria-hidden="true" />
            </button>
            <div className="modal-header">
              <p className="eyebrow">Book a demo</p>
              <h2 id="demo-title">Request a DispatchAI walkthrough</h2>
              <p>Tell us a bit about your fleet and we will prepare a tailored demo for your team.</p>
            </div>

            <form className="demo-form" onSubmit={handleDemoSubmit} noValidate>
              <div className="form-grid">
                <label>
                  Full name
                  <input ref={nameFieldRef} type="text" value={demoForm.name} onChange={(e) => setDemoForm((prev) => ({ ...prev, name: e.target.value }))} />
                  {demoErrors.name ? <span className="field-error">{demoErrors.name}</span> : null}
                </label>
                <label>
                  Work email
                  <input type="email" value={demoForm.email} onChange={(e) => setDemoForm((prev) => ({ ...prev, email: e.target.value }))} />
                  {demoErrors.email ? <span className="field-error">{demoErrors.email}</span> : null}
                </label>
                <label>
                  Company
                  <input type="text" value={demoForm.company} onChange={(e) => setDemoForm((prev) => ({ ...prev, company: e.target.value }))} />
                  {demoErrors.company ? <span className="field-error">{demoErrors.company}</span> : null}
                </label>
                <label>
                  Phone
                  <input type="tel" value={demoForm.phone} onChange={(e) => setDemoForm((prev) => ({ ...prev, phone: e.target.value }))} />
                  {demoErrors.phone ? <span className="field-error">{demoErrors.phone}</span> : null}
                </label>
              </div>
              <label>
                What do you want to automate?
                <textarea
                  rows="4"
                  value={demoForm.message}
                  onChange={(e) => setDemoForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Fleet visibility, driver messaging, warehouse workflows, route optimization..."
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-action">Submit request</button>
                <button type="button" className="secondary-action" onClick={() => setIsDemoOpen(false)}>Cancel</button>
              </div>
              {demoErrors.submit ? <p className="field-error" aria-live="polite">{demoErrors.submit}</p> : null}
              {demoMessage ? <p className="form-success" aria-live="polite">{demoMessage}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DispatchIllustration() {
  return (
    <div className="dispatch-illustration" aria-hidden="true">
      <div className="illustration-top-row">
        <div className="illustration-card large">
          <div className="illustration-card-header">
            <span>Fleet map</span>
            <strong>12 live vehicles</strong>
          </div>
          <div className="map-shell">
            <div className="map-route route-one" />
            <div className="map-route route-two" />
            <div className="map-pin pin-a">T-07</div>
            <div className="map-pin pin-b">SH-102</div>
            <div className="map-pin pin-c">Gate 2</div>
          </div>
        </div>
        <div className="illustration-stack">
          <div className="illustration-card compact">
            <span>Voice command</span>
            <strong>“Where is vehicle T-07?”</strong>
          </div>
          <div className="illustration-card compact">
            <span>Response</span>
            <strong>In transit, ETA 18 min</strong>
          </div>
          <div className="illustration-card compact">
            <span>Traffic alert</span>
            <strong>Route rerouted automatically</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
