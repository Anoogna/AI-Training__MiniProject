import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dispatcher');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(name, email, password, role);
      const target = user.role === 'driver' ? '/driver' : user.role === 'warehouse' ? '/warehouse' : user.role === 'gate' ? '/gate' : '/dashboard';
      navigate(target);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-soft backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200">Create account</p>
            <h1 className="max-w-lg text-3xl font-black text-white sm:text-4xl">Start your logistics automation journey with a premium operations workspace.</h1>
            <p className="max-w-md text-slate-200/85">Set up your team, assign roles, and launch an enterprise-ready dispatch experience for fleet managers, drivers, warehouse staff, and operations planners.</p>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4 text-sm text-slate-100">
              This demo signup page is ready for integration with your auth service, while the existing account flow continues to work with the seeded demo users.
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-6 shadow-soft">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200">Signup</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Create your account</h2>
              <p className="mt-1 text-sm text-slate-300">Use the same demo credentials after signup or sign in directly.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-100">
                Full Name
                <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60" placeholder="Alex Carter" />
              </label>
              <label className="block text-sm text-slate-100">
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60" placeholder="you@company.com" />
              </label>
              <label className="block text-sm text-slate-100">
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60" placeholder="Create a strong password" />
              </label>
              {error && <p className="text-sm text-rose-300">{error}</p>}
              <label className="block text-sm text-slate-100">
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60">
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="gate">Gate Operator</option>
                </select>
              </label>
              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]">Create Account</button>
            </form>
            <p className="mt-4 text-sm text-slate-300">Already have an account? <Link to="/login" className="text-sky-200 hover:text-sky-100">Login here</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
