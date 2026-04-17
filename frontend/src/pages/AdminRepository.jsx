import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, AlertCircle, Trash2, Settings,
  ShieldAlert, FileWarning, Eye, EyeOff, User, Calendar,
  CheckCircle, FileText, TrendingUp, Clock, Download,
  Flag, Lock, Globe, X, Database, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['SOP', 'Curriculum', 'Coaching Guide', 'Partnerships'];
const BASE_FILTERS = ['All', 'Pending', 'Flagged', 'Restricted'];
const FILTER_CHIPS = [...BASE_FILTERS, ...CATEGORIES];

const UploadResourceModal = ({ isOpen, onClose, onSuccess, isDark }) => {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'SOP', tags: '', visibility: 'public' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Source file required');
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('visibility', formData.visibility);
    data.append('file', file);

    try {
      await axios.post('http://localhost:5001/api/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
      onClose();
    } catch (err) { alert(err.response?.data?.message || 'Ingestion failed'); }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[1001] p-10 rounded-[3.5rem] border shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Ingest Asset</h2>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-red-600`}>Master Frame Repository Upload</p>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Document Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-red-500 transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Classification</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-red-500 transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Visibility</label>
                  <select value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})} className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-red-500 transition-all ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <option value="public">Public Node</option>
                    <option value="mentor-only">Mentor Scope</option>
                    <option value="admin-only">Admin Locked</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Source File</label>
                <div className={`relative group p-4 rounded-2xl border border-dashed text-center transition-all ${isDark ? 'border-white/10 hover:border-red-500/50' : 'border-slate-300 hover:border-red-500'}`}>
                   <input type="file" required onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{file ? file.name : 'Select or Drop Document'}</p>
                </div>
              </div>
              <button disabled={loading} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
                {loading ? 'Transmitting...' : 'Upload Asset'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AdminRepository = () => {
  const [resources, setResources]      = useState([]);
  const [loading, setLoading]          = useState(true);
  const [activeFilter, setActiveFilter]= useState('All');
  const [search, setSearch]            = useState('');
  const [visMenuId, setVisMenuId]      = useState(null);
  const [isUploading, setIsUploading]  = useState(false);
  
  const { isDark } = useTheme();

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/resources?search=${search}`;
      if (activeFilter === 'Pending')    url += '&filter=pending';
      if (activeFilter === 'Flagged')    url += '&filter=flagged';
      if (activeFilter === 'Restricted') url += '&filter=restricted';
      const res = await axios.get(url);
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
    } catch (error) { console.error("Error downloading file:", error); }
  };

  useEffect(() => {
    const t = setTimeout(fetchResources, 350);
    return () => clearTimeout(t);
  }, [search, activeFilter]);

  const handleStatus = async (id, status) => {
    try { await axios.patch(`http://localhost:5001/api/resources/${id}`, { status }); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently de-archive this asset?')) return;
    try { await axios.delete(`http://localhost:5001/api/resources/${id}`); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const handleVisibility = async (id, visibility) => {
    try { await axios.patch(`http://localhost:5001/api/resources/${id}`, { visibility }); setVisMenuId(null); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const handleFlag = async (id, currentFlag) => {
     try { await axios.patch(`http://localhost:5001/api/resources/${id}`, { flagged: !currentFlag }); fetchResources(); }
     catch (err) { console.error(err); }
  };

  const filtered = resources.filter(r => {
    if (CATEGORIES.includes(activeFilter)) return r.category === activeFilter;
    return true;
  });

  const pendingCount = resources.filter(r => r.status === 'pending').length;

  const STATUS_STYLE = {
    pending:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
    published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    draft:     'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`} onClick={() => setVisMenuId(null)}>
      
      <div className="flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* ── Archival Header ── */}
        <section className="bg-[#050505] pt-32 pb-40 px-12 text-white relative overflow-hidden shrink-0">
          <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} transition={{ duration: 2 }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2500')] bg-cover bg-center" />
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-end justify-between gap-12 relative z-10 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-4 mb-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Strategic Asset Mainframe // Institutional Cache</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
                ASSET <br />
                <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">ARCHIVE.</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl leading-relaxed opacity-80">
                Centralized technical intelligence repository. Oversee documentation lifecycle and institutional integrity.
              </p>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000' }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUploading(true)}
              className="px-12 py-7 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-4xl shadow-primary/20 transition-all flex items-center gap-4 whitespace-nowrap"
            >
              <Database className="w-5 h-5" /> Ingest New Asset
            </motion.button>
          </div>
        </section>

        <UploadResourceModal isOpen={isUploading} onClose={() => setIsUploading(false)} onSuccess={fetchResources} isDark={isDark} />

        {/* ── Search & Content Tier ── */}
        <main className="flex-grow px-12 pb-40">
           <div className="max-w-[1400px] mx-auto w-full">
              
              <div className="relative -mt-10 z-30 mb-20 group">
                 <Search className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-primary' : 'text-slate-400 group-focus-within:text-black'}`} />
                 <input 
                   type="text" 
                   value={search} 
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search institutional cached assets..."
                   className={`w-full py-8 pl-20 pr-10 rounded-[2.5rem] border shadow-4xl backdrop-blur-3xl text-sm font-bold uppercase tracking-widest outline-none transition-all ${isDark ? 'bg-[#0A0A0B]/90 border-white/5 text-white placeholder-slate-700' : 'bg-white/90 border-slate-200 text-black placeholder-slate-300'}`}
                 />
              </div>

              {/* Asset Containers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {loading ? (
                   [...Array(6)].map((_, i) => <div key={i} className={`h-[480px] rounded-[3.5rem] animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />)
                ) : filtered.length > 0 ? filtered.map((res, i) => {
                  const isPending = res.status === 'pending';
                  const isRestricted = res.visibility !== 'public';
                  const badge = STATUS_STYLE[res.status] || STATUS_STYLE.published;

                  return (
                    <motion.div key={res._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`group relative overflow-hidden rounded-[3.5rem] border transition-all duration-700 hover:-translate-y-3 hover:shadow-6xl flex flex-col h-[520px] ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                      
                      {/* Technical Backing */}
                      <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none duration-1000 transform group-hover:scale-125">
                        <FileText className="w-72 h-72" />
                      </div>

                      <div className="p-10 flex-grow relative z-10 flex flex-col h-full">
                         {/* Header Tier */}
                         <div className="flex items-center justify-between mb-8">
                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border backdrop-blur-md ${badge}`}>
                              {res.status}
                            </span>
                            <div className="relative" onClick={e => e.stopPropagation()}>
                               <button onClick={() => setVisMenuId(visMenuId === res._id ? null : res._id)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-primary text-slate-500 hover:text-white' : 'bg-slate-50 hover:bg-black text-slate-400 hover:text-white'}`}>
                                  <Settings className="w-5 h-5" />
                               </button>
                               <AnimatePresence>
                                  {visMenuId === res._id && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                      className={`absolute top-full mt-3 right-0 w-56 rounded-3xl border shadow-6xl z-50 overflow-hidden ${isDark ? 'bg-[#15171e] border-white/10' : 'bg-white border-slate-200'}`}>
                                      {[
                                        { label: 'Public Access', value: 'public',     icon: Globe, color: 'text-emerald-500' },
                                        { label: 'Mentor Lock',   value: 'mentor-only', icon: EyeOff, color: 'text-indigo-500' },
                                        { label: 'Admin Locked',  value: 'admin-only',  icon: Lock,  color: 'text-primary' },
                                      ].map(opt => (
                                        <button key={opt.value} onClick={() => handleVisibility(res._id, opt.value)}
                                          className={`flex items-center gap-4 w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest ${opt.color} ${isDark ? 'hover:bg-white/5 border-b border-white/5' : 'hover:bg-slate-50 border-b border-slate-100'}`}>
                                          <opt.icon className="w-4 h-4" /> {opt.label}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
                         </div>

                         {/* Title & Domain */}
                         <div className="flex-grow">
                            <div className="flex gap-2 mb-6">
                               <span className={`px-2.5 py-1 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest`}>{res.category}</span>
                               {res.flagged && <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Flag className="w-3 h-3" /> Flagged</span>}
                            </div>
                            <h3 className={`text-3xl font-black mb-6 leading-[1.1] line-clamp-3 transition-colors ${isDark ? 'text-white group-hover:text-primary' : 'text-black group-hover:text-primary'}`}>
                               {res.title}
                            </h3>
                            <p className={`text-[11px] font-bold uppercase tracking-widest leading-relaxed line-clamp-3 opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                               {res.description}
                            </p>
                         </div>

                         {/* Author Metadata */}
                         <div className={`mt-10 pt-10 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center shrink-0 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                  <User className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                               </div>
                               <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Custodian</span>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-200' : 'text-black'}`}>{res.uploadedBy || 'ALX System'}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Last Sync</span>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-200' : 'text-black'}`}>{new Date(res.updatedAt || res.createdAt).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </div>

                      {/* Protocol Action Tray */}
                      <div className="mt-auto grid grid-cols-2 relative z-10 shrink-0">
                         {isPending ? (
                           <>
                              <button onClick={() => handleStatus(res._id, 'published')} className="py-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all">
                                 <CheckCircle className="w-5 h-5" /> Commit
                              </button>
                              <button onClick={() => handleDelete(res._id)} className={`py-7 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all border-l ${isDark ? 'bg-[#15171e] text-rose-500 border-white/5 hover:bg-rose-500 hover:text-white' : 'bg-slate-100 text-rose-600 border-slate-200 hover:bg-rose-600 hover:text-white'}`}>
                                 <X className="w-5 h-5" /> Reject
                              </button>
                           </>
                         ) : (
                           <>
                              <a href={`http://localhost:5001/${res.fileUrl}`} target="_blank" rel="noreferrer" className={`py-7 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-[#15171e] text-white border-r border-white/5 hover:bg-primary' : 'bg-slate-100 text-black border-r border-slate-200 hover:bg-black hover:text-white'}`}>
                                 <Eye className="w-5 h-5" /> Read
                              </a>
                              <button onClick={() => handleDownloadFile(res.fileUrl, res.title)} className={`py-7 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all`}>
                                 <Download className="w-5 h-5" /> Download
                              </button>
                           </>
                         )}
                         
                         {/* Universal Admin Controls */}
                         <div className="col-span-2 grid grid-cols-2">
                             <button onClick={() => handleFlag(res._id, res.flagged)} className={`py-5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-t transition-all ${res.flagged ? 'text-rose-500' : isDark ? 'text-slate-500 border-white/5 hover:bg-white/5 hover:text-white' : 'text-slate-400 border-slate-100 hover:bg-slate-50'}`}>
                                <Flag className="w-4 h-4" /> {res.flagged ? 'Secure Asset' : 'Flag Asset'}
                             </button>
                             <button onClick={() => handleDelete(res._id)} className={`py-5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-t border-l transition-all ${isDark ? 'text-slate-500 border-white/5 hover:bg-rose-600 hover:text-white' : 'text-slate-400 border-slate-100 hover:bg-rose-600 hover:text-white'}`}>
                                <Trash2 className="w-4 h-4" /> Wipe Domain
                             </button>
                         </div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className={`col-span-full py-40 rounded-[4rem] border-2 border-dashed flex flex-col items-center justify-center text-center ${isDark ? 'bg-white/2 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                     <Database className={`w-20 h-20 mb-10 opacity-10 ${isDark ? 'text-white' : 'text-black'}`} />
                     <h3 className={`text-4xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Domain Nullified</h3>
                     <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500">No assets detected within the current scope.</p>
                     <button onClick={() => setActiveFilter('All')} className="mt-12 px-10 py-5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-6xl shadow-primary/30">Reset Directory</button>
                  </div>
                )}
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRepository;
