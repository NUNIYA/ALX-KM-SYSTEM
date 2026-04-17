import React, { useState, useEffect } from 'react';
import { 
  BookOpen, MessageSquare, Lightbulb, TrendingUp, Users, FileText, Zap, Award, 
  ArrowDown, ChevronRight, Globe, ShieldCheck, Activity, Database, Cpu, 
  Settings, X, Save, User as UserIcon, Briefcase, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// --- SUB-COMPONENT: FeatureCard (For Cinematic Landing) ---
const FeatureCard = ({ icon: Icon, title, description, link, index, imageUrl, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
  >
    <Link to={link} className={`group block relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border transition-all duration-700 shadow-sm hover:shadow-4xl hover:-translate-y-2 ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/30' : 'bg-white border-slate-100 hover:border-primary/20'}`}>
      <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-[1.5s]" />
      <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#0A0A0B]' : 'from-white'}`} />
      
      <div className="absolute inset-0 p-12 flex flex-col justify-end">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-3">
          <span className={`text-[9px] font-bold uppercase tracking-[0.4em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Node-0{index + 1}</span>
          <h3 className={`text-3xl font-bold uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>{title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">Access Mainframe</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

import { AdminDashboardContent } from './AdminDashboard';

// --- MAIN HOME COMPONENT ---
const Home = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  // If Admin, render the Integrated Dashboard command center directly
  if (user?.role === 'admin') {
    return <AdminDashboardContent user={user} isDark={isDark} />;
  }

  // Cinematic Landing for Guests and Students (Students have a dedicated portal now)
  return (
    <div className={`flex flex-col transition-colors duration-700`}>
      {/* v12 Hybrid Hero - Always Cinematic Dark for Impact */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#050505] text-white">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000')] bg-cover bg-center grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="max-w-[1700px] mx-auto px-12 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "circOut" }}
          >
            <h1 className="text-7xl md:text-9xl font-bold uppercase mt-28 mb-12 tracking-tighter leading-[0.85]">
              ENGINEER THE <br />
              <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">COLLECTIVE.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl mx-auto mb-16 leading-relaxed opacity-80">
              Transforming fragmented data into centralized institutional intelligence. Standardizing the knowledge lifecycle for ALX Ethiopia.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/repository" className="px-14 py-8 bg-primary text-white rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.5em] shadow-4xl shadow-primary/30 hover:bg-white hover:text-black hover:shadow-none transition-all flex items-center justify-center group">
                Sync Mainframe <ChevronRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/about" className="px-14 py-8 border border-white/20 text-white rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-white/10 transition-all flex items-center justify-center">
                Mission Intel
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-center items-center z-20">
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-slate-600">
              <ArrowDown className="w-6 h-6" />
           </motion.div>
        </div>
      </section>

      {/* Visual Feature Matrix */}
      <section className={`py-20 transition-colors duration-700 px-12`}>
        <div className="max-w-[1700px] mx-auto">
          <div className={`flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 border-b pb-20 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.6em] block mb-8">System Architecture</span>
              <h2 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] ${isDark ? 'text-white' : 'text-black'}`}>GLOBAL <br />ECOSYSTEM.</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: Database, title: "Explicit Assets", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800", link: "/repository" },
              { icon: Cpu, title: "Tacit Wisdom", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800", link: "/lessons" },
              { icon: Users, title: "Expert Locator", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800", link: "/experts" },
              { icon: MessageSquare, title: "Collab Sync", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800", link: "/collaboration" },
              { icon: Lightbulb, title: "Innovation Hub", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800", link: "/innovation" },
              { icon: Activity, title: "Vital Analytics", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", link: "/" }
            ].map((f, i) => (
              <FeatureCard 
                key={i}
                index={i}
                icon={f.icon} 
                title={f.title} 
                imageUrl={f.url}
                link={f.link}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
