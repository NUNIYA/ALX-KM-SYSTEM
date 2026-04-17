import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Upload, BookOpen, Activity, Users, Settings, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const FacilitatorDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      {/* Facilitator Hero Header */}
      <section className="pt-40 pb-20 px-12 relative overflow-hidden bg-primary/5">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
           <Activity className="w-[800px] h-[800px] -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="max-w-[1700px] mx-auto flex flex-col items-start relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[9px] font-bold uppercase tracking-widest mb-6">
            [{user?.learningTrack || 'General'}] Track // Knowledge Enabler
          </div>
          <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            DIRECTOR COMMAND,<br />
            <span className="text-primary">{user?.name || 'FACILITATOR'}.</span>
          </h1>
          <p className={`text-[11px] font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            System Guidance & Content Mediation.
          </p>
        </div>
      </section>

      <div className="max-w-[1700px] mx-auto px-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Quick Upload Widget */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className={`rounded-[3rem] p-12 border shadow-sm h-full flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-all ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="absolute top-0 right-0 opacity-10 p-10 group-hover:scale-110 transition-transform duration-700">
                <Upload className="w-40 h-40 text-primary" />
             </div>
             <div className="relative z-10">
                <h3 className={`text-3xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Distribute Resource</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest max-w-[250px] mb-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Upload educational materials directly to the global student repository.</p>
                <Link to="/repository" className="inline-flex items-center px-10 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-transform">
                   <Plus className="w-4 h-4 mr-3" /> Initiate Upload
                </Link>
             </div>
          </div>
        </div>

        {/* Share Insight Widget */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className={`rounded-[3rem] p-12 border shadow-sm h-full flex flex-col justify-center relative overflow-hidden group hover:border-amber-500/30 transition-all ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="absolute top-0 right-0 opacity-10 p-10 group-hover:scale-110 transition-transform duration-700">
                <BookOpen className="w-40 h-40 text-amber-500" />
             </div>
             <div className="relative z-10">
                <h3 className={`text-3xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Tactical Insights</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest max-w-[250px] mb-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Share recent lesson plans, student hurdles, or general guidance.</p>
                <Link to="/lessons" className="inline-flex items-center px-10 py-5 bg-amber-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-transform">
                   <Plus className="w-4 h-4 mr-3" /> Share Insight
                </Link>
             </div>
          </div>
        </div>

        {/* Impact Matrix (Stats) */}
        <div className={`col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4`}>
           <div className={`p-10 rounded-[2.5rem] border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Resources Hosted</span>
                 <div className={`text-4xl font-black tracking-tighter mt-2 ${isDark ? 'text-white' : 'text-black'}`}>124</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                 <BookOpen className="w-8 h-8" />
              </div>
           </div>
           
           <div className={`p-10 rounded-[2.5rem] border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Lessons Authored</span>
                 <div className={`text-4xl font-black tracking-tighter mt-2 ${isDark ? 'text-white' : 'text-black'}`}>89</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                 <Activity className="w-8 h-8" />
              </div>
           </div>

           <div className={`p-10 rounded-[2.5rem] border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Student Discussions</span>
                 <div className={`text-4xl font-black tracking-tighter mt-2 ${isDark ? 'text-white' : 'text-black'}`}>342</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                 <Users className="w-8 h-8" />
              </div>
           </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-8">
           <h3 className={`text-xl font-black uppercase tracking-tight mb-8 ${isDark ? 'text-white' : 'text-black'}`}>Management Tools</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <Link to="/collaboration" className={`p-6 rounded-[2rem] border text-center transition-all hover:border-primary ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Manage Forum</span>
             </Link>
             <Link to="/experts" className={`p-6 rounded-[2rem] border text-center transition-all hover:border-primary ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                <Settings className="w-8 h-8 mx-auto mb-4 text-amber-500" />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Update Profile</span>
             </Link>
             {/* Note: In a complete implementation, these would route to specific management views */}
           </div>
        </div>

      </div>
    </div>
  );
};

export default FacilitatorDashboard;
