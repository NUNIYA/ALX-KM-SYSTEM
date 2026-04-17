import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(res.data);
      if (res.data.role === 'admin') navigate('/');
      else if (res.data.role === 'facilitator') navigate('/facilitator-dashboard');
      else if (res.data.role === 'student') navigate('/student-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Identity verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Pattern Background (v8) */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black"></div>
         {/* Animated Blue Pulse Orbital */}
         <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
         >
         </motion.div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 bg-white rounded-[3.5rem] overflow-hidden shadow-6xl">
        
        {/* Left Side: Institutional Visual */}
        <div className="relative hidden lg:flex flex-col justify-between p-20 bg-black text-white overflow-hidden">
           <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 2 }}
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
              className="absolute inset-0 w-full h-full object-cover grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
           
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-10">
                 <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
                    <LogIn className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">ALX DIRECTORATE</span>
              </div>
              <h1 className="text-6xl font-bold uppercase tracking-tight mb-8">
                SECURE <br /><span className="text-primary">GATEWAY.</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-xs leading-relaxed">
                AUTHORIZED PERSONNEL ONLY. SYSTEM ACCESS REQUIRES INSTITUTIONAL CREDENTIALS.
              </p>
           </div>

           <div className="relative z-10 grid grid-cols-2 gap-8 pt-20 border-t border-white/10">
              <div className="flex items-center space-x-4">
                 <ShieldCheck className="w-6 h-6 text-primary" />
                 <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">End-to-End</span>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-tight">Encrypted</span>
                 </div>
              </div>
              <div className="flex items-center space-x-4">
                 <Globe className="w-6 h-6 text-primary" />
                 <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Hub</span>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-tight">Access</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="p-12 lg:p-24 flex flex-col justify-center bg-white relative">
           {/* Abstract Watermark */}
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Sparkles className="w-64 h-64 text-primary" />
           </div>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
           >
              <div className="mb-8">
                 <span className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-3 block">Identity Verification</span>
                 <h2 className="text-2xl font-bold text-black tracking-tight">Sign in to your account</h2>
                 <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the portal.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center text-[10px] font-black uppercase tracking-widest"
                  >
                    <AlertCircle className="w-5 h-5 mr-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@alx.tech"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none transition-all text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing in...' : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-slate-100 pt-5">
                 <p className="text-sm text-slate-400">
                   Don't have an account?{' '}
                   <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
                 </p>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
