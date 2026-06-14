import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Boxes,
  Globe2,
  MapPinned,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Warehouse,
  Zap,
} from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Deliveries Managed' },
  { value: '500+', label: 'Active Vehicles' },
  { value: '98%', label: 'Dispatch Accuracy' },
  { value: '24/7', label: 'Monitoring' },
];

const features = [
  ['Fleet Tracking Voice Assistant', 'Voice-enabled dispatch commands for fleet visibility and live status.', Sparkles],
  ['Delivery Coordination Bot', 'Automates pending assignments to the best available vehicle and driver.', Route],
  ['Driver Communication Assistant', 'Real-time messaging, alerts, and broadcast updates for drivers.', MessageSquareText],
  ['Warehouse Voice Operations', 'Fast warehouse confirmations, task updates, and inventory actions.', Warehouse],
  ['Real-Time Shipment Tracking', 'Monitor shipment lifecycle with live status visibility and ETA insights.', MapPinned],
  ['AI Traffic Coordination', 'Adaptive route intelligence and reroute alerts to reduce delays.', Activity],
  ['Smart Gate Entry & Exit', 'Voice and digital gate handling with an audit-friendly workflow.', ShieldCheck],
  ['Route Optimization Notifications', 'Live path optimization and proactive reroute guidance.', Globe2],
];

const workflows = [
  'Register Fleet & Drivers',
  'Automated Dispatch Assignment',
  'Real-Time Monitoring',
  'Delivery Completion & Analytics',
];

const benefits = [
  'Reduced Operational Costs',
  'Faster Deliveries',
  'Improved Fleet Utilization',
  'Better Driver Communication',
  'Real-Time Visibility',
  'AI-Based Decision Making',
];

const industries = [
  'Logistics Companies',
  'E-Commerce Delivery',
  'Warehouse Operations',
  'Supply Chain Management',
  'Transportation Services',
  'Fleet Management Companies',
];

const technologies = ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'AI Automation', 'GPS Tracking'];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_22%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
          <header className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-soft backdrop-blur-xl">
            <nav className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky-200">FleetFlow AI</p>
                <h2 className="text-xl font-semibold text-white">Logistics Dispatch Automation</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full border border-sky-400/40 bg-white/8 px-4 py-2 text-sm font-semibold text-sky-50 transition hover:bg-white/12"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:scale-[1.03]"
                >
                  Create Account
                </button>
              </div>
            </nav>
          </header>

          <section className="mt-8 grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-sky-100">
                <Zap className="h-3.5 w-3.5" />
                AI-powered transportation control center
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  AI-Powered Logistics & Vehicle Dispatch Automation
                </h1>
                <p className="max-w-xl text-lg text-slate-200/90 sm:text-xl">
                  Optimize fleet operations, automate dispatching, track shipments in real time, and streamline transportation workflows with intelligent automation built for modern logistics teams.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-900/30 transition hover:-translate-y-0.5 hover:shadow-sky-900/50"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-white/12"
                >
                  Watch Demo
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, idx) => (
                  <motion.article
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 * idx }}
                    className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-400/40"
                  >
                    <p className="text-2xl font-black text-sky-100">{item.value}</p>
                    <p className="text-sm text-slate-200/80">{item.label}</p>
                  </motion.article>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-soft backdrop-blur-xl"
            >
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95))] p-4">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
                  alt="Logistics team and fleet management"
                  className="h-56 w-full rounded-3xl object-cover"
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Live Fleet', '18 active vehicles in transit'],
                    ['On-time Delivery', '94.8% delivery performance'],
                    ['Route Efficiency', '12% fuel savings'],
                    ['AI Alerts', '5 reroutes today'],
                  ].map(([title, value]) => (
                    <article key={title} className="rounded-2xl border border-white/10 bg-white/6 p-3">
                      <p className="text-xs uppercase tracking-[0.23em] text-sky-100/80">{title}</p>
                      <p className="mt-1 text-sm text-slate-100">{value}</p>
                    </article>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Core capabilities</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Everything your logistics team needs</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-300">From dispatch coordination to route intelligence, the platform combines automation, communication, and fleet visibility in one premium workspace.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, text, Icon], idx) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.04 * idx }}
              className="group rounded-3xl border border-white/10 bg-white/8 p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/12"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 text-sky-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-200/85">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[30px] border border-white/10 bg-white/8 p-6 shadow-soft backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">How it works</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">A smooth workflow for modern dispatch teams</h2>
            <p className="mt-3 text-slate-200/85">From registration to delivery completion, the system keeps every role aligned with clear milestones and AI-assisted coordination.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {workflows.map((step, idx) => (
              <article key={step} className="rounded-3xl border border-white/10 bg-[linear-gradient(140deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] p-4 transition hover:border-sky-400/40 hover:-translate-y-1">
                <div className="mb-3 flex items-center justify-between text-sky-100">
                  <span className="text-xs uppercase tracking-[0.3em]">Step {idx + 1}</span>
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-white">{step}</h3>
                <p className="mt-2 text-sm text-slate-200/80">Operational workflow detail designed to reduce manual effort and keep every shipment on track.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/8 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Dashboard preview</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Real-time fleet & shipment visibility</h2>
            <p className="mt-3 text-slate-200/85">A realistic dashboard preview gives stakeholders confidence in the intelligence, analytics, and decision support behind the platform.</p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-[linear-gradient(140deg,rgba(8,15,30,0.96),rgba(15,23,42,0.96))] p-4">
              <img
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt="Modern logistics dashboard preview"
                className="h-48 w-full rounded-3xl object-cover"
              />
            </div>
          </article>
          <article className="rounded-[30px] border border-white/10 bg-gradient-to-br from-sky-400/10 via-white/8 to-blue-600/10 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Benefits</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-100 transition hover:border-sky-400/40 hover:bg-white/12">{item}</div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/8 p-6 shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Industries served</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((item) => (
              <article key={item} className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(30,41,59,0.92))] p-4 text-slate-100 transition hover:border-sky-400/40 hover:-translate-y-1">{item}</article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            '“The platform gave our dispatch team clear visibility and faster response times across all vehicles.” — Operations Manager',
            '“The AI-driven route guidance and live tracking reduced our delays significantly in the first month.” — Fleet Director',
            '“Professional, intuitive, and reliable — the best dispatch workspace we have used for logistics coordination.” — Warehouse Lead',
          ].map((quote) => (
            <article key={quote} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-soft backdrop-blur-xl text-slate-100">
              <p className="text-sm text-slate-100/90">{quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-6 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Technology stack</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Built on modern, scalable infrastructure</h2>
            </div>
            <div className="flex flex-wrap gap-3">{technologies.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-100">{item}</span>)}</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('/signup')} className="rounded-full bg-gradient-to-r from-sky-400 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.03]">Create Account</button>
            <button onClick={() => navigate('/login')} className="rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12">Contact Sales</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/60 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-base font-semibold text-white">FleetFlow AI</p>
            <p className="mt-2 text-slate-300">Premium logistics dispatch software for modern fleets, warehouses, and transportation companies.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Features</h3>
            <ul className="mt-2 space-y-1 text-slate-300"> <li>Fleet Tracking</li><li>AI Automation</li><li>Route Optimization</li></ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="mt-2 space-y-1 text-slate-300"> <li>Docs</li><li>Case Studies</li><li>Support</li></ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-2 space-y-1 text-slate-300"> <li>hello@fleetflow.ai</li><li>+91 98765 43210</li><li>LinkedIn / X / GitHub</li></ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">© 2026 FleetFlow AI. Built for modern enterprise logistics operations.</div>
      </footer>
    </main>
  );
}
