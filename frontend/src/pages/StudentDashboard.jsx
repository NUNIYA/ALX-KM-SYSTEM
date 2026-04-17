import React, { useState, useEffect } from 'react';
import {
  BookOpen, MessageSquare, Lightbulb, TrendingUp, Users, FileText,
  Zap, ChevronRight, Activity, Database, Settings, X, Save,
  User as UserIcon, Target, Star, Award, Clock, Bell, Flame,
  Globe, CheckCircle, BarChart2, BookMarked, PenLine
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const StudentDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [resources, setResources]   = useState([]);
  const [lessons, setLessons]       = useState([]);
  const [experts, setExperts]       = useState([]);
  const [posts, setPosts]           = useState([]);
  const [ideas, setIdeas]           = useState([]);
  const [stats, setStats]           = useState({ posts: 0, ideas: 0, lessons: 0 });
  const [loading, setLoading]       = useState(true);
  const [milestone, setMilestone]   = useState({ label: 'Novice', next: 'Explorer', progress: 0 });
  const [latestResource, setLatestResource] = useState(null);

  const [lessonForm, setLessonForm] = useState({ title: '', challenge: '', description: '', category: 'Software Engineering', tags: '' });
  const [showProfileModal, setShowProfileModal]   = useState(false);
  const [profileForm, setProfileForm]             = useState({ name: user?.name || '', learningTrack: user?.learningTrack || '', skills: user?.skills?.join(', ') || '' });
  const [showLessonForm, setShowLessonForm]       = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [resR, resL, resE, resP, resI, resS] = await Promise.all([
        axios.get('http://localhost:5000/api/resources'),
        axios.get('http://localhost:5000/api/lessons'),
        axios.get('http://localhost:5000/api/auth/experts'),
        axios.get('http://localhost:5000/api/posts'),
        axios.get('http://localhost:5000/api/ideas'),
        axios.get('http://localhost:5000/api/auth/stats', { headers })
      ]);
      const trackRes = resR.data.filter(r => r.category.includes(user?.learningTrack || 'General'));
      setResources(trackRes.length > 0 ? trackRes : resR.data);
      setLatestResource((trackRes.length > 0 ? trackRes : resR.data)[0]);
      setLessons(resL.data);
      setExperts(resE.data);
      setPosts(resP.data.slice(0, 5));
      setIdeas(resI.data);
      setStats(resS.data);
      const credits = user?.credits || 0;
      if (credits < 100)  setMilestone({ label: 'Novice',      next: 'Explorer',     progress: (credits / 100) * 100 });
      else if (credits < 500)  setMilestone({ label: 'Explorer',    next: 'Contributor',  progress: ((credits - 100) / 400) * 100 });
      else if (credits < 1000) setMilestone({ label: 'Contributor', next: 'Peer Mentor',  progress: ((credits - 500) / 500) * 100 });
      else setMilestone({ label: 'Expert Mentor', next: 'ALX Facilitator', progress: 100 });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/lessons', lessonForm, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setLessonForm({ title: '', challenge: '', description: '', category: 'Software Engineering', tags: '' });
      setShowLessonForm(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch('http://localhost:5000/api/auth/me', profileForm, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setShowProfileModal(false);
      window.location.reload();
    } catch (err) { console.error(err); }
  };

  const impactScore = (user?.credits || 0) + (ideas.length * 10);
  const radialData = [{ name: 'Progress', value: Math.round(milestone.progress), fill: '#0066FF' }];

  const weeklyActivity = [
    { day: 'Mon', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.12) : 2 },
    { day: 'Tue', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.22) : 4 },
    { day: 'Wed', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.30) : 6 },
    { day: 'Thu', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.18) : 3 },
    { day: 'Fri', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.25) : 5 },
    { day: 'Sat', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.08) : 1 },
    { day: 'Sun', lessons: lessons.length > 0 ? Math.round(lessons.length * 0.05) : 1 },
  ];

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <Activity className="w-10 h-10 text-primary animate-pulse" />
    </div>
  );

  const card = `rounded-2xl border p-5 transition-all ${isDark ? 'bg-[#0A0A0B] border-white/7' : 'bg-white border-slate-200 shadow-sm'}`;
  const label = `text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`;
  const val = `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`;

  return (
    <div className={`min-h-screen pb-16 transition-all duration-500 ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>

      {/* ── Profile Modal ── */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-8 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-100/10 rounded-lg transition-all"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {[{ label: 'Display Name', key: 'name', type: 'text' }].map(f => (
                  <div key={f.key}>
                    <label className={`block text-xs font-semibold mb-1.5 ${label}`}>{f.label}</label>
                    <input type={f.type} value={profileForm[f.key]} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-primary ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                ))}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${label}`}>Learning Track</label>
                  <select value={profileForm.learningTrack} onChange={e => setProfileForm({ ...profileForm, learningTrack: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-primary ${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}>
                    {['Software Engineering', 'Data Analytics', 'AI', 'Cloud Computing', 'General'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${label}`}>Skills (comma separated)</label>
                  <input type="text" value={profileForm.skills} onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-primary ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all text-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Lesson Submit Modal ── */}
      <AnimatePresence>
        {showLessonForm && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-8 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Share a Lesson</h3>
                <button onClick={() => setShowLessonForm(false)} className="p-2 hover:bg-slate-100/10 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleLessonSubmit} className="space-y-4">
                <input type="text" placeholder="What challenge did you solve?" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  required className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-primary ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                <textarea placeholder="Describe the solution or recommendation..." rows={4} value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-primary resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all text-sm">
                  Submit Lesson (+20 Points)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <div className={`pt-10 pb-8 px-8 border-b ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Student Knowledge Hub</span>
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome, <span className="text-primary">{user?.name}</span> 👋
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Track · <span className="font-semibold text-primary">{user?.learningTrack || 'General'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLessonForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 transition-all">
              <PenLine className="w-4 h-4" /> Share Lesson
            </button>
            <button onClick={() => setShowProfileModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Impact Score',  value: impactScore,        icon: Flame,    color: '#EF4444' },
            { label: 'Rank',          value: milestone.label,    icon: Award,    color: '#F59E0B' },
            { label: 'Credits',       value: user?.credits || 0, icon: Star,     color: '#0066FF' },
            { label: 'Ideas Shared',  value: ideas.length,       icon: Lightbulb,color: '#10B981' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`${card} flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}18` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className={label}>{s.label}</p>
                <p className={`text-xl ${val}`}>{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Progress + Activity Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Progress Milestone */}
          <div className={`${card}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={label}>Milestone Progress</p>
                <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{milestone.label} → {milestone.next}</p>
              </div>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden mb-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${milestone.progress}%` }} transition={{ duration: 1.5 }}
                className="h-full bg-primary rounded-full" />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">{milestone.label}</span>
              <span className="text-xs font-semibold text-primary">{Math.round(milestone.progress)}%</span>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
              {[
                { l: 'Posts', v: stats.posts || 0 },
                { l: 'Lessons', v: stats.lessons || 0 },
              ].map(s => (
                <div key={s.l} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <p className={label}>{s.l}</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className={`lg:col-span-2 ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={label}>Weekly Learning Activity</p>
                <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Lesson contributions this week</p>
              </div>
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="stuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1f2126' : '#f1f5f9'} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: isDark ? '#52525b' : '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: isDark ? '#52525b' : '#94a3b8' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: isDark ? '#111' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, fontSize: 11, fontWeight: 700 }} />
                  <Area type="monotone" dataKey="lessons" name="Lessons" stroke="#0066FF" fill="url(#stuGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Resources + Latest ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={label}>Mastery Kit</p>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Resources for your track</h2>
            </div>
            <Link to="/repository" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {latestResource && (
              <div className={`rounded-2xl border p-5 relative overflow-hidden group ${isDark ? 'bg-primary/10 border-primary/20' : 'bg-slate-900 text-white shadow-xl'}`}>
                <Zap className="absolute top-4 right-4 w-4 h-4 text-primary opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 block">Latest</span>
                <h3 className={`text-sm font-bold leading-snug mb-4 line-clamp-3 ${isDark ? 'text-white' : 'text-white'}`}>{latestResource.title}</h3>
                <a href={`http://localhost:5000/${latestResource.fileUrl}`} target="_blank" rel="noreferrer"
                  className="inline-block w-full text-center bg-primary text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all">
                  Study Now
                </a>
              </div>
            )}
            {resources.slice(1, 4).map(res => (
              <div key={res._id} className={`${card} group`}>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3 inline-block">{res.category}</span>
                <h4 className={`text-sm font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{res.title}</h4>
                <a href={`http://localhost:5000/${res.fileUrl}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
                  Read Resource <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Community Posts + Mentor Network ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Lessons Feed */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={label}>Community Lessons</p>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Contributions</h2>
              </div>
              <BookMarked className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              {lessons.slice(0, 5).map((l, i) => (
                <div key={l._id || i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all`}>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{l.title || l.challenge}</p>
                    <p className="text-xs text-slate-500 truncate">{l.description?.slice(0, 60)}...</p>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">No lessons yet. Be the first to contribute!</p>
              )}
            </div>
          </div>

          {/* Mentor Network */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={label}>Mentor Network</p>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Connect with Experts</h2>
              </div>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              {experts.slice(0, 4).map(exp => (
                <div key={exp._id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all group`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm group-hover:scale-110 transition-transform">
                      {exp.name?.[0]}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.name}</p>
                      <p className="text-xs text-slate-500">{exp.learningTrack}</p>
                    </div>
                  </div>
                  <Link to={`/experts?skill=${exp.skills?.[0]}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all">
                    <MessageSquare className="w-3 h-3" /> Connect
                  </Link>
                </div>
              ))}
              <Link to="/experts" className={`block w-full py-2.5 text-center text-xs font-semibold rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-50 hover:bg-slate-100 text-slate-500'}`}>
                View Full Directory
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick Navigation Cards ── */}
        <div>
          <p className={`${label} mb-3`}>Quick Access</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Repository',     icon: Database,    to: '/repository',     color: '#0066FF' },
              { label: 'Collaboration',  icon: Users,       to: '/collaboration',  color: '#10B981' },
              { label: 'Innovation',     icon: Lightbulb,   to: '/innovation',     color: '#F59E0B' },
              { label: 'Lessons',        icon: BookOpen,    to: '/lessons',        color: '#8B5CF6' },
            ].map((nav, i) => (
              <Link key={i} to={nav.to}>
                <motion.div whileHover={{ y: -3 }} className={`${card} flex flex-col items-center gap-3 py-6 cursor-pointer text-center`}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${nav.color}18` }}>
                    <nav.icon className="w-5 h-5" style={{ color: nav.color }} />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{nav.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
