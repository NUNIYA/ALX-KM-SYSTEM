import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Bookmark, Clock, ThumbsUp, Download, Eye, FileText, X, User, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'SOP', 'Curriculum', 'Coaching Guide', 'Partnerships'];

const StudentRepository = () => {
  const [resources, setResources]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch]         = useState('');
  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const { user }   = useAuth();
  const { isDark } = useTheme();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/resources${search ? `?search=${search}` : ''}`);
      setResources(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDownloadFile = async (fileUrl, title) => {
    try {
      const response = await fetch(`http://localhost:5001/${fileUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'Resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => { const t = setTimeout(fetchResources, 350); return () => clearTimeout(t); }, [search]);

  const handleUpvote = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/resources/${id}/upvote`);
      setResources(p => p.map(r => r._id === id ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r));
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async (id) => {
    try { await axios.patch(`http://localhost:5001/api/resources/${id}/bookmark`); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const filtered = resources.filter(r => {
    if (bookmarkOnly && !r.bookmarks?.includes(user?._id)) return false;
    if (activeFilter !== 'All' && r.category !== activeFilter) return false;
    return true;
  });

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>

      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative pt-32 pb-16 border-b border-black/5 dark:border-white/5 overflow-hidden">
        {isDark && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center md:text-left flex flex-col md:items-start items-center">
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Knowledge <span className="text-blue-600">Vault.</span>
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Access required reading materials, SOPs, and curriculum guides.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-5xl mb-8">
            <div className="relative flex-1 w-full group">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search global repository..."
                className={`w-full pl-14 pr-12 py-4 rounded-xl text-base font-semibold outline-none transition-all shadow border
                  ${isDark 
                    ? 'bg-[#0f1115] border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/5' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'}`}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button onClick={() => setBookmarkOnly(!bookmarkOnly)}
              className={`shrink-0 flex items-center gap-2 px-6 py-4 rounded-xl border text-sm font-bold transition-all shadow w-full md:w-auto justify-center
                ${bookmarkOnly 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20' 
                  : isDark ? 'bg-[#0f1115] border-white/10 text-slate-300 hover:bg-white/5' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Bookmark className="w-5 h-5" /> Saved
            </button>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all uppercase tracking-widest
                  ${activeFilter === cat
                    ? 'bg-white text-black border-white shadow-lg scale-105'
                    : isDark 
                      ? 'bg-transparent border-white/20 text-slate-400 hover:border-white/40 hover:text-white' 
                      : 'bg-transparent border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DRAMATIC CARDS GRID ════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeFilter === 'All' ? 'All Documentation' : `${activeFilter}`}
          </h2>
          {!loading && (
            <span className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {filtered.length} Resources
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className={`h-[400px] rounded-[2rem] animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />)
          ) : filtered.length > 0 ? filtered.map((res, i) => (
            <motion.div key={res._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-[400px]
                ${isDark 
                  ? 'bg-gradient-to-b from-[#11131a] to-[#0a0c10] border-white/10 hover:border-blue-500/40 hover:shadow-blue-500/20' 
                  : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:border-blue-400 hover:shadow-blue-200'}`}>

              {/* Dramatic Background Watermark Icon */}
              <div className="absolute -right-8 -top-8 opacity-5 dark:opacity-[0.03] group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity pointer-events-none duration-500 transform group-hover:scale-110">
                <FileText className="w-64 h-64" />
              </div>

              <div className="p-8 flex-1 flex flex-col relative z-10">
                {/* Meta Top */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border backdrop-blur-md
                    ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100/50 border-slate-200 text-slate-600'}`}>
                    {res.category}
                  </span>
                  
                  {/* Action icons corner */}
                  <div className="flex gap-2">
                    <button onClick={() => handleBookmark(res._id)} className={`p-2 rounded-xl transition-all ${res.bookmarks?.includes(user?._id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : isDark ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200'}`}>
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleUpvote(res._id)} className={`p-2 rounded-xl transition-all flex items-center gap-1 ${isDark ? 'bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200'}`}>
                      <ThumbsUp className="w-4 h-4" />
                      {res.helpfulVotes > 0 && <span className="text-[10px] font-black">{res.helpfulVotes}</span>}
                    </button>
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="flex-1">
                  <h3 className={`text-2xl font-black mb-3 leading-tight line-clamp-3 ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-blue-600 transition-all`}>
                    {res.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {res.description}
                  </p>
                </div>

                {/* Author / Date Info */}
                <div className={`mt-6 pt-6 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <User className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Author</p>
                      <p className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{res.uploadedBy || 'ALX Facilitator'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Updated</p>
                    <p className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      <Calendar className="w-3 h-3" /> {new Date(res.updatedAt || res.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark Hover Action Bar at Bottom */}
              <div className="grid grid-cols-2">
                <a href={`http://localhost:5001/${res.fileUrl}`} target="_blank" rel="noreferrer" 
                   className="flex items-center justify-center gap-2 py-5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-wider transition-colors">
                  <Eye className="w-5 h-5" /> Read
                </a>
                <button onClick={() => handleDownloadFile(res.fileUrl, res.title)}
                   className={`flex items-center justify-center gap-2 py-5 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer
                     ${isDark ? 'bg-[#1a1c23] hover:bg-[#252833] text-white border-t border-white/5' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                  <Download className="w-5 h-5" /> Download
                </button>
              </div>
            </motion.div>
          )) : (
            <div className={`col-span-full py-32 text-center rounded-[2rem] border-2 border-dashed ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-slate-50'}`}>
              <Search className={`w-16 h-16 mx-auto mb-6 opacity-50 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
              <p className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>No resources found</p>
              <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Try adjusting your filters or search term to locate the asset.</p>
              <button onClick={() => { setActiveFilter('All'); setSearch(''); }} className="px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold shadow-xl hover:bg-blue-500 transition">
                Clear All Restrictions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRepository;
