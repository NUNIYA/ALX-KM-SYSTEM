import React, { useState } from 'react';
import { Globe, MapPin, Wifi, Zap, Award, CheckCircle2, Languages, ArrowRight, ChevronRight, Activity, Terminal, Command, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Localization = () => {
  const [lang, setLang] = useState('en');
  const { isDark } = useTheme();

  const content = {
    en: {
      title: "Regional Intel",
      subtitle: "Customized strategies for technical excellence in local context.",
      tipsTitle: "Learning Strategies",
      internetTitle: "Connectivity Logs",
      tips: [
        { title: "Offline Sync", text: "Download documentation and tutorials at ALX Hubs for offline study at home.", icon: Zap },
        { title: "Peer Study Groups", text: "Connect with local learners in your neighborhood for physical collaboration.", icon: Award },
        { title: "Civic Units", text: "Attend Addis Ababa tech meetups to rotate your learning with real-world networking.", icon: CheckCircle2 }
      ],
      connectivity: [
        { title: "Data Management", text: "Use text-only documentation versions during peak internet congestion hours.", icon: Wifi },
        { title: "Hub Access", text: "Leverage ALX Hub high-speed internet for heavy software installations and updates.", icon: MapPin },
        { title: "Night Study", text: "Schedule major downloads for nighttime when local bandwidth is generally higher.", icon: Globe }
      ]
    },
    am: {
      title: "ለኢትዮጵያ ተማሪዎች ድጋፍ",
      subtitle: "በአካባቢያዊ ሁኔታዎች ውስጥ ለቴክኒካዊ የላቀ ውጤት ብጁ ስልቶች።",
      tipsTitle: "የመማር ስልቶች",
      internetTitle: "የግንኙነት ምክሮች",
      tips: [
        { title: "ከመስመር ውጭ መማር", text: "ለቤት ጥናት እንዲረዳዎ ሰነዶችን እና መማሪያዎችን በALX Hubs ያውርዱ።", icon: Zap },
        { title: "የጥናት ቡድኖች", text: "ለአካላዊ ትብብር በአካባቢዎ ካሉ ተማሪዎች ጋር ይገናኙ።", icon: Award },
        { title: "የቴክኖሎጂ ኩነቶች", text: "ትክክለኛውን የአውታረ መረብ ግንኙነት ለማግኘት በአዲስ አበባ የሚዘጋጁ ኩነቶች ላይ ይሳተፉ።", icon: CheckCircle2 }
      ],
      connectivity: [
        { title: "የዳታ አጠቃቀም", text: "በኢንተርኔት መጨናነቅ ሰዓታት ውስጥ የጽሑፍ-ብቻ ሰነዶችን ይጠቀሙ።", icon: Wifi },
        { title: "የHub አጠቃቀም", text: "ለከባድ የሶፍትዌር ጭነቶች እና ዝመናዎች የALX Hub ፈጣን ኢንተርኔትን ይጠቀሙ።", icon: MapPin },
        { title: "የምሽት ጥናት", text: "ከፍተኛ የዳታ ፍሰት በሚኖርበት በምሽት ሰዓት ትላልቅ ፋይሎችን ያውርዱ።", icon: Globe }
      ]
    }
  };

  const current = content[lang];

  return (
    <div className={`min-h-screen transition-colors duration-700 pb-40`}>
      {/* v13 Hybrid Header */}
      <section className="bg-[#050505] py-48 px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2500')] bg-cover bg-center grayscale opacity-10" />
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
             <div className="inline-flex items-center px-5 py-2 mb-12 text-[10px] font-bold tracking-[0.4em] text-primary uppercase bg-primary/10 border border-primary/30 rounded-full backdrop-blur-xl">
                Regional Support // Localization Core
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-12 leading-[0.85]">
              LOCAL <br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">PROTOCOLS.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl leading-relaxed opacity-80">
              {current.subtitle} Standardizing technical excellence within the Ethiopian context.
            </p>
          </motion.div>

          {/* v13 Language Sync Hub */}
          <div className={`flex p-3 rounded-[3.5rem] border backdrop-blur-3xl shadow-6xl transition-all ${isDark ? 'bg-black border-white/10' : 'bg-white border-slate-100'}`}>
            <button 
              onClick={() => setLang('en')}
              className={`px-12 py-6 rounded-[2.5rem] text-[11px] font-bold uppercase tracking-[0.4em] transition-all flex items-center ${lang === 'en' ? 'bg-primary text-white shadow-6xl shadow-primary/30' : 'text-slate-500 hover:text-primary'}`}
            >
              <Terminal className="w-4 h-4 mr-4" /> English.sys
            </button>
            <button 
              onClick={() => setLang('am')}
              className={`px-12 py-6 rounded-[2.5rem] text-[11px] font-bold uppercase tracking-[0.4em] transition-all flex items-center ${lang === 'am' ? 'bg-primary text-white shadow-6xl shadow-primary/30' : 'text-slate-500 hover:text-primary'}`}
            >
              <Languages className="w-4 h-4 mr-4" /> አማርኛ.sys
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1700px] mx-auto px-12 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Column 1: Learning Matrix */}
          <div className="space-y-16">
            <div className="flex items-center space-x-6 mb-4">
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border shadow-xl ${isDark ? 'bg-white/5 border-white/5 text-primary' : 'bg-black border-black text-white'}`}>
                 <Zap className="w-8 h-8 " />
              </div>
              <div className="space-y-1">
                 <span className="text-[9px] font-bold text-primary uppercase tracking-[0.5em] block">Domain Node</span>
                 <h2 className={`text-4xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{current.tipsTitle}.</h2>
              </div>
            </div>
            
            <div className="space-y-10">
              {current.tips.map((tip, index) => (
                <motion.div 
                   key={index} 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className={`group p-12 rounded-[4rem] border transition-all duration-700 relative overflow-hidden shadow-sm hover:shadow-6xl ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/20' : 'bg-white border-slate-50 hover:border-primary/20'}`}
                >
                   <div className="flex items-start">
                      <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 mr-10 ${isDark ? 'bg-white/5 border-white/5 text-slate-500 group-hover:text-primary' : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-primary group-hover:text-white'}`}>
                        <tip.icon className="w-10 h-10" />
                      </div>
                      <div className="space-y-3">
                         <span className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] block group-hover:translate-x-2 transition-transform">Registry Protocol {index + 1}</span>
                         <h4 className={`text-3xl font-black uppercase tracking-tighter leading-none transition-colors ${isDark ? 'text-white' : 'text-black'}`}>{tip.title}</h4>
                         <p className={`text-[12px] font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tip.text}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Column 2: Connectivity Intelligence */}
          <div className="space-y-16">
            <div className="flex items-center space-x-6 mb-4">
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border shadow-xl ${isDark ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-primary border-primary text-white'}`}>
                 <Wifi className="w-8 h-8 " />
              </div>
              <div className="space-y-1">
                 <span className="text-[9px] font-bold text-primary uppercase tracking-[0.5em] block">Network Node</span>
                 <h2 className={`text-4xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{current.internetTitle}.</h2>
              </div>
            </div>
            
            <div className="space-y-10">
              {current.connectivity.map((tip, index) => (
                <motion.div 
                   key={index} 
                   initial={{ opacity: 0, x: 30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 + 0.3 }}
                   className={`group p-12 rounded-[4rem] border transition-all duration-700 relative overflow-hidden shadow-sm hover:shadow-6xl ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/20' : 'bg-white border-slate-50 hover:border-primary/20'}`}
                >
                   <div className="flex items-start">
                      <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 mr-10 ${isDark ? 'bg-white/5 border-white/5 text-slate-500 group-hover:text-primary' : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-black group-hover:text-white group-hover:border-black'}`}>
                        <tip.icon className="w-10 h-10" />
                      </div>
                      <div className="space-y-3">
                         <span className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] block group-hover:translate-x-2 transition-transform">Registry Protocol {index + 4}</span>
                         <h4 className={`text-3xl font-black uppercase tracking-tighter leading-none transition-colors ${isDark ? 'text-white' : 'text-black'}`}>{tip.title}</h4>
                         <p className={`text-[12px] font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tip.text}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Hub Connect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`mt-48 rounded-[5rem] p-24 text-center relative overflow-hidden group border transition-all ${isDark ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-6xl'}`}
        >
          <div className={`absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 ${isDark ? 'invert' : ''}`}></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="inline-flex items-center px-6 py-2.5 mb-14 text-[10px] font-bold tracking-[0.4em] text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
               Addis Ababa Central Command // Hub 01
            </div>
             <h3 className={`text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12 ${isDark ? 'text-white' : 'text-black'}`}>NEED REGIONAL <br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">INTELLIGENCE?</span></h3>
             <p className={`text-[11px] font-bold uppercase tracking-[0.4em] max-w-xl mb-16 opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Establish direct connection with tech facilitation units for specialized regional troubleshooting and infrastructure support.</p>
             <button className="px-24 py-9 bg-primary text-white rounded-[3rem] font-bold uppercase tracking-[0.6em] text-[11px] shadow-6xl shadow-primary/40 hover:scale-105 transition-all flex items-center group/btn">
                Contact Hub Control
                <ChevronRight className="w-6 h-6 ml-6 group-hover/btn:translate-x-4 transition-transform" />
             </button>
          </div>
          <div className="absolute bottom-[-20%] left-[-10%] opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12 group-hover:rotate-0">
            <Globe className={`w-[500px] h-[500px] ${isDark ? 'text-white' : 'text-black'}`} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Localization;
