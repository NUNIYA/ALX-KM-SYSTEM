import React from 'react';
import { Award, Target, Users, ShieldCheck, Zap, Globe, ArrowRight, Sparkles, BookOpen, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5 }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" 
          alt="ALX Directorate" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        
        <div className="relative z-10 text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
             <div className="inline-flex items-center px-6 py-2 mb-12 text-[10px] font-black tracking-[0.5em] text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                Institutional Mission Directive
            </div>
            <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tight mb-8 leading-[0.9]">
              THE <br /><span className="text-primary">DIRECTORATE.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs max-w-2xl mx-auto leading-relaxed">
              Standardizing technical excellence across the Ethiopian digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section (Visual Peak) */}
      <section className="py-40 px-12 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -z-10 rounded-l-[10rem]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-4 mb-10 text-primary">
               <Fingerprint className="w-12 h-12" />
               <div className="h-px w-20 bg-primary" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-black uppercase tracking-tight mb-10 leading-none">
              KNOWLEDGE <br />IS OUR <span className="text-primary">SIGNATURE.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-16 font-medium border-l-8 border-primary pl-10">
              ALX Ethiopia is a high-density technical ecosystem. We believe that by capturing peer wisdom as structured protocol, we can accelerate the growth of the Ethiopian digital economy at a speed previously deemed impossible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-black rounded-[2rem] text-white shadow-4xl group hover:bg-primary transition-all duration-700">
                  <Zap className="w-10 h-10 mb-6 text-primary group-hover:text-white" />
                  <h4 className="font-black uppercase tracking-widest text-xs mb-3">Velocity</h4>
                  <p className="text-slate-400 text-[10px] uppercase font-bold group-hover:text-white/80">Rapid knowledge sync across the ALX global network.</p>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2rem] text-black shadow-sm group hover:shadow-5xl transition-all duration-700">
                  <Target className="w-10 h-10 mb-6 text-primary" />
                  <h4 className="font-black uppercase tracking-widest text-xs mb-3">Precision</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Targeted learning pathways for local impact.</p>
               </div>
            </div>
          </motion.div>
          
          <div className="relative group">
            <motion.div 
               initial={{ rotate: 10, opacity: 0 }} 
               whileInView={{ rotate: 3, opacity: 1 }} 
               viewport={{ once: true }}
               className="aspect-[4/5] bg-slate-100 rounded-[5rem] overflow-hidden shadow-6xl relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200" 
                alt="Collaboration" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-12 left-12 text-white">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 block mb-4">Official Sync Hours</span>
                 <div className="text-6xl font-bold tracking-tight leading-none">2.5M+</div>
              </div>
            </motion.div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Visual Stats Mosaic */}
      <section className="bg-black py-40 relative">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10 text-white">
           {[
             { label: 'Technical Domains', val: '12', icon: Globe, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" },
             { label: 'Active Directorate', val: '4,200', icon: Users, img: "https://images.unsplash.com/photo-1549692523-fb6d228839ca?q=80&w=600" },
             { label: 'Crystalized Protocols', val: '850', icon: BookOpen, img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600" }
           ].map((stat, i) => (
             <div key={i} className="group flex flex-col items-center text-center">
                <div className="w-full h-64 rounded-[3rem] overflow-hidden mb-12 relative shadow-4xl group-hover:scale-105 transition-all duration-700">
                    <img src={stat.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <stat.icon className="w-16 h-16 text-primary group-hover:scale-[1.5] transition-transform" />
                    </div>
                </div>
                <div className="text-6xl font-bold tracking-tight mb-4 leading-none">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* High-End Directives Section */}
      <section className="py-40 px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
           <Sparkles className="w-20 h-20 text-primary mb-12 animate-pulse" />
           <h2 className="text-6xl md:text-7xl font-bold text-black uppercase tracking-tight mb-12 leading-tight">
             READY TO <br />JOIN THE <span className="text-primary">ELITE?</span>
           </h2>
           <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[10px] mb-20 max-w-sm">Access the mainframe to establish your technical legacy.</p>
           
           <button className="group relative px-20 py-8 bg-black text-white rounded-[3rem] font-black uppercase tracking-[0.5em] text-[10px] shadow-6xl overflow-hidden hover:bg-primary transition-all">
              <span className="relative z-10 flex items-center">
                Access Mainframe <ArrowRight className="ml-6 w-5 h-5 group-hover:translate-x-4 transition-transform" />
              </span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary group-hover:h-full transition-all duration-500 opacity-20" />
           </button>
        </div>
      </section>

      {/* Footer Abstract */}
      <section className="py-20 border-t border-slate-50 opacity-20 text-center">
         <p className="text-[8px] font-black uppercase tracking-[1rem] text-slate-400">ALX ETHIOPIA DIRECTORATE // PROTOCOL 6.0</p>
      </section>
    </div>
  );
};

export default About;
