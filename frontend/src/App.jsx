import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Repository from './pages/Repository';
import Collaboration from './pages/Collaboration';
import Innovation from './pages/Innovation';
import Feedback from './pages/Feedback';
import Localization from './pages/Localization';
import AdminDashboard from './pages/AdminDashboard';
import FacilitatorDashboard from './pages/FacilitatorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Lessons from './pages/Lessons';
import Experts from './pages/Experts';
import About from './pages/About';
import LMS from './pages/LMS';
import StudentDashboard from './pages/StudentDashboard';
import AIChatbot from './components/AIChatbot';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeWrapper = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthPage && !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAuthPage && user) {
     return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 flex flex-col font-sans selection:bg-primary selection:text-white ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F9FAFB] text-slate-900'}`}>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow relative">
        {children}
      </main>

      {/* Global AI Chatbot Assistance */}
      {!isAuthPage && <AIChatbot />}
      
      {/* Global Floating Theme Toggle */}
      <div className="fixed bottom-10 right-10 z-[500]">
         <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-700 ${isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}
         >
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
         </motion.button>
      </div>

      {/* Footer */}
      {!isAuthPage && (
      <footer className={`py-20 border-t transition-colors duration-700 ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-12 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/10">
                <span className="text-white font-bold text-xl uppercase tracking-tighter">A</span>
              </div>
              <span className={`text-2xl font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>ALX PORTAL</span>
            </div>
            <p className={`text-sm font-bold uppercase tracking-widest leading-loose max-w-md ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              The definitive internal knowledge ecosystem for tech leaders across Ethiopia.
            </p>
          </div>
          <div className="flex flex-col lg:items-end space-y-6">
            <div className="flex justify-center lg:justify-end space-x-10 text-[10px] font-bold uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-primary transition-colors italic">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors italic">Terms</a>
              <a href="#" className="hover:text-primary transition-colors italic">Contact</a>
            </div>
            <p className={`text-[9px] font-bold uppercase tracking-[0.4em] ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
              &copy; {new Date().getFullYear()} ALX ETHIOPIA KM MAIN FRAME.
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ThemeWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/repository" element={<Repository />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/innovation" element={<Innovation />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/localization" element={<Localization />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/facilitator-dashboard" element={<FacilitatorDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/about" element={<About />} />
              <Route path="/lms" element={<LMS />} />
            </Routes>
          </ThemeWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
