import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../utils/api';
import {
  Search, Plus, Download, Edit3, Eye, Trash2, User, Calendar,
  Send, MessageCircle, X, FileText, Layers, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_FILTERS = ['All', 'My Docs', 'Drafts', 'Pending'];
const CATEGORIES = ['SOP', 'Curriculum', 'Coaching Guide', 'Partnerships'];
const FILTERS = [...BASE_FILTERS, ...CATEGORIES];

const MentorRepository = () => {
  const [resources, setResources]          = useState([]);
  const [loading, setLoading]              = useState(true);
  const [activeFilter, setActiveFilter]    = useState('All');
  const [search, setSearch]                = useState('');
  const [showUpload, setShowUpload]        = useState(false);
  const [submitting, setSubmitting]        = useState(false);
  const { user, refreshUser } = useAuth();
  const { isDark }            = useTheme();

  const [form, setForm] = useState({ title: '', description: '', category: 'SOP', tags: '' });
  const [file, setFile] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/resources?search=${search}`;
      if (activeFilter === 'My Docs') url += '&filter=my-docs';
      if (activeFilter === 'Drafts')  url += '&filter=drafts';
      if (activeFilter === 'Pending') url += '&filter=pending';
      const res = await axios.get(url);
      setResources(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDownloadFile = async (fileUrl, title) => {
    try {
      const response = await fetch(`${API_BASE}/${fileUrl}`);
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

  useEffect(() => { const t = setTimeout(fetchResources, 350); return () => clearTimeout(t); }, [search, activeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('file', file);
    try {
      await axios.post(`${API_BASE}/api/resources`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ title: '', description: '', category: 'SOP', tags: '' });
      setFile(null); setShowUpload(false); fetchResources();
      if (refreshUser) await refreshUser();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const handlePublish = async (id) => {
    try { await axios.patch(`${API_BASE}/api/resources/${id}`, { status: 'published' }); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft permanently?')) return;
    try { await axios.delete(`${API_BASE}/api/resources/${id}`); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const filtered = resources.filter(r => {
    if (CATEGORIES.includes(activeFilter)) return r.category === activeFilter;
    return true;
  });

  const STATUS_BADGE = {
    draft:     'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
    pending:   'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400',
    published: 'bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400',
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>

      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative pt-32 pb-16 border-b border-black/5 dark:border-white/5 overflow-hidden">
        {isDark && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center md:text-left flex flex-col md:items-start items-center">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 w-full">
              <div className="flex-1">
                <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Knowledge <span className="text-amber-500">Repository.</span>
                </h1>
                <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mx-auto md:mx-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Distribute, review, and manage learning assets across all tracks.
                </p>
              </div>
              <button onClick={() => setShowUpload(true)}
                className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-full text-base font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                <Plus className="w-5 h-5" /> Distribute Asset
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto md:mx-0 mb-8 w-full group">
            <div className="relative flex-1">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-600'}`} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search global records or your drafts..."
                className={`w-full pl-14 pr-12 py-4 rounded-xl text-base font-semibold outline-none transition-all shadow border
                  ${isDark 
                    ? 'bg-[#0f1115] border-white/10 text-white placeholder-slate-500 focus:border-amber-500/50 focus:bg-white/5' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500'}`} />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>}
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all uppercase tracking-widest
                  ${activeFilter === f
                    ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
                    : isDark 
                      ? 'bg-transparent border-white/20 text-slate-400 hover:border-white/40 hover:text-white' 
                      : 'bg-transparent border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DRAMATIC CARDS GRID ════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Directory: {activeFilter}
          </h2>
          {!loading && (
            <span className={`text-sm font-bold tracking-widest uppercase mt-2 sm:mt-0 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {filtered.length} Assets
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className={`h-[400px] rounded-[2rem] animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />)
          ) : filtered.length > 0 ? filtered.map((res, i) => {
            const isOwn = res.uploadedBy === user?.name;
            const badge = STATUS_BADGE[res.status] || STATUS_BADGE.published;
            return (
              <motion.div key={res._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-[420px]
                  ${res.status === 'draft' || res.status === 'pending'
                    ? isDark ? 'bg-gradient-to-b from-[#16120b] to-[#0d0905] border-amber-500/20' : 'bg-gradient-to-b from-amber-50 to-white border-amber-200'
                    : isDark ? 'bg-gradient-to-b from-[#11131a] to-[#0a0c10] border-white/10 hover:border-amber-500/40' : 'bg-white hover:border-amber-400'}`}>

                {/* Dramatic Background Watermark Icon */}
                <div className="absolute -right-8 -top-8 opacity-5 dark:opacity-[0.03] group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity pointer-events-none duration-500 transform group-hover:scale-110">
                  <FileText className="w-64 h-64" />
                </div>

                <div className="p-8 flex-1 flex flex-col relative z-10">
                  {/* Meta Top */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border backdrop-blur-md ${badge}`}>
                      {res.status}
                    </span>
                    <div className="flex gap-2">
                       <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest backdrop-blur-md
                         ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100/50 border-slate-200 text-slate-600'}`}>
                         {res.category}
                       </span>
                       {isOwn && <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase"><User className="w-3 h-3 inline pb-0.5"/> Yours</span>}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="flex-1 mt-2">
                    <h3 className={`text-2xl font-black mb-3 leading-tight line-clamp-3 ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-amber-500 transition-colors cursor-pointer`}>
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

                {/* Dramatic Action Bar / Grid */}
                <div className="grid grid-cols-2 mt-auto">
                   <a href={`${API_BASE}/${res.fileUrl}`} target="_blank" rel="noreferrer" 
                      className={`flex items-center justify-center gap-2 py-5 text-sm font-black uppercase tracking-wider transition-colors
                        ${isDark ? 'bg-[#1a1c23] hover:bg-[#252833] text-white border-t border-t-white/5 border-r border-r-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-t border-r border-slate-200'}`}>
                     <Eye className="w-5 h-5" /> Read
                   </a>
                   <button onClick={() => handleDownloadFile(res.fileUrl, res.title)} 
                      className="flex items-center justify-center gap-2 py-5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-black uppercase tracking-wider transition-colors border-t border-t-amber-500 cursor-pointer">
                     <Download className="w-5 h-5" /> Download
                   </button>

                   {isOwn && (
                     <div className="col-span-2 grid grid-cols-2 bg-black/20 dark:bg-black/50 border-t border-white/5">
                        {res.status === 'draft' ? (
                          <button onClick={() => handlePublish(res._id)} className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white text-xs font-black uppercase tracking-wider transition-colors">
                            <Send className="w-4 h-4" /> Publish Draft
                          </button>
                        ) : (
                          <button className={`flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-wider transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <Edit3 className="w-4 h-4" /> Edit Detail
                          </button>
                        )}
                        <button onClick={() => handleDelete(res._id)} className="flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-black uppercase tracking-wider transition-colors border-l border-white/5">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                     </div>
                   )}
                </div>
              </motion.div>
            );
          }) : (
            <div className={`col-span-full py-32 text-center rounded-[2rem] border-2 border-dashed ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-slate-50'}`}>
              <Layers className={`w-16 h-16 mx-auto mb-6 opacity-50 ${isDark ? 'text-amber-500' : 'text-amber-600'}`} />
              <p className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>No assets match query</p>
              <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>There are no documents in your current scoped view.</p>
              <button onClick={() => setActiveFilter('All')} className="px-8 py-4 bg-transparent border-2 border-amber-500 text-amber-500 rounded-full text-sm font-bold shadow-xl hover:bg-amber-500 hover:text-black transition uppercase tracking-widest">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ UPLOAD MODAL ════════════════════════════ */}
      <AnimatePresence>
        {showUpload && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500]" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className={`fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] rounded-[2rem] z-[600] p-8 md:p-10 shadow-2xl overflow-y-auto border
                ${isDark ? 'bg-[#0f1115] border-white/10' : 'bg-white border-slate-200'}`}>

              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="inline-block px-4 py-1.5 bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                    Draft → Requires Admin Approval
                  </span>
                  <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Distribute Global Asset</h2>
                </div>
                <button onClick={() => setShowUpload(false)}
                  className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: 'Document Title', key: 'title', type: 'input', holder: 'e.g., Q3 Coaching Handbook' },
                  { label: 'Summary / Description', key: 'description', type: 'textarea', holder: 'Briefly describe the contents...' },
                ].map(({ label, key, type, holder }) => (
                  <div key={key}>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>
                    {type === 'input'
                      ? <input required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={holder}
                          className={`w-full px-5 py-3.5 rounded-xl border text-base outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium
                            ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                      : <textarea required rows={4} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={holder}
                          className={`w-full px-5 py-3.5 rounded-xl border text-base resize-none outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium
                            ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    }
                  </div>
                ))}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Taxonomy Node</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className={`w-full px-5 py-3.5 rounded-xl border text-base font-bold outline-none focus:border-amber-500 transition-all
                        ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      {CATEGORIES.map(c => <option key={c} className="bg-slate-900 text-white">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Attachment</label>
                    <div className={`relative flex items-center justify-center w-full px-5 py-3.5 border-2 border-dashed rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors ${isDark ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-slate-50'}`}>
                       <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                       <span className={`text-sm font-bold truncate px-2 ${file ? 'text-amber-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>{file ? file.name : 'Click or drop file...'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-slate-200 dark:border-white/10">
                  <button type="button" onClick={() => setShowUpload(false)}
                    className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-10 py-3.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-md">
                    {submitting ? 'Saving...' : 'Save as Draft'}
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

export default MentorRepository;
