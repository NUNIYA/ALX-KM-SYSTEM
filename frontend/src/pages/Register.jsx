import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Zap, ArrowRight, AlertCircle, ShieldCheck, Sparkles, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', skills: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }     = useAuth();
  const navigate      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none text-sm transition-all';
  const lbl   = 'block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">

        {/* Left Panel */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-16 bg-black text-white overflow-hidden">
          <motion.img initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.3 }} transition={{ duration: 3 }}
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1.5 mb-8 text-[10px] font-bold tracking-[0.3em] text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
              ALX Knowledge Portal
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-6">
              Join the <br /><span className="text-primary">Community.</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs opacity-80">
              Access curated resources, connect with mentors, and grow your skills within the ALX Ethiopia ecosystem.
            </p>
          </div>

          <div className="relative z-10 space-y-6 pt-10 border-t border-white/5">
            {[
              { label: 'Asset Access',  val: 'Repository',     icon: ShieldCheck },
              { label: 'Sync',          val: 'Real-time',      icon: Zap },
              { label: 'Network',       val: 'Peer Intelligence', icon: Disc }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <item.icon className="w-4 h-4 text-primary group-hover:text-white" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</span>
                  <span className="block text-xs font-semibold text-white">{item.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="lg:col-span-7 p-10 lg:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Sparkles className="w-64 h-64 text-primary animate-pulse" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="mb-8">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Institutional Registry</span>
              <h2 className="text-2xl font-bold text-black tracking-tight">Create your account</h2>
              <p className="text-sm text-slate-400 mt-1">Join the ALX Knowledge Management platform.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" className={input} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="email" className={input} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@alx.tech" required />
                  </div>
                </div>
              </div>

              <div>
                <label className={lbl}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="password" className={input} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Create a password" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Role</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary outline-none text-sm"
                    value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="student">Student</option>
                    <option value="facilitator">Facilitator</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Skills (optional)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary outline-none text-sm"
                    value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Python, AWS" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                {loading ? 'Creating account...' : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
