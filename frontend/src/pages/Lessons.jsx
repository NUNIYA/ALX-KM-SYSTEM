import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, User, Tag, Search, BookOpen, 
  Heart, AlertCircle, Info, X, Zap, Lightbulb, ArrowUpRight, MessageSquare,
  Star, Send, ActivitySquare, Signal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   FEEDBACK PANEL (INTEGRATED ON-PAGE)
════════════════════════════════════════════════════════ */
const FeedbackPanel = ({ onClose, isDark, user }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    course: 'Software Engineering',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/feedback', formData);
      alert("Signal Transmitted: Feedback successfully integrated into the system pulse.");
      onClose();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[550]" />
      
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 right-0 h-full w-full max-w-xl z-[600] flex flex-col shadow-2xl border-l overflow-hidden
          ${isDark ? 'bg-[#0f1115] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        <div className="absolute inset-0 pointer-events-none z-0 opacity-5" style={{
           backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
           backgroundSize: '24px 24px'
        }} />

        <div className={`shrink-0 flex items-center justify-between p-8 border-b relative z-10 ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-100 bg-slate-50/50'}`}>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2 block">Quality Signal</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Submit Feedback</h2>
          </div>
          <button onClick={onClose} className={`p-4 rounded-2xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-100 shadow-sm'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10 custom-scrollbar">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Identity Handle</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
               className={`w-full px-8 py-6 rounded-[2rem] outline-none font-bold border transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-600'}`} />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Target HubNode</label>
            <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}
               className={`w-full px-8 py-6 rounded-[2rem] outline-none font-bold border transition-all appearance-none ${isDark ? 'bg-white/5 border-white/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-600'}`}>
               {['Software Engineering', 'Data Analytics', 'AI', 'Soft Skills'].map(c => <option key={c} className="bg-slate-900 text-white md:bg-white md:text-black">{c}</option>)}
            </select>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block text-center">Signal Intensity (Rating)</label>
            <div className="flex justify-center gap-6 p-8 rounded-[2.5rem] border bg-black/5 dark:bg-white/5">
              {[1,2,3,4,5].map(star => (
                <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="transition-all hover:scale-110">
                  <Star className={`w-10 h-10 ${formData.rating >= star ? 'text-indigo-500 fill-indigo-500' : 'text-slate-300 opacity-30'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">System Critique (Comment)</label>
            <textarea required rows={5} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} placeholder="Describe your experience with the Lessons Hub..."
               className={`w-full px-8 py-8 rounded-[2.5rem] outline-none font-bold border transition-all resize-none ${isDark ? 'bg-white/5 border-white/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-600'}`} />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
            {submitting ? 'TRANSMITTING...' : 'AUTHENTICATE & TRANSMIT'} <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.aside>
    </>
  );
};

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const { user, refreshUser } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '', challenge: '', description: '', 
    recommendation: '', category: 'Software Engineering', tags: '', 
    author: user ? user.name : 'Anonymous'
  });

  useEffect(() => {
    if (user) setFormData(prev => ({ ...prev, author: user.name }));
  }, [user]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/lessons?search=${search}`);
      setLessons(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(fetchLessons, 350); return () => clearTimeout(t); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/lessons', formData);
      setFormData({ title: '', challenge: '', description: '', recommendation: '', category: 'Software Engineering', tags: '' });
      setShowForm(false);
      fetchLessons();
      if (refreshUser) await refreshUser();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const handleUpvote = async (id) => {
    try {
      await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/lessons/${id}/upvote`);
      setLessons(prev => prev.map(l => l._id === id ? { ...l, upvotes: l.upvotes + 1 } : l));
    } catch (err) { console.error(err); }
  };

  const getCatVisual = (cat) => {
    if (cat === 'Software Engineering') return "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200";
    if (cat === 'AI') return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200";
    if (cat === 'Data Analytics') return "https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=1200";
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200";
  };

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-[1500ms] relative overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      
      {/* Background Lattice Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
         backgroundImage: isDark 
           ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)' 
           : 'repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 40px), repeating-linear-gradient(-45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 40px)',
         opacity: 1
      }} />
      
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className={`relative pt-44 pb-20 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="flex-1">
              <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Lessons <br /><span className="text-indigo-600">Learned.</span>
              </h1>
             <p className={`text-sm md:text-base max-w-2xl font-black uppercase tracking-widest leading-loose ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Synthesis of real-world challenges, technical discoveries, and institutional best practices.
             </p>
          </motion.div>

          <div className="flex flex-col gap-4 shrink-0 auto-cols-min">
            <button onClick={() => { if (!user) window.location.href = '/login'; else setShowForm(true); }}
               className="w-full flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95">
               <Plus className="w-5 h-5" /> Execute Entry
            </button>
            <button onClick={() => setShowFeedback(true)} 
               className={`w-full flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl border-2 transition-all font-black uppercase tracking-[0.3em] text-[9px]
               ${isDark ? 'border-white/10 text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-600 hover:text-indigo-600 shadow-sm bg-white'}`}>
               <MessageSquare className="w-4 h-4" /> System Feedback
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 group">
          <div className="relative max-w-3xl">
             <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${isDark ? 'text-slate-600 group-focus-within:text-indigo-500' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
             <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter intelligence logs..."
               className={`w-full pl-16 pr-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none transition-all shadow-xl border
                 ${isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-700 focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 focus:border-indigo-500'}`} />
          </div>
        </div>
      </section>

      {/* ═══ COMPACT IMAGE CARDS ════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        {loading ? (
          <div className="space-y-10">
            {[...Array(3)].map((_, i) => <div key={i} className={`h-64 rounded-[2.5rem] animate-pulse border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`} />)}
          </div>
        ) : lessons.length > 0 ? (
          <div className="space-y-10 relative z-10">
            {lessons.map((lesson, i) => (
              <motion.div key={lesson._id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`group flex flex-col lg:flex-row rounded-[2.5rem] border overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                  ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-indigo-500/20' : 'bg-white border-slate-100 hover:border-indigo-500/20 shadow-sm'}`}>
                 
                 {/* Visual Left Strip */}
                 <div className="w-full lg:w-72 relative overflow-hidden bg-black flex flex-col p-7 shrink-0">
                    <motion.img whileHover={{ scale: 1.05 }} src={getCatVisual(lesson.category)} 
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="relative z-10 mt-auto">
                       <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-xl uppercase tracking-[0.3em] mb-4 shadow-xl">
                          {lesson.category}
                       </span>
                       <h3 className="text-2xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors">
                         {lesson.title}
                       </h3>
                    </div>

                    <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
                       <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpvote(lesson._id)}
                         className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black transition-all backdrop-blur-md cursor-pointer
                           ${lesson.upvotes > 0 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                          <Heart className={`w-4 h-4 ${lesson.upvotes > 0 ? 'fill-white' : ''}`} /> {lesson.upvotes}
                       </motion.button>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          ID-{lesson._id.slice(-4).toUpperCase()}
                       </span>
                    </div>
                 </div>

                 {/* Content Matrix */}
                 <div className="flex-1 p-7 flex flex-col relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                       
                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-rose-500">
                             <AlertCircle className="w-5 h-5 shadow-sm" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Challenge</span>
                          </div>
                          <p className={`text-xs font-bold leading-relaxed uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                             "{lesson.challenge}"
                          </p>
                       </div>

                       <div className="space-y-4">
                          <div className={`flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                             <Info className="w-5 h-5 shadow-sm" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Discovery</span>
                          </div>
                          <p className={`text-[11px] font-black leading-loose uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                             {lesson.description}
                          </p>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-emerald-500">
                             <Zap className="w-5 h-5 shadow-sm" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recommendation</span>
                          </div>
                          <div className={`p-5 rounded-2xl border transition-all h-full ${isDark ? 'bg-emerald-500/5 text-emerald-100 border-emerald-500/10' : 'bg-emerald-50 text-emerald-900 border-emerald-100 shadow-inner'}`}>
                             <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest">{lesson.recommendation}</p>
                          </div>
                       </div>

                    </div>

                    {/* Author Footer */}
                    <div className={`mt-7 pt-5 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400 shadow-inner'}`}>
                             <User className="w-5 h-5" />
                          </div>
                          <div>
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block leading-none mb-1">Authenticated Contributor</span>
                             <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.author}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`py-40 text-center rounded-[4rem] border-2 border-dashed ${isDark ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-slate-50/50 grayscale'}`}>
             <BookOpen className={`w-20 h-20 mx-auto mb-8 opacity-20 ${isDark ? 'text-indigo-500' : 'text-indigo-600'}`} />
             <p className={`text-5xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Intelligence Void.</p>
             <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-12">Search parameters yielded zero protocol matches.</p>
             <button onClick={() => setSearch('')} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all">
                Reset Scan
             </button>
          </div>
        )}
      </div>

      {/* ═══ SHARE MODAL ════════════════════════════ */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[500]" />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed inset-0 m-auto w-full max-w-5xl h-fit max-h-[90vh] rounded-[3rem] z-[600] p-12 shadow-2xl overflow-y-auto border
                ${isDark ? 'bg-[#0f1115] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>

              <div className="flex items-start justify-between mb-12">
                <div>
                  <span className="inline-block px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    Community Intelligence Entry
                  </span>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Log New discovery</h2>
                </div>
                <button onClick={() => setShowForm(false)} className={`p-5 rounded-3xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <X className="w-8 h-8" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Lesson Protocol Title</label>
                     <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Distributed Cache Failure..."
                         className={`w-full px-8 py-6 rounded-[2rem] border text-[11px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200 shadow-inner'}`} />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Deployment Category</label>
                     <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                         className={`w-full px-8 py-6 rounded-[2rem] border text-[11px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all appearance-none ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                         {['Software Engineering', 'Data Analytics', 'AI', 'Career Development', 'Soft Skills'].map(c => <option key={c} className="bg-slate-900 text-white md:bg-white md:text-black">{c}</option>)}
                     </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase tracking-tighter">
                   {[
                     { label: 'The Protocol Challenge', key: 'challenge', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/10' },
                     { label: 'The Root Discovery', key: 'description', icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
                     { label: 'System Recommendation', key: 'recommendation', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' }
                   ].map(field => (
                     <div key={field.key} className="space-y-4">
                        <label className={`flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.3em] ${field.color}`}>
                           <field.icon className="w-5 h-5 shadow-lg" /> {field.label}
                        </label>
                        <textarea required rows={7} value={formData[field.key]} onChange={e => setFormData({...formData, [field.key]: e.target.value})} placeholder="..."
                           className={`w-full p-8 rounded-[2.5rem] border text-[11px] font-black leading-loose resize-none outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`} />
                     </div>
                   ))}
                </div>

                <div className="flex justify-end gap-6 pt-12 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setShowForm(false)} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isDark ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm'}`}>Cancel</button>
                  <button type="submit" disabled={submitting} className="px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50 transition-all shadow-2xl shadow-indigo-600/30">
                    {submitting ? 'PROCESSING...' : 'TRANSMIT LOG'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ FEEDBACK PANEL ═══════════════════════════ */}
      <AnimatePresence>
        {showFeedback && <FeedbackPanel onClose={() => setShowFeedback(false)} isDark={isDark} user={user} />}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
