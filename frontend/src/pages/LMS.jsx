import React from 'react';
import { BookOpen, CheckCircle2, Play, Users, Clock, ArrowRight, Zap, Target, Activity, LayoutGrid, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CourseCard = ({ title, description, modules, progress, imageUrl, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
  >
    <div className={`group rounded-[3.5rem] border overflow-hidden transition-all duration-700 shadow-sm hover:shadow-4xl hover:-translate-y-2 ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/20' : 'bg-white border-slate-100 hover:border-primary/20'}`}>
      <div className="h-72 relative overflow-hidden">
        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#0A0A0B]' : 'from-black/40'}`} />
        <div className="absolute bottom-10 left-10 flex items-center space-x-5">
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-4xl shadow-primary/40 border border-white/20 ring-4 ring-primary/20">
             <Play className="w-6 h-6 ml-1" />
          </div>
          <div className="flex flex-col">
             <span className="text-white text-[9px] font-bold uppercase tracking-[0.4em] mb-1">Module Count</span>
             <span className="text-white text-[11px] font-bold uppercase tracking-widest">{modules} Active Segments</span>
          </div>
        </div>
      </div>
      
      <div className="p-12">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-4">
             <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Protocol Trace // SE-0{index + 1}</span>
             <h3 className={`text-3xl font-bold uppercase tracking-tighter leading-[0.85] ${isDark ? 'text-white' : 'text-black'}`}>{title}</h3>
          </div>
          <div className="text-right">
             <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-primary' : 'text-primary'}`}>{progress}% SYNCED</span>
          </div>
        </div>
        
        <p className={`text-sm font-bold leading-relaxed mb-12 uppercase tracking-tight opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>"{description}"</p>
        
        <div className={`w-full h-2 rounded-full mb-12 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full bg-primary shadow-glow shadow-primary/40"
          />
        </div>
        
        <button className={`w-full py-7 rounded-[2rem] font-bold uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center group ${isDark ? 'bg-white/5 text-white hover:bg-primary' : 'bg-black text-white hover:bg-primary'}`}>
          Resume Acquisition <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-3 transition-transform" />
        </button>
      </div>
    </div>
  </motion.div>
);

const LMS = () => {
  const { isDark } = useTheme();

  const courses = [
    {
      title: "Software Engineering",
      description: "Full-stack development, system design, and large-scale infrastructure protocols.",
      modules: 12,
      progress: 65,
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
    },
    {
      title: "Data Analytics",
      description: "Statistical modeling, predictive intelligence, and operational data visualization.",
      modules: 10,
      progress: 40,
      imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=800"
    },
    {
      title: "AI Track",
      description: "Neural networks, machine learning orchestration, and ethical AI deployment.",
      modules: 8,
      progress: 15,
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 pb-32`}>
      {/* v12 Hybrid Header */}
      <section className="bg-[#050505] py-40 px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2000')] bg-cover bg-center grayscale opacity-10" />
        <div className="max-w-[1700px] mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
             <div className="inline-flex items-center px-5 py-2 mb-12 text-[10px] font-bold tracking-[0.4em] text-primary uppercase bg-primary/10 border border-primary/30 rounded-full backdrop-blur-xl">
                Academy Protocol // Acquisition Directorate
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-12 leading-[0.85]">
              KNOWLEDGE <br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">ACQUISITION.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl mx-auto leading-relaxed opacity-80">
              Managing structured learning pathways for institutional excellence across the ALX Ethiopia network.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1700px] mx-auto px-12 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {courses.map((course, i) => (
            <CourseCard key={i} {...course} index={i} isDark={isDark} />
          ))}
        </div>

        {/* System Stats Section */}
        <section className={`mt-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-24 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
           {[
             { label: 'Active Learners', val: '4,200', icon: Users, color: 'text-primary' },
             { label: 'Success Rate', val: '92.4%', icon: Target, color: 'text-primary' },
             { label: 'Sync Hours', val: '12,500', icon: Clock, color: 'text-primary' },
             { label: 'Certifications', val: '1,800', icon: CheckCircle2, color: 'text-primary' }
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center text-center group cursor-help">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all shadow-sm border ${isDark ? 'bg-white/5 border-white/5 text-primary' : 'bg-slate-50 border-slate-100 text-primary'}`}>
                   <stat.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className={`text-5xl font-black mb-3 tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{stat.val}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">{stat.label}</div>
             </div>
           ))}
        </section>

        {/* Bottom Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`mt-48 rounded-[4rem] p-24 text-center relative overflow-hidden group shadow-6xl transition-colors ${isDark ? 'bg-black text-white' : 'bg-white text-black border border-slate-100'}`}
        >
           <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 ${isDark ? 'invert' : ''}`} />
           <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.6em] mb-12 block">Support Signal</span>
              <h3 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-12`}>NEED SYSTEM <br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">ACCELERATION?</span></h3>
              <p className={`text-[11px] font-bold uppercase tracking-[0.3em] max-w-lg mb-16 opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Contact your local hub facilitation unit for personalized learning protocol acceleration and mentor matching.</p>
              <button className="px-20 py-8 bg-primary text-white rounded-[3rem] font-bold uppercase tracking-[0.5em] text-[11px] shadow-6xl shadow-primary/40 hover:scale-105 transition-all">
                Request Protocol Sync
              </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LMS;
