import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, TrendingUp, Lightbulb, Brain, Rocket, X, Tag, User, Clock, ShieldCheck, Terminal, Info 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  if (status === 'approved') return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  if (status === 'implemented') return 'text-sky-500 border-sky-500 bg-sky-500/10';
  return 'text-slate-400 border-slate-500 bg-slate-500/10';
};

const getConceptImage = (category) => {
  if (category?.includes('AI')) return "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800";
  if (category?.includes('Data')) return "https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=800";
  if (category?.includes('Software')) return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800";
  return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800";
};

/* ═══════════════════════════════════════════════════════
   IDEA DETAIL PANEL (SLIDE-IN)
════════════════════════════════════════════════════════ */
const IdeaPanel = ({ idea, onClose, isDark, likeIdea, updateIdeaStatus, user }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]" />
    
    <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 240 }}
      className={`fixed top-0 right-0 h-full w-full max-w-2xl z-[600] flex flex-col shadow-2xl border-l
        ${isDark ? 'bg-[#050505] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* Hero Cover */}
      <div className="relative h-[35vh] shrink-0 bg-black overflow-hidden">
        <img src={idea.imageUrl ? `'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/${idea.imageUrl}` : getConceptImage(idea.category)} alt={idea.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#050505]' : 'from-white/90'}`} />
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-white hover:text-black text-white transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-8 right-8 text-white z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-2 glow-sky-400/50">
             {idea.category} · Project Registry
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-4">
             {idea.title}
          </h2>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(idea.status)}`}>
             <ShieldCheck className="w-3.5 h-3.5" /> Status: {idea.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10">
         
         {/* Admin Controls */}
         {user?.role === 'admin' && (
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
               <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Admin Controls</span>
               <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateIdeaStatus(idea._id, 'approved')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Approve</button>
                  <button onClick={() => updateIdeaStatus(idea._id, 'implemented')} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Build</button>
                  <button onClick={() => updateIdeaStatus(idea._id, 'rejected')} className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Reject</button>
               </div>
            </div>
         )}

         {idea.adminNote && (
            <div className={`p-6 rounded-[2rem] border-2 border-dashed ${isDark ? 'bg-primary/10 border-primary/30' : 'bg-blue-50 border-primary/30'}`}>
               <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ${isDark ? 'text-primary' : 'text-primary'}`}>
                  <Terminal className="w-4 h-4" /> Operational Feedback
               </h4>
               <p className={`text-sm leading-relaxed font-bold italic ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  "{idea.adminNote}"
               </p>
            </div>
         )}

         <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
               <Info className="w-4 h-4" /> Operational Abstract
            </h4>
            <p className={`text-base leading-loose font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
               {idea.description}
            </p>
         </div>

         <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${isDark ? 'bg-[#0f1115] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
               <User className="w-6 h-6" />
            </div>
            <div>
               <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Lead Architect</p>
               <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{idea.author}</p>
            </div>
            <div className="ml-auto text-right">
               <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pitch Date</p>
               <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{new Date(idea.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
         </div>

         <motion.button whileTap={{ scale: 0.95 }} onClick={() => likeIdea(idea._id)}
            className={`w-full py-5 flex items-center justify-center gap-3 rounded-2xl transition-all border shadow-xl
               ${idea.likes > 0 ? 'bg-sky-600 text-white border-sky-500 shadow-sky-600/30 font-black' : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 font-bold'}`}>
            <TrendingUp className="w-6 h-6" />
            <span className="text-base uppercase tracking-widest">Endorse Project ({idea.likes})</span>
         </motion.button>
      </div>
    </motion.aside>
  </>
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
const Innovation = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPitchForm, setShowPitchForm] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const { user, refreshUser } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Software Engineering', tags: '', image: null
  });

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/ideas');
      setIdeas(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(fetchIdeas, 350); return () => clearTimeout(t); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/ideas', submitData);
      setFormData({ title: '', description: '', category: 'Software Engineering', tags: '', image: null });
      setShowPitchForm(false);
      fetchIdeas();
      if (refreshUser) await refreshUser();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const likeIdea = async (id) => {
    try {
      await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/ideas/${id}/like`);
      setIdeas(prev => prev.map(i => i._id === id ? { ...i, likes: i.likes + 1 } : i));
      if (selectedIdea?._id === id) setSelectedIdea({ ...selectedIdea, likes: selectedIdea.likes + 1 });
    } catch (err) { console.error(err); }
  };

  const updateIdeaStatus = async (id, newStatus) => {
    try {
      await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/ideas/${id}/status`, { status: newStatus }, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIdeas(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
      if (selectedIdea?._id === id) setSelectedIdea({ ...selectedIdea, status: newStatus });
    } catch (err) { console.error(err); }
  };

  const filteredIdeas = ideas.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 relative ${isDark ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>
      
      {/* Global Background Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${isDark ? 'opacity-30 mix-blend-screen' : 'opacity-10'}`} style={{
         backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}></div>

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 border-b border-black/5 dark:border-white/5 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1">
             <h1 className={`text-5xl md:text-6xl font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Engineer <span className="text-sky-500">The Future.</span>
             </h1>
             <p className={`text-lg max-w-2xl leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Pitch technical solutions, coordinate high-impact R&D, and collaborate on future-critical tools for ALX.
             </p>
          </motion.div>

          <button onClick={() => { if (!user) window.location.href = '/login'; else setShowPitchForm(true); }}
             className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-sm font-black uppercase tracking-wider transition-all shadow-xl shadow-sky-600/20 active:scale-95">
             <Plus className="w-5 h-5" /> Pitch New Idea
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 group">
          <div className="relative max-w-3xl border-2 border-transparent focus-within:border-sky-500/50 rounded-2xl transition-all">
             <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-sky-400' : 'text-slate-400 group-focus-within:text-sky-600'}`} />
             <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pitched projects and proposals..."
               className={`w-full pl-14 pr-12 py-3.5 rounded-2xl text-base font-bold outline-none transition-all shadow-sm border
                 ${isDark ? 'bg-[#0f1115] border-white/10 text-white placeholder-slate-600' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
             {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4"/></button>}
          </div>
        </div>
      </section>

      {/* Ideas Card Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <div key={i} className={`aspect-[4/5] rounded-[2.5rem] animate-pulse border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`} />)}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className={`py-48 text-center rounded-[3rem] border border-dashed flex flex-col items-center justify-center ${isDark ? 'bg-white/2 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
             <Lightbulb className={`w-12 h-12 mb-4 opacity-50 ${isDark ? 'text-sky-500' : 'text-sky-600'}`} />
             <p className={`font-black uppercase tracking-widest text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No concepts found.</p>
             <p className={`text-xs font-medium mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try a different search parameter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredIdeas.map((idea, i) => (
              <motion.div key={idea._id} onClick={() => setSelectedIdea(idea)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative cursor-pointer">
                
                {/* Photo Card Shell */}
                <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow border transition-all duration-700 group-hover:shadow-sky-500/20 group-hover:-translate-y-2
                  ${isDark ? 'border-white/10 group-hover:border-sky-500/50' : 'bg-white border-slate-200 group-hover:border-sky-400'}`}>

                  {/* Photo Thumbnail */}
                  <img src={idea.imageUrl ? `'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/${idea.imageUrl}` : getConceptImage(idea.category)} className="absolute inset-0 w-full h-full object-cover object-top opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                  <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#050505]' : 'from-slate-900/90'}`} />
                  
                  {/* Category Pill Top Left */}
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-sm">
                      {idea.category.split(' ')[0]}
                    </span>
                  </div>

                  {/* Like Button Top Right */}
                  <div className="absolute top-5 right-5">
                     <button onClick={(e) => { e.stopPropagation(); likeIdea(idea._id); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all
                           ${idea.likes > 0 ? 'bg-sky-500/90 text-white border-sky-400/50 shadow-lg' : 'bg-black/40 text-white border-white/10 hover:bg-white/20'}`}>
                        <TrendingUp className="w-3.5 h-3.5" /> <span className="text-[10px] font-black">{idea.likes}</span>
                     </button>
                  </div>

                  {/* Content Bottom Left */}
                  <div className="absolute inset-x-0 bottom-0 p-6 z-10 text-white">
                     <span className={`inline-block mb-3 px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${getStatusColor(idea.status)}`}>
                        {idea.status || 'Active'}
                     </span>
                     <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mb-2 group-hover:text-sky-400 transition-colors">
                        {idea.title}
                     </h3>
                     <p className="text-xs font-semibold text-white/50 line-clamp-2 leading-relaxed">
                        {idea.description}
                     </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ DETAIL PANEL ════════════════════════════ */}
      <AnimatePresence>
        {selectedIdea && (
          <IdeaPanel idea={selectedIdea} onClose={() => setSelectedIdea(null)} isDark={isDark} likeIdea={likeIdea} updateIdeaStatus={updateIdeaStatus} user={user} />
        )}
      </AnimatePresence>

      {/* ═══ PITCH MODAL ════════════════════════════ */}
      <AnimatePresence>
        {showPitchForm && (
          <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPitchForm(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]" />
             <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
               className={`fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] rounded-[2rem] z-[600] p-8 shadow-2xl overflow-y-auto border ${isDark ? 'bg-[#0f1115] border-white/10' : 'bg-white border-slate-200'}`}>
               
               {/* Form Header */}
               <div className="flex items-start justify-between mb-8">
                 <div>
                   <span className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
                     Project Proposal
                   </span>
                   <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Pitch a New Idea</h2>
                 </div>
                 <button onClick={() => setShowPitchForm(false)} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                   <X className="w-6 h-6" />
                 </button>
               </div>
 
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Project Name</label>
                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Distributed Sync Tool"
                        className={`w-full px-5 py-4 rounded-xl border text-sm font-black outline-none focus:border-sky-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                 </div>
                 <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Target Area</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-5 py-4 rounded-xl border text-sm font-black outline-none focus:border-sky-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                        {['Software Engineering', 'Data Analytics', 'AI', 'Career Development', 'Soft Skills'].map(c => <option key={c} className="bg-slate-900 text-white">{c}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cover Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                        className={`w-full px-5 py-4 rounded-xl border text-sm font-black outline-none focus:border-sky-500 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                 </div>
                 <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Abstract & Scope</label>
                    <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your solution architecture..."
                        className={`w-full p-5 rounded-xl border text-sm font-medium resize-none outline-none focus:border-sky-500 transition-all leading-relaxed ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                 </div>
                 
                 <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
                   <button type="button" onClick={() => setShowPitchForm(false)} className={`px-6 py-4 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Cancel</button>
                   <button type="submit" disabled={submitting} className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-md">
                     {submitting ? 'Submitting...' : 'Establish Pitch'}
                   </button>
                 </div>
               </form>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Innovation;
