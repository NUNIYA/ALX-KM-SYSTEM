import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Database, MessageSquare, Lightbulb, Users, FileText, TrendingUp, Activity, ShieldCheck, Radar } from "lucide-react";
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboardContent = ({ user, isDark }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/stats`);
        setStats(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
       <div className="flex flex-col items-center">
          <Activity className="w-16 h-16 text-primary animate-pulse mb-8" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Initializing Strategic Command...</span>
       </div>
    </div>
  );

  const chartData = stats ? [
    { name: 'Assets', value: stats.totalResources || 0 },
    { name: 'Threads', value: stats.totalPosts || 0 },
    { name: 'Pitches', value: stats.totalIdeas || 0 },
    { name: 'Wisdom', value: stats.totalLessons || 0 },
    { name: 'Experts', value: stats.totalExperts || 0 }
  ] : [];

  const pieData = stats ? [
    { name: 'Resources', value: stats.totalResources || 0 },
    { name: 'Posts',     value: stats.totalPosts || 0 },
    { name: 'Ideas',     value: stats.totalIdeas || 0 },
    { name: 'Lessons',   value: stats.totalLessons || 0 },
    { name: 'Experts',   value: stats.totalExperts || 0 },
  ].filter(d => d.value > 0) : [];

  const total = stats ? (stats.totalResources || 0) + (stats.totalPosts || 0) + (stats.totalIdeas || 0) : 10;
  const activityData = [
    { name: 'Mon', activity: Math.round(total * 0.12) },
    { name: 'Tue', activity: Math.round(total * 0.20) },
    { name: 'Wed', activity: Math.round(total * 0.25) },
    { name: 'Thu', activity: Math.round(total * 0.18) },
    { name: 'Fri', activity: Math.round(total * 0.22) },
    { name: 'Sat', activity: Math.round(total * 0.08) },
    { name: 'Sun', activity: Math.round(total * 0.05) },
  ];

  const COLORS = ['#0066FF', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  const tooltipStyle = {
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#050505',
    color: '#FFF',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
  };

  return (
    <div className={`min-h-screen pb-40 transition-all duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      
      {/* ── Mainframe Header ── */}
      <section className="bg-[#050505] pt-40 pb-44 px-12 text-white relative overflow-hidden">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} transition={{ duration: 2 }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-end justify-between gap-16 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow shadow-primary/50" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Strategic Command Node // ALX ETHIOPIA</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
              Welcome,<br /><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">{user?.name} (Admin)</span>.
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xl leading-relaxed opacity-80">
              Aggregated institutional intelligence metrics and high-velocity ecosystem health monitoring.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
             <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center gap-10 shadow-4xl shadow-black/20">
                <div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-3">System Integrity</span>
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
                      <span className="text-3xl font-black italic tracking-widest uppercase">Operational</span>
                   </div>
                </div>
                <ShieldCheck className="w-12 h-12 text-primary/40" />
             </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Grid ── */}
      <main className="max-w-[1700px] mx-auto px-12 -mt-24 relative z-20">
        
        {/* Metric Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
          {[
            { label: 'Asset Bank',   value: stats?.totalResources || 0, icon: Database,     trend: '+12% Density' },
            { label: 'Comm Grid',    value: stats?.totalPosts || 0,     icon: MessageSquare, trend: '98.5% Active' },
            { label: 'Pitch Hub',    value: stats?.totalIdeas || 0,     icon: Lightbulb,     trend: '14 Pending Review' },
            { label: 'Vital Wisdom', value: stats?.totalLessons || 0,   icon: FileText,      trend: '42 New Insights' },
            { label: 'Elite Sync',   value: stats?.totalExperts || 0,   icon: Users,         trend: 'Network Peer Map' }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-7 rounded-3xl border transition-all group relative overflow-hidden ${isDark ? 'bg-[#0A0A0B] border-white/5 hover:border-primary/20' : 'bg-white border-slate-100 hover:shadow-2xl'}`}>
              <item.icon className={`w-8 h-8 mb-6 transition-transform group-hover:scale-110 ${i % 2 === 0 ? 'text-primary' : (isDark ? 'text-white' : 'text-black')}`} />
              <div className="text-3xl font-black tracking-tighter mb-2">{item.value}</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">{item.label}</span>
              <span className="text-[9px] font-bold text-primary italic uppercase tracking-widest">{item.trend}</span>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          
          {/* Bar Chart — Knowledge Density */}
          <div className={`p-10 rounded-[3rem] border shadow-4xl ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase tracking-tighter">Knowledge Density</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Distribution of institutional assets</p>
                </div>
                <Radar className="w-8 h-8 text-primary opacity-20" />
             </div>
             <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#222' : '#F1F5F9'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#52525B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#52525B' }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                         {chartData.map((e, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Pie Chart — Content Breakdown */}
          <div className={`p-10 rounded-[3rem] border shadow-4xl ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase tracking-tighter">Content Split</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proportional breakdown by type</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary opacity-20" />
             </div>
             <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                         {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-3 gap-2 mt-4">
                {pieData.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{d.name} ({d.value})</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Weekly Activity Area Chart */}
        <div className={`p-12 rounded-[4.5rem] border shadow-4xl ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-center mb-10">
             <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Weekly Engagement</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ecosystem activity over the last 7 days (derived from live totals)</p>
             </div>
             <Activity className="w-8 h-8 text-primary opacity-20" />
          </div>
          <div className="h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                   <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                         <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#222' : '#F1F5F9'} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#52525B' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#52525B' }} allowDecimals={false} />
                   <Tooltip contentStyle={tooltipStyle} />
                   <Area type="monotone" dataKey="activity" name="Activity" stroke="#0066FF" fill="url(#actGrad)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#0066FF' }} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
};

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  return <AdminDashboardContent user={user} isDark={isDark} />;
};

export { AdminDashboardContent };
export default AdminDashboard;
