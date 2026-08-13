import React from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { BookOpen, Award, CheckCircle, BrainCircuit, ShieldCheck, Flame, GraduationCap, ArrowRight, Star, Clock, AlertTriangle } from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (page: string) => void;
  stats: {
    chaptersEvaluated: number;
    pucTotalSimulationScore: number;
    pucReadinessLevel: number;
    weakTopics: string[];
    strongTopics: string[];
  };
  username: string;
  studentId: string;
  streakCount: number;
}

export default function HomeDashboard({ onNavigate, stats, username, studentId, streakCount }: HomeDashboardProps) {
  const recentChapterId = Number(localStorage.getItem('tim_recent_chapter') || '1');
  const recentChapter = CHANNELS_PUC_DATA.find(c => c.id === recentChapterId) || CHANNELS_PUC_DATA[0];

  const studentName = username.split("@")[0] || 'Student';

  return (
    <div className="space-y-6 animate-fade-in text-slate-800" id="dashboard-container">
      {/* Welcome Student Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] text-white p-6 md:p-8 shadow-xl border border-orange-500/10" id="hero-banner">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-2xl -ml-25 -mb-25 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5" /> Class 11 Board Prep Platform
            </span>
            <h1 className="text-2xl md:text-4.5xl font-black tracking-tight text-white leading-tight">
              Welcome, {studentName}!
            </h1>
            <p className="text-xs md:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
              Verify formulas, solve board assessments, or start RAG sessions with your AI Physics Tutor. Roll: <code className="bg-orange-850 bg-[#c2410c] px-2 py-0.5 rounded text-orange-200 font-mono text-[10px] font-black">{studentId}</code>
            </p>
          </div>

          {/* Streak indicator */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full justify-between md:w-auto shrink-0 select-none">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-orange-200 uppercase leading-none">Learning Streak</span>
              <span className="text-lg font-black text-white mt-1 leading-none">{streakCount} Days Streak</span>
            </div>
            <Flame className="w-8 h-8 text-amber-300 fill-amber-300 animate-pulse shrink-0" />
          </div>
        </div>
      </div>

      {/* Main LMS Dashboard Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: continue learning, streaks, goal */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Continue Learning card */}
          <div className="glass-panel p-5 bg-white border border-slate-205 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded border border-orange-100 font-mono">Recently Opened Chapter</span>
              <h3 className="text-base font-black text-slate-805 text-slate-850 mt-2">{recentChapter.name}</h3>
              <p className="text-[11.5px] text-slate-450 font-semibold leading-relaxed mt-0.5">{recentChapter.description.slice(0, 100)}...</p>
            </div>
            <button
              onClick={() => onNavigate('Learning-Chapters')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 shrink-0 cursor-pointer select-none flex items-center gap-1"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* today's goal & next activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-1.5 leading-none">
                <Clock className="w-4 h-4 text-orange-550 text-orange-500" /> Today's Goal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Read electromagnetic wave propagation parameters and complete a 5-question timed mock quiz.
              </p>
              <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block font-mono leading-none">
                Goal Reward: +15 PTS
              </div>
            </div>

            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-1.5 leading-none">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" /> Recommended Action
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Draft answers for standard CBSE written questions in Chapter 1 to secure step marks.
              </p>
              <button
                onClick={() => onNavigate('Practice')}
                className="text-xs font-black text-orange-605 text-[#FF6B00] hover:text-orange-705 uppercase tracking-wide cursor-pointer leading-none flex items-center gap-0.5 mt-1"
              >
                Start Practice &rarr;
              </button>
            </div>

          </div>

          {/* Board weightage & blueprint catalog */}
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-none">Board weightage blueprints</h3>
                <p className="text-[10px] text-slate-450 mt-1 font-bold">Class 11 Pre-University final physics examinations weights.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHANNELS_PUC_DATA.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => onNavigate('Learning-Chapters')}
                  className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 hover:border-orange-200 hover:bg-orange-50/5 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 font-mono">CH {ch.id}</span>
                    <h4 className="text-xs font-black text-slate-800">{ch.name.split(" ")[0]}</h4>
                  </div>
                  <span className="text-[10px] bg-orange-50 border border-orange-100 text-[#FF6B00] px-2 py-0.5 rounded font-mono font-black">{ch.weightage}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: analytics metrics, weak subjects */}
        <div className="space-y-6">
          
          {/* Quick analytic gauges */}
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b pb-1.5 leading-none">Academic Scorecard</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Board Readiness:</span>
                <span className="font-mono font-black text-orange-605 text-orange-600">{stats.pucReadinessLevel}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] h-full rounded-full transition-all duration-300" style={{ width: `${stats.pucReadinessLevel}%` }}></div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Total Score:</span>
                <span className="font-mono font-black text-slate-800">{stats.pucTotalSimulationScore} Pts</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Syllabus Chapters:</span>
                <span className="font-mono font-black text-slate-800">{stats.chaptersEvaluated} / {CHANNELS_PUC_DATA.length} Complete</span>
              </div>
            </div>
          </div>

          {/* Weak Topics warnings */}
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b pb-1.5 flex items-center gap-1.5 leading-none">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Focus Topics
            </h3>

            <div className="space-y-2">
              {stats.weakTopics.slice(0, 3).map((topic, idx) => (
                <div key={idx} className="p-2 bg-rose-50/50 border border-rose-100 rounded-xl text-[11px] font-semibold text-rose-700 flex gap-1.5 items-start leading-snug">
                  <span className="shrink-0 select-none font-bold">•</span>
                  <span>{topic}</span>
                </div>
              ))}
              {stats.weakTopics.length === 0 && (
                <div className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center font-bold">
                  No weak topics identified! Excellent progress.
                </div>
              )}
            </div>
          </div>

          {/* Recent AI conversation card link */}
          <div className="glass-panel p-5 bg-slate-90 bg-slate-900 text-white rounded-2xl space-y-2 shadow-sm relative overflow-hidden select-none cursor-pointer" onClick={() => onNavigate('AI-Tutor')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl"></div>
            <span className="text-[8px] font-black tracking-widest text-[#FF6B00] uppercase block leading-none">TIM CO-PILOT</span>
            <h4 className="text-xs font-black flex items-center gap-1.5 mt-1 leading-none">
              <BrainCircuit className="w-4.5 h-4.5 text-[#FF6B00] animate-pulse" /> Ask Physics Tutor
            </h4>
            <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold font-sans mt-1">
              Have an open chat or transcribe speech equations instantly using RAG knowledge.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
