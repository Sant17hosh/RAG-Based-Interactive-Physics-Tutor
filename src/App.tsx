import React, { useState } from 'react';
import HomeDashboard from './components/HomeDashboard';
import VideoTutorials from './components/VideoTutorials';
import AskTutor from './components/AskTutor';
import ChaptersIndex from './components/ChaptersIndex';
import PDFs from './components/PDFs';
import WrittenExam from './components/WrittenExam';
import MCQTest from './components/MCQTest';
import AnswerEvaluator from './components/AnswerEvaluator';
import PerformanceReport from './components/PerformanceReport';
import VoiceAssistantOrb from './components/VoiceAssistantOrb';
import BackButton from './components/BackButton';
import FormulaSheet from './components/FormulaSheet';
import SummaryNotes from './components/SummaryNotes';
import VirtualLab from './components/VirtualLab';
import Practice from './components/Practice';
import Tests from './components/Tests';
import TeacherPanel from './components/TeacherPanel';
import Settings from './components/Settings';

import { CHANNELS_PUC_DATA } from './ncertData';
import { ExamReport, PerformanceStats } from './types';
import { 
  Home, GraduationCap, BookOpen, FileText, Tv, Sigma, Sparkles, 
  Layers, ListTodo, Clipboard, BrainCircuit, Trophy, Settings as SettingsIcon, 
  Users, ChevronDown, ChevronRight, Menu, X, Pin, PinOff, Award, LogOut
} from 'lucide-react';
import RevaLogo from './components/RevaLogo';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  rollNumber?: string;
  college?: string;
  className?: string;
  preferredLanguage?: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('tim_token'));
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  // Login inputs
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Registration inputs
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regRollNumber, setRegRollNumber] = useState<string>('');
  const [regCollege, setRegCollege] = useState<string>('');
  const [regClass, setRegClass] = useState<string>('Class 11 A');
  const [regLang, setRegLang] = useState<string>('English');
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  // Fallback for settings compatibility
  const username = currentUser ? currentUser.name : 'Student';
  const studentId = currentUser ? (currentUser.rollNumber || 'N/A') : 'N/A';

  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const activeToken = localStorage.getItem('tim_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
      ...options.headers,
    };
    const res = await fetch(url, {
      ...options,
      headers,
    });
    if (res.status === 401) {
      localStorage.removeItem('tim_token');
      setIsLoggedIn(false);
      setCurrentUser(null);
      setToken(null);
      window.location.reload();
    }
    return res;
  };

  const fetchStudentData = async () => {
    try {
      // 1. Fetch performance stats
      const perfRes = await apiRequest('/api/performance');
      if (perfRes.ok) {
        const data = await perfRes.json();
        if (data.success && data.stats) {
          setStats(data.stats);
          setScorePoints(data.stats.pucTotalSimulationScore);
        }
      }
      // 2. Fetch exam history
      const examRes = await apiRequest('/api/exams/history');
      if (examRes.ok) {
        const data = await examRes.json();
        setExamHistory(data);
      }
    } catch (err) {
      console.error("Failed to load student data:", err);
    }
  };

  // Restore Authentication Session
  React.useEffect(() => {
    const checkSession = async () => {
      const activeToken = localStorage.getItem('tim_token');
      if (!activeToken) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setIsLoggedIn(true);
            if (data.user.role === 'admin') {
              setActiveTab('TeacherPanel');
            } else {
              setActiveTab('Home');
            }
          } else {
            localStorage.removeItem('tim_token');
          }
        } else {
          localStorage.removeItem('tim_token');
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  React.useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchStudentData();
    }
  }, [isLoggedIn, currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!emailInput.trim() || !passwordInput) {
      setLoginError('Email and Password are required.');
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.message || 'Invalid email or password.');
        return;
      }
      localStorage.setItem('tim_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      if (data.user.role === 'admin') {
        setActiveTab('TeacherPanel');
      } else {
        setActiveTab('Home');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess(false);

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword || !regRollNumber.trim() || !regCollege.trim() || !regClass.trim()) {
      setRegisterError('All fields are required.');
      return;
    }

    if (regPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          confirmPassword: regConfirmPassword,
          rollNumber: regRollNumber,
          college: regCollege,
          className: regClass,
          preferredLanguage: regLang
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRegisterError(data.message || 'Registration failed.');
        return;
      }
      setRegisterSuccess(true);
      setEmailInput(regEmail);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegRollNumber('');
      setRegCollege('');
      setTimeout(() => {
        setShowRegister(false);
        setRegisterSuccess(false);
      }, 1500);
    } catch (err) {
      setRegisterError('Server connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tim_token');
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('Home');
    setNavigationHistory(['Home']);
  };

  const [activeTab, setActiveTab] = useState<string>('Home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['Home']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeModelName, setActiveModelName] = useState<string>('phi3:mini');

  // Sidebar controls
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isLearningExpanded, setIsLearningExpanded] = useState<boolean>(true);
  const [streakCount, setStreakCount] = useState<number>(5);

  React.useEffect(() => {
    fetch('/api/ollama-status')
      .then(res => res.json())
      .then(data => {
        if (data.activeModel) {
          setActiveModelName(data.activeModel);
        }
      })
      .catch(() => {});
  }, []);

  // Global student analytics simulation scores
  const [scorePoints, setScorePoints] = useState<number>(35);
  const [stats, setStats] = useState<PerformanceStats>({
    chaptersEvaluated: 1,
    pucTotalSimulationScore: 35,
    pucReadinessLevel: 68,
    strongTopics: ["Displacement Currents", "Sinusoidal Field Equations", "EM Waves Transverse Nature"],
    weakTopics: ["Radiation Pressure Momentum", "Ozone Layer UV Tanning Paradox", "Maxwell's Equations System"],
    overallBloomScores: {
      Remember: { current: 15, total: 20 },
      Understand: { current: 10, total: 20 },
      Apply: { current: 5, total: 15 },
      Analyze: { current: 3, total: 10 },
      Evaluate: { current: 2, total: 10 }
    }
  });

  const [examHistory, setExamHistory] = useState<ExamReport[]>([]);

  // Preset communication state variables for single script grading routing
  const [graderPresetQuestion, setGraderPresetQuestion] = useState<string | undefined>(undefined);
  const [graderPresetRubric, setGraderPresetRubric] = useState<string[] | undefined>(undefined);
  const [graderPresetMarks, setGraderPresetMarks] = useState<number | undefined>(undefined);

  const handleNavigateToGrader = (questionText: string, rubric: string[], marks: number) => {
    setGraderPresetQuestion(questionText);
    setGraderPresetRubric(rubric);
    setGraderPresetMarks(marks);
    handleTabChange('Answer Test');
  };

  const clearGraderPreset = () => {
    setGraderPresetQuestion(undefined);
    setGraderPresetRubric(undefined);
    setGraderPresetMarks(undefined);
  };

  // Callback to award simulation performance score points dynamically
  const awardScorePoints = (points: number) => {
    setScorePoints(prev => {
      const newScore = prev + points;
      // Synthesize progressive Board Readiness Rating
      const nextReadiness = Math.min(68 + Math.floor(newScore / 4), 98);
      setStats(current => ({
        ...current,
        pucTotalSimulationScore: newScore,
        pucReadinessLevel: nextReadiness
      }));
      return newScore;
    });
  };

  // Append new exam records dynamically
  const handleAddReport = (reportItem: ExamReport) => {
    setExamHistory(prev => [reportItem, ...prev]);
    // Refresh student statistics from PostgreSQL
    fetchStudentData();
  };

  const handleTabChange = (name: string) => {
    setActiveTab(name);
    setMobileMenuOpen(false);
    setNavigationHistory(prev => {
      if (prev[prev.length - 1] === name) return prev;
      return [...prev, name];
    });
  };

  const handleBack = () => {
    setNavigationHistory(prev => {
      if (prev.length <= 1) {
        setActiveTab('Home');
        return ['Home'];
      }
      const newHistory = [...prev];
      newHistory.pop(); // Remove the current tab
      const lastTab = newHistory[newHistory.length - 1]; // Peek the previous tab
      setActiveTab(lastTab || 'Home');
      return newHistory.length === 0 ? ['Home'] : newHistory;
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090D1A] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-[#FF6B00] animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#090D1A] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none" id="login-screen">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl -translate-x-12 -translate-y-12 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl translate-x-12 translate-y-12 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-5 animate-fade-in">
          {/* Circular badge of REVA University in center */}
          <div className="flex justify-center flex-col items-center gap-2">
            <RevaLogo size={120} variant="full" />
            <div className="space-y-1 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-orange-500/10 text-[#FF6B00] border border-orange-500/20">
                ⚛️ Class 11 Board Prep Platform
              </span>
              <h1 className="text-lg font-bold tracking-wider text-white uppercase">TIM Physics Portal</h1>
              <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">TIM Physics High-Fidelity Intelligent Tutoring Lounge & Assessment Engine</p>
            </div>
          </div>

          {!showRegister ? (
            /* Premium Login Card */
            <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 text-left relative overflow-hidden font-sans">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF6B00] via-amber-400 to-orange-500"></div>
              
              <div className="space-y-1.5">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Student Sign In</h2>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Enter your registered academic credentials to log in.</p>
              </div>

              {loginError && (
                <div className="p-3 text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl font-black">
                  ⚠ {loginError}
                </div>
              )}

              <div className="space-y-3 font-sans">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Student Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700 font-sans"
                    placeholder="student@reva.edu.in"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Password</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700 font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:brightness-110 active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-600/10 select-none cursor-pointer flex items-center justify-center gap-2"
              >
                Sign In to TIM Portal &rarr;
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setShowRegister(true); setLoginError(''); }}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-black uppercase tracking-wider cursor-pointer"
                >
                  Create Student Account
                </button>
              </div>
            </form>
          ) : (
            /* Premium Registration Card */
            <form onSubmit={handleRegister} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 text-left relative overflow-hidden font-sans">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF6B00] via-amber-400 to-orange-500"></div>
              
              <div className="space-y-1.5">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Student Registration</h2>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Fill in the details to create a student profile.</p>
              </div>

              {registerError && (
                <div className="p-3 text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl font-black">
                  ⚠ {registerError}
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl font-black">
                  ✔ Registration successful! Redirecting to login...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans max-h-[320px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="john@reva.edu.in"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    value={regRollNumber}
                    onChange={(e) => setRegRollNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="RACE-PUC-11-XXXX"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">College Name</label>
                  <input
                    type="text"
                    value={regCollege}
                    onChange={(e) => setRegCollege(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="REVA University"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Class / Section</label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all"
                  >
                    <option value="Class 11 A">Class 11 A</option>
                    <option value="Class 11 B">Class 11 B</option>
                    <option value="Class 11 C">Class 11 C</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Preferred Language</label>
                  <select
                    value={regLang}
                    onChange={(e) => setRegLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-white text-xs font-semibold focus:outline-none transition-all"
                  >
                    <option value="English">English</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:brightness-110 active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-600/10 select-none cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                Register Account &rarr;
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setShowRegister(false); setRegisterError(''); }}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-black uppercase tracking-wider cursor-pointer"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          <div className="text-[9px] text-slate-655 font-extrabold tracking-wider uppercase leading-none">
            TIM - Teacher In Machine Physics Assistant &bull; Secure Auth Active
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-transparent min-h-screen text-slate-800 font-sans" id="root-portal">
      
      {/* Collapsible Sidebar for screens >= lg */}
      <aside 
        className={`hidden lg:flex flex-col shrink-0 bg-[#0B1329] border-r border-[#1B2A4A] text-slate-200 min-h-screen transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        }`} 
        id="vertical-sidebar"
      >
        <div className="p-4 pb-4 border-b border-[#1B2A4A] flex flex-col items-center text-center space-y-3 relative">
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-200 p-1 cursor-pointer transition-all select-none"
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarExpanded ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>

          {isSidebarExpanded ? (
            <>
              <RevaLogo size={110} variant="full" />
              <div className="w-full text-center">
                <h2 className="text-xs font-black uppercase tracking-wider text-white leading-none">TIM PHYSICS</h2>
                <p className="text-[9px] font-extrabold text-[#FF6B00] tracking-wider uppercase mt-1 leading-none">AI Tutoring System</p>
              </div>
            </>
          ) : (
            <div className="py-2">
              <RevaLogo size={32} variant="compact" />
            </div>
          )}
        </div>

        {/* Sidebar Nav Navigator */}
        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto custom-scrollbar select-none" id="sidebar-navigator-scroller">
          
          {currentUser?.role === 'admin' ? (
            <>
              {/* Teacher Panel */}
              <button
                onClick={() => handleTabChange('TeacherPanel')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'TeacherPanel'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00] border-t-transparent border-b-transparent border-r-transparent'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Teacher Control Console"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                {isSidebarExpanded && <span>Teacher Panel</span>}
              </button>

              {/* Settings */}
              <button
                onClick={() => handleTabChange('Settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Settings'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00] border-t-transparent border-b-transparent border-r-transparent'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Settings Panel"
              >
                <SettingsIcon className="w-4 h-4 text-slate-500" />
                {isSidebarExpanded && <span>Settings</span>}
              </button>
            </>
          ) : (
            <>
              {/* Dashboard (Home) */}
              <button
                onClick={() => handleTabChange('Home')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Home'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00] border-t-transparent border-b-transparent border-r-transparent'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Dashboard"
              >
                <Home className="w-4 h-4 text-orange-500" />
                {isSidebarExpanded && <span>Dashboard</span>}
              </button>

              {/* Learning Collapsible Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => setIsLearningExpanded(!isLearningExpanded)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                  title="Learning"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    {isSidebarExpanded && <span>Learning</span>}
                  </div>
                  {isSidebarExpanded && (isLearningExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
                </button>

                {isLearningExpanded && (
                  <div className={`space-y-1 ${isSidebarExpanded ? 'pl-6' : 'pl-0'}`}>
                    {/* Chapters */}
                    <button
                      onClick={() => handleTabChange('Chapters')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'Chapters'
                          ? 'bg-orange-500/10 text-white border-l-2 border-[#FF6B00]'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="Chapters"
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      {isSidebarExpanded && <span>Chapters</span>}
                    </button>

                    {/* PDFs */}
                    <button
                      onClick={() => handleTabChange('PDFs')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'PDFs'
                          ? 'bg-orange-500/10 text-white border-l-2 border-[#FF6B00]'
                          : 'text-slate-405 text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="PDF Notes"
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      {isSidebarExpanded && <span>PDF Notes</span>}
                    </button>

                    {/* Videos */}
                    <button
                      onClick={() => handleTabChange('Video Tutorials')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'Video Tutorials'
                          ? 'bg-orange-500/10 text-white border-l-2 border-[#FF6B00]'
                          : 'text-slate-405 text-slate-404 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="Videos"
                    >
                      <Tv className="w-3.5 h-3.5 shrink-0" />
                      {isSidebarExpanded && <span>Videos</span>}
                    </button>

                    {/* Formulas */}
                    <button
                      onClick={() => handleTabChange('FormulaSheet')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'FormulaSheet'
                          ? 'bg-orange-500/10 text-white border-l-2 border-[#FF6B00]'
                          : 'text-slate-405 text-slate-404 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="Formula Sheets"
                    >
                      <Sigma className="w-3.5 h-3.5 shrink-0" />
                      {isSidebarExpanded && <span>Formula Sheet</span>}
                    </button>

                    {/* Summaries */}
                    <button
                      onClick={() => handleTabChange('SummaryNotes')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === 'SummaryNotes'
                          ? 'bg-orange-500/10 text-white border-l-2 border-[#FF6B00]'
                          : 'text-slate-405 text-slate-404 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="Summary Notes"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      {isSidebarExpanded && <span>Summary Notes</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Virtual Lab */}
              <button
                onClick={() => handleTabChange('VirtualLab')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'VirtualLab'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Virtual Lab"
              >
                <Layers className="w-4 h-4 text-orange-400" />
                {isSidebarExpanded && <span>Virtual Lab</span>}
              </button>

              {/* Practice */}
              <button
                onClick={() => handleTabChange('Practice')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Practice'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Practice Hub"
              >
                <ListTodo className="w-4 h-4 text-emerald-500" />
                {isSidebarExpanded && <span>Practice</span>}
              </button>

              {/* Tests */}
              <button
                onClick={() => handleTabChange('Tests')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Tests'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Tests"
              >
                <Clipboard className="w-4 h-4 text-rose-500" />
                {isSidebarExpanded && <span>Tests</span>}
              </button>

              {/* AI Tutor */}
              <button
                onClick={() => handleTabChange('Tutor')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Tutor'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="AI Tutor Chat"
              >
                <BrainCircuit className="w-4 h-4 text-orange-500" />
                {isSidebarExpanded && <span>AI Tutor</span>}
              </button>

              {/* Progress Analytics */}
              <button
                onClick={() => handleTabChange('Reports')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Reports'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Progress Analytics"
              >
                <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                {isSidebarExpanded && <span>Progress</span>}
              </button>

              {/* Settings */}
              <button
                onClick={() => handleTabChange('Settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === 'Settings'
                    ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00]'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                }`}
                title="Settings Panel"
              >
                <SettingsIcon className="w-4 h-4 text-slate-500" />
                {isSidebarExpanded && <span>Settings</span>}
              </button>
            </>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-transparent text-rose-400 hover:bg-[#FF6B00]/5 hover:text-rose-300"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            {isSidebarExpanded && <span>Log Out</span>}
          </button>

        </nav>

        {/* User parameters widget card */}
        {isSidebarExpanded && currentUser?.role === 'student' && (
          <div className="p-4 border-t border-[#1B2A4A] m-4 bg-[#111C3D] rounded-2xl border border-[#20315F] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Board Readiness</span>
              <span className="font-mono font-black text-[#FF6B00]">{stats.pucReadinessLevel}%</span>
            </div>
            <div className="w-full bg-[#070C1E] rounded-full h-1.5 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] h-full rounded-full" style={{ width: `${stats.pucReadinessLevel}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 italic block leading-normal font-semibold">Verified using NCERT standards.</span>
          </div>
        )}
      </aside>

      {/* Main interface stack */}
      <div className="flex-1 flex flex-col min-w-0" id="canvas-wrapper">
        
        {/* Top Navbar */}
        <header className="px-6 py-3.5 bg-white/95 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between" id="portal-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-slate-605 hover:bg-slate-100 rounded-lg lg:hidden"
              id="mobile-nav-toggle"
            >
              <Menu className="w-6 h-6 animate-pulse" />
            </button>
            
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <RevaLogo size={32} variant="compact" />
              <div className="flex flex-col text-left">
                <span className="font-black text-[11px] tracking-tight text-slate-900 leading-none">TIM PHYSICS</span>
                <span className="text-[8px] font-bold text-[#FF6B00] leading-none uppercase mt-0.5">Physics Tutor</span>
              </div>
            </div>
            
            {/* Desktop Active Model Badge */}
            <div className="hidden lg:flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-semibold select-none">
                Syllabus: <b className="text-[#FF6B00]">NCERT 11 Physics</b>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-900 text-white font-mono font-bold select-none border border-slate-805">
                Model: <b className="text-orange-400 font-bold">{activeModelName}</b>
              </span>
            </div>
          </div>

          {/* Session points display */}
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-[#FF6B00] border border-orange-500/20 text-xs font-black tracking-wide font-mono select-none shadow-sm">
              🏆 {scorePoints} Simulation PTS
            </span>
          </div>
        </header>

        {/* Mobile menu viewport */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex lg:hidden animate-fade-in" id="mobile-sidebar-layer">
            <div className="w-64 bg-[#0B1329] border-r border-[#1B2A4A] p-5 flex flex-col justify-between overflow-y-auto text-slate-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RevaLogo size={36} variant="compact" />
                    <div>
                      <span className="font-extrabold text-[12px] tracking-wider text-white block leading-none">TIM PHYSICS</span>
                      <span className="text-[8px] font-bold text-[#FF6B00] block uppercase mt-0.5 leading-none">Physics Tutor</span>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { name: 'Home', label: '🏠 Dashboard', roles: ['student'] },
                    { name: 'Chapters', label: '📘 Chapters', roles: ['student'] },
                    { name: 'PDFs', label: '📄 PDF Notes', roles: ['student'] },
                    { name: 'Video Tutorials', label: '🎥 Videos', roles: ['student'] },
                    { name: 'FormulaSheet', label: '📐 Formula Sheet', roles: ['student'] },
                    { name: 'SummaryNotes', label: '📝 Summary Notes', roles: ['student'] },
                    { name: 'VirtualLab', label: '🧪 Virtual Lab', roles: ['student'] },
                    { name: 'Practice', label: '📝 Practice Hub', roles: ['student'] },
                    { name: 'Tests', label: '📋 Tests', roles: ['student'] },
                    { name: 'Tutor', label: '🤖 AI Tutor', roles: ['student'] },
                    { name: 'Reports', label: '📊 Progress Analytics', roles: ['student'] },
                    { name: 'TeacherPanel', label: '👨🏫 Teacher Panel', roles: ['admin'] },
                    { name: 'Settings', label: '⚙️ Settings', roles: ['student', 'admin'] }
                  ]
                  .filter((item) => item.roles.includes(currentUser?.role || 'student'))
                  .map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleTabChange(item.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer border ${
                          isActive
                            ? 'bg-orange-500/10 text-white border-l-4 border-[#FF6B00] border-t-transparent border-b-transparent border-r-transparent bg-orange-50'
                            : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-454 border border-transparent hover:bg-slate-900 hover:text-white transition-all cursor-pointer mt-2"
                  >
                    <span>🚪 Log Out</span>
                  </button>
                </nav>
              </div>

              {currentUser?.role === 'student' && (
                <div className="p-3.5 bg-[#111C3D] border border-[#20315F] rounded-xl space-y-1 mt-4">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <span>Readiness:</span>
                    <span className="font-extrabold text-[#FF6B00]">{stats.pucReadinessLevel}%</span>
                  </div>
                  <div className="w-full bg-[#070C1E] rounded-full h-1">
                    <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: `${stats.pucReadinessLevel}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Content Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto" id="portal-content-canvas">
          {activeTab !== 'Home' && (
            <BackButton onClick={handleBack} />
          )}

          {activeTab === 'Home' && (
            <HomeDashboard 
              onNavigate={handleTabChange} 
              stats={stats} 
              username={username}
              studentId={studentId}
              streakCount={streakCount}
            />
          )}

          {activeTab === 'Chapters' && (
            <ChaptersIndex 
              onNavigateToGrader={handleNavigateToGrader} 
              onAddScore={awardScorePoints}
              onAddReport={handleAddReport}
              onNavigateToTab={handleTabChange}
            />
          )}

          {activeTab === 'PDFs' && <PDFs />}
          {activeTab === 'Video Tutorials' && <VideoTutorials />}
          {activeTab === 'FormulaSheet' && <FormulaSheet />}
          {activeTab === 'SummaryNotes' && <SummaryNotes />}
          {activeTab === 'VirtualLab' && <VirtualLab />}
          
          {activeTab === 'Practice' && (
            <Practice onAddScore={awardScorePoints} />
          )}

          {activeTab === 'Tests' && (
            <Tests onAddReport={handleAddReport} examHistory={examHistory} />
          )}

          {activeTab === 'Tutor' && <AskTutor onAddScore={awardScorePoints} />}
          
          {activeTab === 'Reports' && (
            <PerformanceReport stats={stats} streakCount={streakCount} />
          )}

          {activeTab === 'TeacherPanel' && <TeacherPanel />}
          
          {activeTab === 'Settings' && (
            <Settings 
              username={username} 
              studentId={studentId} 
              onUpdateProfile={(name, roll) => {
                if (currentUser) {
                  setCurrentUser({
                    ...currentUser,
                    name,
                    rollNumber: roll
                  });
                }
              }}
              onResetProgress={() => { 
                setScorePoints(35); 
                setStats({ 
                  chaptersEvaluated: 1, 
                  pucTotalSimulationScore: 35, 
                  pucReadinessLevel: 68, 
                  strongTopics: [], 
                  weakTopics: [], 
                  overallBloomScores: { 
                    Remember: { current: 15, total: 20 }, 
                    Understand: { current: 10, total: 20 }, 
                    Apply: { current: 5, total: 15 }, 
                    Analyze: { current: 3, total: 10 }, 
                    Evaluate: { current: 2, total: 10 } 
                  } 
                }); 
                setExamHistory([]); 
              }} 
            />
          )}

          {activeTab === 'Written Exam' && <WrittenExam onAddReport={handleAddReport} />}
          {activeTab === 'MCQ Test' && <MCQTest onAddScore={awardScorePoints} />}
          
          {activeTab === 'Answer Test' && (
            <AnswerEvaluator 
              initialQuestion={graderPresetQuestion}
              initialRubric={graderPresetRubric}
              initialMarks={graderPresetMarks}
              onClearInitialPreset={clearGraderPreset}
              onAddScore={awardScorePoints}
            />
          )}
        </main>

        {/* Floating AI voice assistant orb */}
        {activeTab !== 'AI Voice Lounge' && (
          <VoiceAssistantOrb 
            onNavigate={handleTabChange} 
            activeTab={activeTab} 
            onAddScore={awardScorePoints} 
            layoutMode="floating"
          />
        )}
      </div>
    </div>
  );
}
