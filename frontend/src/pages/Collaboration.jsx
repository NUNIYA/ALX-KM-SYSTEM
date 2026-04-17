import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, Send, User, Calendar, MessageCircle, Lock, PlusCircle, Tag, Folder, Zap, ChevronRight, Globe, Sparkles, X, Terminal, Filter, Eye, Activity, Disc, ChevronUp, Clock, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const getPostTheme = (type) => {
  if (type === 'Announcement') return { 
    color: 'emerald', 
    text: 'text-emerald-500 dark:text-emerald-400', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/20',
    blob: 'bg-emerald-400/30 dark:bg-emerald-600/20',
    Icon: Sparkles 
  };
  if (type === 'Question') return { 
    color: 'rose', 
    text: 'text-rose-500 dark:text-rose-400', 
    bg: 'bg-rose-500/10', 
    border: 'border-rose-500/20',
    blob: 'bg-rose-400/30 dark:bg-rose-600/20',
    Icon: MessageCircle 
  };
  return { 
    color: 'sky', 
    text: 'text-sky-500 dark:text-sky-400', 
    bg: 'bg-sky-500/10', 
    border: 'border-sky-500/20',
    blob: 'bg-sky-400/30 dark:bg-sky-600/20',
    Icon: Terminal 
  };
};

/* ═══════════════════════════════════════════════════════
   POST DETAIL PANEL (SLIDE-IN WITH REPLIES)
════════════════════════════════════════════════════════ */
const PostPanel = ({ post, onClose, isDark, user }) => {
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const theme = getPostTheme(post.postType);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments?targetType=post&targetId=${post._id}`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments(res.data);
    } catch (err) { console.error(err); }
    setLoadingComments(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    if (!user) { alert("Initialization Denied: Please login to interface with the network."); return; }
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments', 
        { body: replyText, targetType: 'post', targetId: post._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setReplyText('');
      fetchComments();
    } catch (err) { console.error(err); alert("Network transmission failed."); }
  };

  return (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-[500]" />
    
    <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 240 }}
      className={`fixed top-0 right-0 h-full w-full max-w-2xl z-[600] flex flex-col shadow-2xl border-l overflow-hidden
        ${isDark ? 'bg-[#0f1115] border-white/10 text-white' : 'bg-[#fafafa] border-slate-200 text-slate-900'}`}>
      
      {/* Contextual Pattern Layers Inside Panel */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
         backgroundImage: isDark 
           ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px)' 
           : 'repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 32px), repeating-linear-gradient(-45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 32px)',
         opacity: 1
      }} />
      
      {/* Header Bar */}
      <div className={`shrink-0 flex items-center justify-between p-6 border-b relative z-20 backdrop-blur-xl ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-white/40'}`}>
         <div className="flex items-center gap-3">
             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme.border} ${theme.bg} ${theme.text}`}>
               <theme.Icon className="w-3 h-3" /> {post.postType}
             </span>
             <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
               Live Discussion
             </span>
         </div>
         <button onClick={onClose} className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className={`flex-1 overflow-y-auto p-10 flex flex-col relative z-20`}>
         
         <div className="relative z-10">
            <h2 className={`text-4xl lg:text-5xl font-black tracking-tight leading-[1.0] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
               {post.title}
            </h2>

            <div className="flex items-center gap-4 mb-10">
               <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <User className="w-5 h-5"/>
               </div>
               <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Started By</p>
                  <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.author}</p>
               </div>
               <div className="ml-auto text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Posted On</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
               </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border mb-12 shadow-sm ${isDark ? 'bg-white/5 border-white/10 backdrop-blur-lg' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
               <p className={`text-lg leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {post.content}
               </p>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col flex-1">
               <h4 className={`text-sm font-black uppercase tracking-wider mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <MessageSquare className={`w-5 h-5 ${theme.text}`} /> Thread Replies ({comments.length})
               </h4>

               <div className="flex-1 space-y-4 mb-8">
                  {loadingComments ? (
                    <div className={`animate-pulse text-center text-xs font-bold uppercase tracking-widest py-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Loading Replies...</div>
                  ) : comments.length === 0 ? (
                    <div className={`text-center text-xs font-bold uppercase tracking-widest py-16 border border-dashed rounded-[2rem] ${isDark ? 'text-slate-500 border-white/10 bg-black/20' : 'text-slate-400 border-slate-200 bg-slate-50/50'}`}>
                      Be the first to share your thoughts.
                    </div>
                  ) : (
                    comments.map(comment => (
                       <div key={comment._id} className={`p-6 rounded-3xl border transition-colors shadow-sm ${isDark ? 'bg-black/40 border-white/10 hover:border-white/20' : 'bg-white/60 border-slate-200 hover:border-slate-300'}`}>
                          <div className={`flex items-center gap-3 mb-3 pb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                                <User className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-500'}`} />
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{comment.authorName}</span>
                             {comment.authorRole === 'admin' && <span className="px-2 py-0.5 rounded-sm text-[8px] uppercase tracking-widest font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Admin</span>}
                             <span className={`ml-auto text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{comment.body}</p>
                       </div>
                    ))
                  )}
               </div>

               {/* Reply Input Box */}
               <div className={`mt-auto pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className={`p-2 pl-6 rounded-[2.5rem] border flex items-center gap-3 transition-all shadow-lg backdrop-blur-xl ${isDark ? 'bg-black/60 border-white/10 focus-within:border-white/30' : 'bg-white/90 border-slate-200 focus-within:border-sky-400'}`}>
                     <textarea rows={1} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
                        className={`w-full bg-transparent resize-none outline-none text-sm font-semibold py-4 ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`} />
                     <button onClick={handleReply} disabled={!replyText.trim()}
                        className={`shrink-0 h-14 w-14 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
                        <Send className="w-5 h-5 ml-1" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </motion.aside>
  </>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
const Collaboration = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const { user, refreshUser } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Software Engineering', postType: 'Question', tags: '', author: user ? user.name : 'ALX Student'
  });

  useEffect(() => {
    if (user) setFormData(prev => ({ ...prev, author: user.name }));
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/posts');
      setPosts(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Initialization Denied: You must be authenticated to create a network broadcast."); return; }
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/posts', formData, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData({ title: '', content: '', category: 'Software Engineering', postType: 'Question', tags: '', author: user ? user.name : 'ALX Student' });
      setShowForm(false);
      fetchPosts();
      if (refreshUser) await refreshUser();
    } catch (err) { console.error(err); alert("Transmission Failed. Check authentication."); }
  };

  const filteredPosts = activeFilter === 'All' ? posts : posts.filter(p => p.postType === activeFilter);

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-[1500ms] relative overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      
      {/* ═══ COOL DRAMATIC LATTICE PATTERN ═══════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
         backgroundImage: isDark 
           ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)' 
           : 'repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 40px), repeating-linear-gradient(-45deg, #f1f5f9 0px, #f1f5f9 2px, transparent 2px, transparent 40px)',
         opacity: 1
      }} />

      {/* ═══ DRAMATIC HERO SECTION ═══════════════════════════════════ */}
      <section className={`relative pt-36 pb-36 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-black'}`}>
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />
        <div className={`absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-[${isDark ? '#000000' : '#e2e8f0'}]`} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center flex-wrap gap-8 text-center mt-12">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7 }}>
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.85] text-white drop-shadow-2xl">
                Global <span className="text-cyan-400">Network.</span>
             </h1>
             <p className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-300 max-w-3xl mx-auto leading-loose px-6">
                Establish direct peer-to-peer comms. Ask algorithms questions, share deployment insights, and coordinate.
             </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FLOATING ACTION BAR ═════════════════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-16 relative z-20 mb-20">
         <div className={`px-6 py-5 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl transition-colors ${isDark ? 'bg-[#0f1115]/80 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
               {['All', 'Knowledge Share', 'Question', 'Announcement'].map(filter => (
                  <button key={filter} onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                      ${activeFilter === filter 
                        ? (isDark ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black text-white shadow-xl')
                        : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-black hover:bg-slate-100')}`}>
                     {filter}
                  </button>
               ))}
            </div>
            
            <button onClick={() => { if (!user) window.location.href = '/login'; else setShowForm(true); }}
               className="w-full md:w-auto shrink-0 flex items-center justify-center gap-3 px-10 py-5 bg-white text-black hover:scale-105 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-black/10">
               <Zap className="w-5 h-5 text-purple-600" /> Execute Thread
            </button>
         </div>
      </div>

      {/* ═══ GLASSMORPHISM AURORA CARDS ════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full mb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <div key={i} className={`h-80 rounded-[2.5rem] animate-pulse border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'}`} />)}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={`py-48 text-center rounded-[3rem] border border-dashed flex flex-col items-center justify-center backdrop-blur-xl ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/40 border-slate-300'}`}>
             <Disc className={`w-20 h-20 mb-6 opacity-40 animate-spin-slow ${isDark ? 'text-white' : 'text-slate-600'}`} />
             <p className={`font-black uppercase tracking-[0.2em] text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No activity detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredPosts.map((post, i) => {
               const theme = getPostTheme(post.postType);
               return (
              <motion.div key={post._id} onClick={() => setSelectedPost(post)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`group cursor-pointer relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] flex flex-col aspect-[4/5] shadow-2xl backdrop-blur-2xl
                  ${isDark ? 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10' : 'bg-white/60 border-white/80 hover:bg-white/90 hover:shadow-cyan-500/10'}`}>
                
                {/* Visual Glass Edge Highlights */}
                <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all pointer-events-none ${theme.blob}`} />

                <div className={`relative z-10 p-8 flex flex-col h-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                   
                   {/* Header Row */}
                   <div className="flex items-start justify-between mb-8">
                      <div className="flex flex-col gap-2 relative z-10">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${theme.border} ${theme.bg} ${theme.text}`}>
                            <theme.Icon className="w-3 h-3" /> {post.postType}
                         </span>
                         <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {post.category}
                         </span>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                         <MessageSquare className="w-4 h-4 text-cyan-500 mb-0.5" />
                         <span className="font-black text-[10px] uppercase tracking-widest">{post.commentCount || 0} Replies</span>
                      </div>
                   </div>

                   {/* Core Typography */}
                   <h3 className={`text-2xl font-black tracking-tight leading-tight mb-4 transition-colors line-clamp-3 ${theme.text.replace('text-', 'group-hover:text-')}`}>
                      {post.title}
                   </h3>

                   <p className={`text-sm font-medium leading-relaxed line-clamp-2 mb-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {post.content}
                   </p>

                   {/* Footer Lock */}
                   <div className={`mt-auto flex items-end justify-between pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-300/50'}`}>
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-300'}`}>
                            <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-600'}`} />
                         </div>
                         <div>
                            <p className={`text-[8px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Author</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest`}>{post.author}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-[10px] font-bold tracking-widest ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>

              </motion.div>
            );
            })}
          </div>
        )}
      </div>

      {/* ═══ DETAIL PANEL ════════════════════════════ */}
      <AnimatePresence>
        {selectedPost && (
          <PostPanel post={selectedPost} onClose={() => setSelectedPost(null)} isDark={isDark} user={user} />
        )}
      </AnimatePresence>

      {/* ═══ CREATE THREAD MODAL ════════════════════════════ */}
      <AnimatePresence>
        {showForm && (
          <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className={`fixed inset-0 backdrop-blur-md z-[500] ${isDark ? 'bg-black/60' : 'bg-slate-900/40'}`} />
             <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className={`fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] rounded-[2.5rem] z-[600] p-10 shadow-2xl overflow-y-auto border backdrop-blur-2xl ${isDark ? 'bg-[#0f1115]/90 border-white/20 text-white' : 'bg-white/90 border-white/80 text-slate-900'}`}>
               
               <div className={`flex items-start justify-between mb-10 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                 <div>
                   <h2 className={`text-4xl font-black tracking-tight mb-2`}>Start a <span className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Discussion</span></h2>
                   <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Broadcast a new query or announcement to the cohort.</p>
                 </div>
                 <button onClick={() => setShowForm(false)} className={`p-3 rounded-full transition-all ${isDark ? 'bg-white/5 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                   <X className="w-6 h-6" />
                 </button>
               </div>
 
               <form onSubmit={handleSubmit} className="space-y-8">
                 <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Thread Title</label>
                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Type a descriptive title..."
                        className={`w-full px-6 py-5 rounded-2xl border text-base font-bold outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-700' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Topic Category</label>
                       <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                           className={`w-full px-6 py-5 rounded-2xl border text-sm font-bold outline-none transition-all ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 cursor-pointer'}`}>
                           {['Software Engineering', 'Data Analytics', 'AI', 'Soft Skills', 'Career Development'].map(c => <option key={c} className="bg-slate-900 text-white md:bg-white md:text-black">{c}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Discussion Type</label>
                       <select value={formData.postType} onChange={e => setFormData({ ...formData, postType: e.target.value })}
                           className={`w-full px-6 py-5 rounded-2xl border text-sm font-bold outline-none transition-all ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 cursor-pointer'}`}>
                           {['Knowledge Share', 'Question']
                             .concat((user && ['admin', 'mentor', 'facilitator', 'employee'].includes(user.role)) ? ['Announcement'] : [])
                             .map(c => <option key={c} value={c} className="bg-slate-900 text-white md:bg-white md:text-black">{c}</option>)}
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Thread Body</label>
                    <textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Describe your issue or discovery..."
                        className={`w-full p-6 rounded-2xl border text-base font-semibold resize-none outline-none focus:border-purple-500 transition-all leading-relaxed ${isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-700' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`} />
                 </div>
                 
                 <div className={`flex justify-end gap-4 pt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                   <button type="button" onClick={() => setShowForm(false)} className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>Cancel</button>
                   <button type="submit" className={`px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-black shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                     Publish Thread
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

export default Collaboration;
