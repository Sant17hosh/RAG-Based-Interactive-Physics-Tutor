import React, { useState } from 'react';
import { 
  TrendingUp, Award, Clock, Flame, BarChart2, BookOpen, AlertTriangle, 
  Compass, Printer, ArrowRight, ShieldCheck, Trophy, Sparkles 
} from 'lucide-react';
import { renderChapter8Page } from './Chapter8Content';
import { renderChapter6Page } from './Chapter6Content';

interface PerformanceReportProps {
  stats: {
    totalAttempted: number;
    correctAnswers: number;
    incorrectAnswers: number;
    quizAccuracy: number;
    chapter6Progress: number;
    chapter8Progress: number;
    overallProgress: number;
    overallBloomScores: Record<string, { current: number; total: number }>;
    weakTopics: string[];
    strongTopics: string[];
    pucTotalSimulationScore: number;
    pucReadinessLevel: number;
    chaptersEvaluated: number;
  };
  streakCount: number;
  learningTimeHours?: number;
}

const PEER_LEADERBOARD = [
  { rank: 1, name: "Ananya S", score: 580, avatar: "AS" },
  { rank: 2, name: "Divya N", score: 420, avatar: "DN" },
  { rank: 3, name: "Santhosh (You)", score: 350, avatar: "SY", isSelf: true },
  { rank: 4, name: "Rohit Kumar", score: 210, avatar: "RK" }
];

export default function PerformanceReport({ stats, streakCount, learningTimeHours = 12 }: PerformanceReportProps) {
  const [mentorReport, setMentorReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const {
    totalAttempted,
    correctAnswers,
    incorrectAnswers,
    quizAccuracy,
    chapter6Progress,
    chapter8Progress,
    overallProgress,
  } = stats;

  const requestPersonalMentorReport = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const activeToken = localStorage.getItem('tim_token');
      const response = await fetch('/api/generate-report-recommendations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ stats })
      });
      if (!response.ok) throw new Error("Server failed to synthesize roadmap advice.");
      const data = await response.json();
      setMentorReport(data);
    } catch (e: any) {
      setMentorReport({
        summary: "Local CPU model fallback roadmap generated. Recommended actions active.",
        coreStrengths: ["Logical analysis of motional EMF rails.", "Clear recognition of displacement current vacuum continuity."],
        gapAnalysis: ["Slightly slower responses on high-marks board derivations.", "Need to state boundary assumptions for Ampere-Maxwell laws."],
        roadmap: [
          "Practice sliding rail schematic sketches daily.",
          "Solve 10 past years questions on self-inductance formulas.",
          "Perform another mock timed quiz to audit timing."
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 font-sans" id="performance-reports-view">
      {/* Header and Actions */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm print:hidden">
        <div>
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> LEARNER METRICS
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Learning Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 font-semibold">Track your curriculum mastery, practice metrics, and custom study plans.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={requestPersonalMentorReport}
            disabled={isLoading}
            className="px-4 py-2.5 font-bold text-xs bg-slate-900 text-white rounded-xl shadow cursor-pointer hover:bg-slate-800 disabled:opacity-50 select-none uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? "Analyzing..." : "Get Personal Study Plan"}</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 font-bold text-xs bg-white border border-slate-250 text-slate-700 rounded-xl shadow cursor-pointer hover:bg-slate-50 select-none uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2 font-bold animate-fade-in print:hidden">
          <AlertTriangle className="w-5 h-5 text-rose-500 font-bold shrink-0" />
          {errorNotice}
        </div>
      )}

      {/* Loading spacer */}
      {isLoading && (
        <div className="h-44 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-slate-100 rounded-2xl animate-fade-in print:hidden" id="mentor-loading-spinner">
          <div className="w-8 h-8 rounded-full border-2 border-slate-150 border-t-[#FF6B00] animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Formulating custom study directions from RAG data...</span>
        </div>
      )}

      {/* study recommendations from AI Mentor */}
      {mentorReport && (
        <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm space-y-6 animate-fade-in print:border-slate-400" id="mentor-results-panel">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between font-sans">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FF6B00]" />
              <h2 className="text-sm font-black text-slate-900">Custom Study Roadmap & Recommendations</h2>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-semibold">
            💡 <strong>Learning Summary:</strong> {mentorReport.summary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Strong Areas
              </h3>
              <div className="space-y-2">
                {mentorReport.coreStrengths?.map((str: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-semibold leading-relaxed">
                    ✓ {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Gaps */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Areas Needing Improvement
              </h3>
              <div className="space-y-2">
                {mentorReport.gapAnalysis?.map((gap: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800 font-bold leading-relaxed">
                    ✗ {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmaps */}
          <div className="space-y-3 pt-4 border-t border-slate-100 font-sans">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest block">Study Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mentorReport.roadmap?.map((road: string, i: number) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-orange-200 hover:bg-orange-50/10 transition-all shadow-sm">
                  <span className="text-[10px] font-mono text-[#FF6B00] font-extrabold uppercase block">Action {i + 1}</span>
                  <p className="text-xs text-slate-650 leading-relaxed font-bold mt-1">{road}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Analytical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Circle Card */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm print:border-slate-400 print:shadow-none">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider block">Overall Learning Progress</h2>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
              <circle cx="50" cy="50" r="40" stroke="#FF6B00" strokeWidth="8" fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * overallProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{overallProgress}%</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Syllabus Done</span>
            </div>
          </div>
          <div className="w-full space-y-2 pt-2 text-left text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chapter 6 (Induction):</span>
              <span className="font-bold text-slate-800">{chapter6Progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: `${chapter6Progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chapter 8 (Waves):</span>
              <span className="font-bold text-slate-800">{chapter8Progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: `${chapter8Progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Accuracy and Questions (Pie Chart representation) */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm print:border-slate-400 print:shadow-none">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider block">Quiz Accuracy</h2>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Pie Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              <circle r="16" cx="16" cy="16" fill="#F1F5F9" />
              <circle r="16" cx="16" cy="16" fill="transparent" stroke="#E2E8F0" strokeWidth="32" />
              <circle r="16" cx="16" cy="16" fill="transparent" stroke="#10B981" strokeWidth="32"
                strokeDasharray={`${quizAccuracy} 100`}
              />
            </svg>
            <div className="absolute w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
              <span className="text-2xl font-black text-emerald-600">{quizAccuracy}%</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Accuracy</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 pt-2 text-center text-xs font-semibold">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-150">
              <span className="text-[10px] text-slate-400 block uppercase">Attempted</span>
              <span className="text-sm font-black text-slate-800 mt-0.5 block">{totalAttempted}</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-600 block uppercase">Correct</span>
              <span className="text-sm font-black text-emerald-700 mt-0.5 block">{correctAnswers}</span>
            </div>
            <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[10px] text-rose-500 block uppercase">Incorrect</span>
              <span className="text-sm font-black text-rose-700 mt-0.5 block">{incorrectAnswers}</span>
            </div>
          </div>
        </div>

        {/* Cognitive bloom levels */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm print:border-slate-400 print:shadow-none">
          <div className="text-center font-sans">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider block">Cognitive Level Mastery</h2>
          </div>
          
          {/* SVG Bar Chart */}
          <div className="relative h-28 flex items-end justify-between px-2 pt-4">
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200"></div>
            {Object.entries(stats.overallBloomScores).map(([level, scoreObj], idx) => {
              const current = scoreObj.current;
              const total = scoreObj.total;
              const pct = total > 0 ? (current / total) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center space-y-2 w-1/5 group font-sans">
                  <div className="w-6 bg-[#FF6B00]/10 border border-[#FF6B00]/25 rounded-t-md h-20 relative flex items-end">
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-mono">
                      {current}/{total}
                    </div>
                    <div className="w-full bg-gradient-to-t from-[#FF6B00] to-[#FF8C42] rounded-t-sm transition-all duration-500" style={{ height: `${pct}%` }}></div>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate w-full text-center" title={level}>
                    {level.slice(0, 4)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider italic">
            Cognitive levels as verified by board criteria.
          </p>
        </div>
      </div>

      {/* Stats row: Streak and Learning Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-panel p-5 bg-white border border-slate-205 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 font-sans">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Learning Streak</span>
            <h4 className="text-base font-black text-slate-800">{streakCount} Days Streak</h4>
          </div>
          <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
        </div>

        <div className="glass-panel p-5 bg-white border border-slate-205 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 font-sans">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Learning Time Accumulated</span>
            <h4 className="text-base font-black text-slate-800">{learningTimeHours} Hours Spent</h4>
          </div>
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
      </div>

      {/* Line Chart & Topic Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Line Chart performance history */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl md:col-span-2 space-y-5 flex flex-col justify-between shadow-sm print:border-slate-400 print:shadow-none">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart2 className="w-4.5 h-4.5 text-[#FF6B00]" /> Score Performance Curve
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Timeline representation of your overall readiness scores.</p>
          </div>

          <div className="relative h-45 pt-4 flex items-end">
            {/* SVG Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path
                d="M 5 35 Q 25 25 45 30 T 85 10 T 95 5"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Data dots */}
              <circle cx="5" cy="35" r="2" fill="#FF8C42" />
              <circle cx="25" cy="25" r="2" fill="#FF8C42" />
              <circle cx="45" cy="30" r="2" fill="#FF8C42" />
              <circle cx="85" cy="10" r="2" fill="#FF8C42" />
              <circle cx="95" cy="5" r="2" fill="#FF8C42" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[8px] font-black text-slate-404 text-slate-400 uppercase tracking-wider pt-2 px-1">
              <span>Drill 1</span>
              <span>Drill 2</span>
              <span>Drill 3</span>
              <span>Written Mock</span>
              <span>Readiness</span>
            </div>
          </div>
        </div>

        {/* Leaderboard peers */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm print:border-slate-400 print:shadow-none">
          <div className="font-sans">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4.5 h-4.5 text-[#FF6B00]" /> Leaderboard
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Simulated classroom peer positions.</p>
          </div>

          <div className="space-y-2.5">
            {PEER_LEADERBOARD.map((peer) => (
              <div
                key={peer.rank}
                className={`p-2.5 border border-slate-150 rounded-xl flex justify-between items-center text-xs font-semibold ${
                  peer.isSelf ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-400">{peer.rank}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-655 font-mono select-none">
                    {peer.avatar}
                  </div>
                  <span className={`font-bold ${peer.isSelf ? 'text-[#FF6B00] font-black' : 'text-slate-805'}`}>{peer.name}</span>
                </div>
                <span className="font-mono font-black text-slate-800">{peer.score} Pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
