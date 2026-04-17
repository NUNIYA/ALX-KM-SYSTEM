import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Mail, Briefcase, Zap, Globe, ShieldCheck,
  ChevronRight, X, Activity, MessageCircle, UserCheck,
  Terminal, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

import { useAuth } from '../context/AuthContext';

/* ── Avatars alternate female / male by index ────────── */
const FEMALE_AVATAR = '/expert_female.png';
const MALE_AVATAR   = '/expert_male.png';

/* ── Register Modal ──────────────────────────────────── */
const ExpertDeploymentModal = ({ isOpen, onClose, onSuccess, isDark }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: 'ALXExpert2026!', role: 'student', learningTrack: 'Software Engineering', skills: ''
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/auth/register', formData);
      onSuccess();
      onClose();
    } catch (err) { alert(err.response?.data?.message || 'Deployment failed'); }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[1001] p-10 rounded-[3rem] border shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Deploy Expert</h2>
            <p className={`text-xs font-bold uppercase tracking-widest mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Human Capital Indexing Node</p>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-primary transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-primary transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-primary transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <option value="student">Student/Expert</option>
                    <option value="facilitator">Facilitator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Track</label>
                  <select value={formData.learningTrack} onChange={e => setFormData({...formData, learningTrack: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-primary transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <option>Software Engineering</option>
                    <option>Data Analytics</option>
                    <option>AI Specialist</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Skill Index (Comma separated)</label>
                <input placeholder="Python, AWS, React..." value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-primary transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
              </div>
              <button disabled={loading} className="w-full py-5 bg-primary hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
                {loading ? 'Initializing...' : 'Confirm Deployment'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const getAvatar     = (index) => (index % 2 === 0 ? FEMALE_AVATAR : MALE_AVATAR);
const getGender     = (index) => (index % 2 === 0 ? 'She / Her' : 'He / Him');

/* ── Role badge ──────────────────────────────────────── */
const ROLE_BADGE = {
  admin:       'bg-purple-500/20 text-purple-300 border-purple-500/30',
  facilitator: 'bg-blue-500/20   text-blue-300   border-blue-500/30',
  student:     'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};
const roleBadge = (role) => ROLE_BADGE[role] ?? ROLE_BADGE.student;
const roleLabel = (role) => (role ? role.charAt(0).toUpperCase() + role.slice(1) : '');

/* ═══════════════════════════════════════════════════════
   DETAIL PANEL  (slide-in from right)
════════════════════════════════════════════════════════ */
const ExpertPanel = ({ expert, index, onClose, isDark }) => {
  const [tab, setTab]   = useState('profile');
  const [msg, setMsg]   = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!msg.trim()) return;
    setSent(true);
    setMsg('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]"
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        className={`fixed top-0 right-0 h-full w-full max-w-2xl z-[600] flex flex-col shadow-2xl border-l
          ${isDark ? 'bg-[#050505] border-white/8 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
      >
        {/* Hero image */}
        <div className="relative h-[38vh] shrink-0 overflow-hidden bg-black">
          <img
            src={getAvatar(index)}
            alt={expert.name}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
          />
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent
            ${isDark ? 'from-[#050505]' : 'from-white/90'}`}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-white hover:text-black text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Name block */}
          <div className="absolute bottom-6 left-8 text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">
              {getGender(index)} · Official Personnel File
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-3">
              {expert.name}
            </h2>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-widest ${roleBadge(expert.role)}`}>
              <Briefcase className="w-3.5 h-3.5" /> {roleLabel(expert.role)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b shrink-0 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
          {[
            { id: 'profile', label: 'Profile',  icon: UserCheck },
            { id: 'message', label: 'Message',  icon: MessageCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all
                ${tab === id
                  ? 'border-primary text-primary'
                  : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <>
              {/* Stats */}
              <div className={`grid grid-cols-3 divide-x rounded-2xl overflow-hidden border
                ${isDark ? 'border-white/8 divide-white/8' : 'border-slate-200 divide-slate-200'}`}>
                {[
                  { label: 'Track',  value: (expert.learningTrack || 'General').split(' ')[0] },
                  { label: 'Role',   value: roleLabel(expert.role) },
                  { label: 'Skills', value: expert.skills?.length ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className={`py-5 text-center ${isDark ? 'bg-white/3' : 'bg-slate-50'}`}>
                    <p className="text-2xl font-black mb-1">{value}</p>
                    <p className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                  </div>
                ))}
              </div>

              {/* About */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Terminal className="w-4 h-4 text-primary" /> Specialisation
                </h4>
                <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {expert.name} is a skilled {roleLabel(expert.role)} specialising in{' '}
                  {expert.learningTrack || 'Software Engineering'} across the ALX Ethiopia ecosystem.
                  Passionate about bridging knowledge gaps and empowering the next generation of African tech leaders.
                </p>
              </div>

              {/* Skills */}
              {expert.skills?.length > 0 && (
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Zap className="w-4 h-4 text-primary" /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.skills.map((skill) => (
                      <span key={skill}
                        className={`px-4 py-1.5 rounded-xl border text-sm font-semibold transition-all hover:border-primary hover:text-primary cursor-default
                          ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setTab('message')}
                  className="flex items-center justify-center gap-2 py-4 bg-primary hover:bg-blue-700 text-white rounded-2xl text-sm font-bold uppercase tracking-widest transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Send Message
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl border text-sm font-bold uppercase tracking-widest transition-all
                    ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                >
                  <UserCheck className="w-4 h-4" /> Connect
                </button>
              </div>
            </>
          )}

          {/* ── MESSAGE TAB ── */}
          {tab === 'message' && (
            <div className="space-y-5">
              <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
                <img src={getAvatar(index)} alt={expert.name} className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-primary/30" />
                <div>
                  <p className="font-bold">{expert.name}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Usually replies within 24 hours
                  </p>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your Message
                </label>
                <textarea
                  rows={7}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={`Write to ${expert.name}…`}
                  className={`w-full rounded-2xl border p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-primary transition-all
                    ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
              </div>

              <button
                onClick={send}
                disabled={!msg.trim()}
                className="w-full py-4 bg-primary hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-4 h-4" />
                {sent ? '✓ Message Sent!' : 'Send Message'}
              </button>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700 font-semibold text-center"
                  >
                    Your message has been sent to {expert.name}!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   EXPERT CARD  – tall photo card, original aesthetic
════════════════════════════════════════════════════════ */
const ExpertCard = ({ expert, index, onClick, isDark, onDelete, isAdmin }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    className="group relative cursor-pointer"
  >
    {/* Card shell */}
    <div className={`aspect-[3/4] rounded-[2.5rem] overflow-hidden relative shadow border transition-all duration-700
      group-hover:shadow-2xl group-hover:-translate-y-3
      ${isDark ? 'border-white/8 group-hover:border-primary/30' : 'border-slate-100 group-hover:border-primary/30'}`}>

      {/* Photo */}
      <img
        src={getAvatar(index)}
        alt={expert.name}
        className="absolute inset-0 w-full h-full object-cover object-top grayscale opacity-80
          group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t via-transparent to-transparent
        ${isDark ? 'from-black/90' : 'from-black/75'}`}
      />

      {/* Gender tag top-left */}
      <div className="absolute top-5 left-5 flex gap-2">
        <span className="px-3 py-1 bg-white/15 backdrop-blur rounded-full text-white text-xs font-semibold border border-white/20">
          {getGender(index)}
        </span>
        {isAdmin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(expert._id); }}
            className="p-1 px-2 bg-red-600/20 hover:bg-red-600 text-red-100 rounded-full border border-red-500/30 transition-all backdrop-blur-md"
          >
             <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hover icon top-right */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-all">
          <Terminal className="w-5 h-5" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className={`inline-block mb-2 px-3 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-widest ${roleBadge(expert.role)}`}>
          {roleLabel(expert.role)}
        </span>
        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">
          {expert.name}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
          {expert.learningTrack || 'General Track'}
        </p>

        {/* Skill pills */}
        {expert.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {expert.skills.slice(0, 3).map((s) => (
              <span key={s} className="px-2.5 py-0.5 bg-white/15 backdrop-blur border border-white/20 rounded-full text-[11px] font-semibold text-white">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
const Experts = () => {
  const [experts, setExperts]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedIndex, setSelectedIndex]   = useState(0);
  const [isDeploying, setIsDeploying]       = useState(false);
  
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/auth/experts?skill=${search}`);
      setExperts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchExperts, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDeleteExpert = async (id) => {
    if (!window.confirm('De-index this personnel file permanently?')) return;
    try {
      await axios.delete(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/auth/users/${id}`);
      fetchExperts();
    } catch (err) { alert(err.response?.data?.message || 'De-indexing failed'); }
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#f9fafb]'}`}>

      {/* ── Hero Header ── */}
      <section className="bg-[#050505] pt-32 pb-44 px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2500')] bg-cover bg-center grayscale opacity-10" />
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-end justify-between gap-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center px-5 py-2 mb-10 text-[10px] font-bold tracking-[0.4em] text-primary uppercase bg-primary/10 border border-primary/30 rounded-full backdrop-blur-xl">
              Institutional Directorate // Expert Network
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
              THE <br />
              <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">
                DIRECTORATE.
              </span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl leading-relaxed opacity-80">
              Strategic expert identification and institutional knowledge deployment. Connecting the network at organizational scale.
            </p>
          </motion.div>

          {isAdmin && (
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000' }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDeploying(true)}
              className="px-12 py-7 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-4xl shadow-primary/20 transition-all flex items-center gap-4"
            >
              <UserCheck className="w-5 h-5" /> Deploy Personnel
            </motion.button>
          )}
        </div>
      </section>

      {/* ── Filtering Tier ── */}
      <section className="relative -mt-10 z-30 px-8">
        <div className="max-w-[1700px] mx-auto">
          <div className={`p-2 rounded-[2.5rem] border shadow-4xl backdrop-blur-3xl flex flex-col md:flex-row items-center gap-2 ${isDark ? 'bg-[#0A0A0B]/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className="relative flex-grow w-full">
              <Search className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input 
                type="text" 
                placeholder="Search Identity, Skill, or Track..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full py-6 pl-20 pr-10 bg-transparent text-sm font-bold uppercase tracking-widest outline-none ${isDark ? 'text-white' : 'text-black'}`}
              />
            </div>
            <div className="flex gap-2 p-2">
              <div className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                Verified Nodes: {experts.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExpertDeploymentModal isOpen={isDeploying} onClose={() => setIsDeploying(false)} onSuccess={fetchExperts} isDark={isDark} />

      {/* ── Directory Grid ── */}
      <main className="max-w-[1700px] mx-auto px-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {loading ? (
             [...Array(8)].map((_, i) => (
                <div key={i} className={`h-[480px] rounded-[3rem] animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
             ))
          ) : experts.length > 0 ? (
            experts.map((exp, i) => (
              <ExpertCard 
                key={exp._id} 
                expert={exp} 
                index={i} 
                onClick={() => { setSelectedExpert(exp); setSelectedIndex(i); }} 
                isAdmin={isAdmin}
                onDelete={handleDeleteExpert}
                isDark={isDark}
              />
            ))
          ) : (
            <div className="col-span-full py-40 text-center">
               <Activity className={`w-16 h-16 mx-auto mb-8 opacity-20 ${isDark ? 'text-white' : 'text-black'}`} />
               <p className={`text-2xl font-black uppercase tracking-tighter opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>No indexed personnel found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Details Side-Panel */}
      <AnimatePresence>
        {selectedExpert && (
          <ExpertPanel
            expert={selectedExpert}
            index={selectedIndex}
            onClose={() => setSelectedExpert(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experts;
