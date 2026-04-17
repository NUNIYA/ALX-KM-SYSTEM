import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, MessageSquare, Lightbulb, MessageCircle, Globe, 
  LayoutDashboard, LogOut, User, LogIn, FileText, Search, MoreHorizontal, Info, ChevronDown, Command 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import alxLogo from '../assets/alxlogo-removebg-preview.png';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Repository', path: '/repository', icon: BookOpen },
    { name: 'Lessons', path: '/lessons', icon: FileText },
    { name: 'Experts', path: '/experts', icon: Search },
    { name: 'Innovation', path: '/innovation', icon: Lightbulb },
  ];

  const isStudent = user?.role === 'student';
  const dashboardPath = user?.role === 'admin' 
    ? '/' 
    : user?.role === 'student'
      ? '/student-dashboard'
      : '/facilitator-dashboard';

  const moreLinks = [
    { name: 'Collaboration', path: '/collaboration', icon: MessageSquare },
    { name: 'About Us', path: '/about', icon: Info },
  ];

  if (user) {
    moreLinks.push({ name: 'Dashboard', path: dashboardPath, icon: LayoutDashboard });
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-[400] px-6 lg:px-12 pointer-events-none">
      <nav className={`mx-auto max-w-[1700px] pointer-events-auto backdrop-blur-3xl border rounded-[2rem] transition-all duration-500 shadow-2xl 
        ${isDark ? "bg-[#0A0A0B]/80 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]" : "bg-white/80 border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.1)]"}`}>
        
        <div className="flex justify-between h-20 items-center px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            <div className="flex items-center justify-center p-2 group-hover:bg-primary/5 rounded-2xl transition-all duration-700">
              <img src={alxLogo} alt="ALX Logo" className="h-9 w-auto object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-md" />
            </div>
          </Link>
          
          {/* Main Desktop Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                    isActive 
                      ? (isDark ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-primary text-white shadow-lg shadow-primary/30')
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50 hover:text-black'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2.5 ${isActive ? (isDark ? 'text-black' : 'text-white') : 'text-primary'}`} />
                  {link.name}
                </Link>
              );
            })}
            
            {/* More Dropdown */}
            <div className="relative ml-1">
              <button 
                onMouseEnter={() => setIsMoreOpen(true)}
                className={`flex items-center px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  isMoreOpen ? 'bg-primary/5 text-primary' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <MoreHorizontal className="w-4 h-4 mr-2.5" />
                More
                <ChevronDown className={`w-3 h-3 ml-2 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    onMouseLeave={() => setIsMoreOpen(false)}
                    className={`absolute right-0 top-full mt-4 w-60 rounded-[2rem] shadow-4xl p-2 overflow-hidden border backdrop-blur-xl ${isDark ? 'bg-black/90 border-white/10' : 'bg-white/90 border-slate-100'}`}
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex items-center px-5 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isActive ? 'bg-primary/10 text-primary' : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3 opacity-70" />
                          {link.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
            
          <div className={`hidden lg:block h-6 w-[1px] mx-4 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>

          {/* Right Actions: Localisation & User */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Language Switch */}
            <div className={`flex items-center p-1 rounded-full border ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
               <button className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-white text-slate-900 shadow-sm'}`}>EN</button>
               <button className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>AM</button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center px-4 py-2 rounded-full border ${isDark ? 'bg-black/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border ${isDark ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'}`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black block uppercase tracking-wider leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] block mt-1">{user.role}</span>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className={`p-3.5 rounded-full border transition-all ${isDark ? 'border-white/10 bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30' : 'border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'}`}
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-full border ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  Login
                </Link>
                <Link to="/register" className={`px-8 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl hover:scale-105 transition-all ${isDark ? 'bg-white text-black' : 'bg-primary text-white'}`}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
             <div className={`p-4 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-primary/5 border-primary/10'}`}>
                <Command className={`w-5 h-5 ${isDark ? 'text-white' : 'text-primary'}`} />
             </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
