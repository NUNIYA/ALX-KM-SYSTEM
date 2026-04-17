import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../utils/api';
import { Star, MessageCircle, Send, User, ChevronRight, Zap, Award, Activity, Signal, LayoutDashboard, Terminal, ActivitySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    course: 'Software Engineering',
    rating: 5,
    comment: ''
  });

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/feedback`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/feedback`, formData);
      setFormData({ name: '', course: 'Software Engineering', rating: 5, comment: '' });
      fetchFeedback();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 pb-40`}>
      {/* v13 Hybrid Header */}
      <section className="bg-[#050505] py-40 px-12 text-white relative overflow-hidden">
        <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000')] bg-cover bg-center grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="max-w-[1700px] mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
             <div className="inline-flex items-center px-5 py-2 mb-12 text-[10px] font-bold tracking-[0.4em] text-primary uppercase bg-primary/10 border border-primary/30 rounded-full backdrop-blur-xl">
                System Pulse Integrity // Quality Directorate
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-12 leading-[0.85]">
               QUALITY <br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">SIGNALS.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl mx-auto leading-relaxed opacity-80">
              Synthesizing institutional sentiment for continuous system evolution. Real-time feedback loops for the ALX network.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1700px] mx-auto px-12 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* v13 Capture Matrix (Hybrid Prism) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12"
          >
            <div className={`rounded-[4.5rem] p-24 border shadow-6xl relative overflow-hidden transition-all ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                  <Signal className={`w-96 h-96 ${isDark ? 'text-white' : 'text-primary'}`} />
               </div>
               
               <div className="relative mb-20 flex justify-between items-start">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block">Transmission Entry // Feedback</span>
                    <h2 className={`text-6xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>POST SIGNAL.</h2>
                  </div>
                  <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/5 text-primary' : 'bg-slate-50 border-slate-100 text-primary animate-pulse'}`}>
                     <ActivitySquare className="w-10 h-10" />
                  </div>
               </div>

              <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-8 block">Identity Signature</label>
                    <input type="text" className={`w-full px-12 py-9 rounded-[3rem] outline-none font-bold uppercase tracking-tighter text-4xl leading-none border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-primary' : 'bg-slate-50 border-slate-100 text-black focus:border-primary'}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="InnovatorHandle" required />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-8 block">Target Module Node</label>
                    <select className={`w-full px-12 py-9 rounded-[3rem] outline-none font-bold uppercase tracking-widest text-[11px] border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-primary' : 'bg-slate-50 border-slate-100 text-black focus:border-primary'}`} value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} >
                       {['Software Engineering', 'Data Analytics', 'AI', 'Soft Skills'].map(c => <option key={c} className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-8 block">Signal Intensity (Rating)</label>
                  <div className={`flex items-center space-x-12 p-12 rounded-[4rem] border justify-center transition-all ${isDark ? 'bg-white/2 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className={`transition-all duration-300 group ${formData.rating >= star ? 'scale-125' : 'opacity-20 grayscale scale-90'}`} >
                        <Star className={`w-16 h-16 ${formData.rating >= star ? 'text-primary fill-primary' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-8 block">Signal Abstract</label>
                  <textarea rows="6" className={`w-full px-12 py-10 rounded-[4rem] outline-none font-bold text-2xl transition-all border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-primary' : 'bg-slate-50 border-slate-100 text-black focus:border-primary'}`} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} placeholder="Describe technical experience..." required />
                </div>

                <button type="submit" className="w-full py-10 bg-primary text-white rounded-[3rem] font-bold uppercase tracking-[0.6em] text-[11px] shadow-6xl shadow-primary/40 hover:scale-[1.02] transition-all flex items-center justify-center group">
                   AUTHENTICATE & TRANSMIT <Send className="w-6 h-6 ml-6 group-hover:translate-x-6 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* v13 Broadcast Grid (Module Feed) */}
          <div className="lg:col-span-12 flex flex-col pt-32">
            <div className={`sticky top-24 z-10 backdrop-blur-3xl py-12 mb-20 flex items-center justify-between border-b transition-all ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
              <div className="space-y-2">
                 <span className="text-[9px] font-bold text-primary uppercase tracking-[0.5em] block">Data Stream</span>
                 <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>BROADCAST GRID.</h2>
              </div>
              <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-[0.5em] bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
                <Activity className="w-5 h-5 mr-3 animate-pulse" />
                Live System Pulse
              </div>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[1,2,3,4,5,6].map(i => <div key={i} className={`h-[450px] rounded-[5rem] animate-pulse border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}></div>)}
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {feedbacks.map((item, i) => (
                  <motion.div key={item._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group">
                    <div className={`p-16 rounded-[4.5rem] border transition-all duration-1000 relative overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-6xl hover:-translate-y-3 ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/20' : 'bg-white border-slate-100 hover:border-primary/20'}`}>
                       <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-[6rem] transition-all opacity-20 pointer-events-none ${isDark ? 'bg-white/10' : 'bg-primary/5'}`}></div>
                       
                       <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 border shadow-2xl transition-all ${isDark ? 'bg-white/5 border-white/10 text-primary' : 'bg-black border-black text-white group-hover:bg-primary'}`}>
                          <User className="w-10 h-10" />
                       </div>
                       
                       <div className="space-y-3 mb-10">
                          <h4 className={`text-3xl font-black uppercase tracking-tighter leading-none transition-colors ${isDark ? 'text-white group-hover:text-primary' : 'text-black group-hover:text-primary'}`}>{item.name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{item.course} Node</span>
                       </div>

                       <div className={`flex items-center space-x-2 mb-12 py-3 px-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                         {[...Array(5)].map((_, sIdx) => <Star key={sIdx} className={`w-4 h-4 ${sIdx < item.rating ? 'text-primary fill-primary' : 'text-slate-700 opacity-20'}`} />)}
                       </div>

                       <p className={`text-xl font-bold leading-tight uppercase tracking-tighter transition-opacity ${isDark ? 'text-slate-500 opacity-60 group-hover:opacity-100' : 'text-slate-600 opacity-80'}`}>
                          "{item.comment}"
                       </p>
                    </div>
                  </motion.div>
                ))}
                {feedbacks.length === 0 && (
                  <div className={`col-span-full py-60 text-center rounded-[5rem] border border-dashed flex flex-col items-center justify-center ${isDark ? 'bg-white/2 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                     <Award className="w-24 h-24 text-slate-100 mb-12 opacity-10" />
                     <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-sm">Directorate Audit Pending...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
