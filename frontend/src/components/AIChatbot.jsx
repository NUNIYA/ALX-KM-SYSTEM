import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, BookOpen, User, ChevronRight, Zap, Target, Globe, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const AIChatbot = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Neural Link: Established. I am AURA. I have synchronized with the ALX Ethiopia Knowledge Base. Ready for intelligence directive.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: "Find Engineering Intel", query: "Show me Software Engineering resources" },
    { label: "Locate Peer Mentors", query: "Who are the experts in the network?" },
    { label: "Audit My Credits", query: "How do I rank up my impact score?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryOverride) => {
    const text = queryOverride || input;
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chat', { message: text }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const botMessage = { 
        role: 'bot', 
        content: res.data.response,
        suggestions: res.data.suggestions 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("AURA CONNECTION ERROR:", err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Neuro-link interrupted. System is recalibrating for a secure bypass.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[2000] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`mb-6 w-[380px] h-[580px] rounded-[3rem] border-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative transition-colors duration-500 ${isDark ? 'bg-[#0A0A0B] border-primary/40 shadow-primary/20' : 'bg-white border-primary shadow-primary/10'}`}
          >
            {/* Visual Header Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-white/30 to-primary" />
            
            {/* AURA BRANDING UNIT */}
            <div className={`p-6 pb-4 flex items-center justify-between relative z-10 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.05, 1],
                       boxShadow: ["0 0 8px rgba(var(--primary-rgb), 0.2)", "0 0 20px rgba(var(--primary-rgb), 0.4)", "0 0 8px rgba(var(--primary-rgb), 0.2)"]
                     }} 
                     transition={{ duration: 3, repeat: Infinity }}
                     className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white relative z-10 overflow-hidden"
                   >
                      <Bot className="w-7 h-7 relative z-20" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                   </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter flex items-center gap-1.5">
                    AURA <ShieldCheck className="w-4 h-4 text-primary" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 text-primary">Node Sync Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/5 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* INTELLIGENCE FEED */}
            <div className={`flex-1 overflow-y-auto px-6 py-5 space-y-8 custom-scrollbar relative z-10`}>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`group relative max-w-[90%] p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-lg border ${
                    m.role === 'user' 
                      ? 'bg-primary text-white border-primary shadow-primary/20 rounded-tr-none text-right' 
                      : (isDark ? 'bg-[#151515] text-slate-200 border-white/5 rounded-tl-none' : 'bg-slate-50 text-slate-800 border-slate-200 rounded-tl-none')
                  }`}>
                    {m.content}
                    
                    {/* Interactive Intelligence Cards */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-6 space-y-3">
                        {m.suggestions.map((s, idx) => (
                          <motion.div 
                            whileHover={{ x: 6, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }} 
                            key={idx} 
                            className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${isDark ? 'bg-black/60 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}
                          >
                             <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                   {s.type === 'resource' ? <BookOpen className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
                                </div>
                                <div>
                                   <div className="text-[8px] font-black uppercase tracking-widest text-primary mb-0.5">{s.type} Asset</div>
                                   <span className="truncate font-bold text-xs tracking-tight">{s.title}</span>
                                </div>
                             </div>
                             <ChevronRight className="w-4 h-4 text-primary" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                   <div className={`p-4 rounded-[1.5rem] flex gap-2 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-100'}`}>
                      <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                      <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                      <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTION UNIT */}
            {!loading && messages.length < 5 && (
              <div className="px-6 pb-4 flex flex-wrap gap-2 relative z-10">
                {quickActions.map((qa, idx) => (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx} 
                    onClick={() => handleSend(qa.query)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border transition-all ${isDark ? 'bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-primary hover:text-white hover:border-primary'}`}
                  >
                    {qa.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* SECURE INPUT BAR */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-6 pt-2 relative z-10 border-t border-white/5">
              <div className={`relative flex items-center p-2.5 rounded-[2rem] border-2 transition-all ${isDark ? 'bg-[#050505] border-white/10 focus-within:border-primary' : 'bg-slate-50 border-slate-200 focus-within:bg-white focus-within:border-primary shadow-inner'}`}>
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Intelligence Directive..."
                  className="flex-1 bg-transparent px-5 py-3 text-[13px] outline-none font-bold"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit" 
                  disabled={loading}
                  className="w-11 h-11 bg-primary text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex justify-between items-center mt-4 px-3">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 italic">Secure Bypass Active</p>
                 <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL NODE ACCESS: THE CORE ICON */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2.5rem] bg-primary text-white flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.6)] relative z-[2001] group border-4 border-white/20 transition-all"
      >
        <AnimatePresence mode="wait">
           {isOpen ? (
             <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                <X className="w-8 h-8" />
             </motion.div>
           ) : (
             <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}>
                <div className="relative">
                   <Bot className="w-9 h-9 relative z-10" />
                   <div className="absolute inset-0 bg-white rounded-full blur-2xl animate-pulse opacity-20" />
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIChatbot;


