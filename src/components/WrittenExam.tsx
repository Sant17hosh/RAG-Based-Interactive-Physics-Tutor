import React, { useState, useEffect } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { Question, Exam, ExamReport } from '../types';
import { Timer, ClipboardCheck, BookOpen, AlertTriangle, ArrowRight, BrainCircuit, RotateCcw, Award, Star } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

interface WrittenExamProps {
  onAddReport: (report: ExamReport) => void;
}

export default function WrittenExam({ onAddReport }: WrittenExamProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(CHANNELS_PUC_DATA[0].id); // Default to first available chapter (Electromagnetic Waves)
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [report, setReport] = useState<ExamReport | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Timer Tick implementation
  useEffect(() => {
    if (!isExamActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamActive, timeLeft]);

  const handleStartExam = async () => {
    setIsExamActive(false);
    setReport(null);
    setErrorNotice(null);
    setAnswers({});
    setIsSubmitting(true);

    try {
      const activeToken = localStorage.getItem('tim_token');
      const resp = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ chapterId: Number(selectedChapterId) })
      });

      if (!resp.ok) throw new Error("Could not initialize dynamic exam set.");
      const data = await resp.json();
      
      setExam({
        id: data.examId,
        chapterId: data.chapterId,
        chapterName: data.chapterName,
        questions: data.questions,
        durationMinutes: data.durationMinutes
      });

      setTimeLeft(data.durationMinutes * 60);
      setIsExamActive(true);
    } catch (e: any) {
      setErrorNotice(e.message || "Problem with Express endpoint when building question sheets.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleAutoSubmit = () => {
    console.log("⌛ Exam Time Limit Expired! Submitting answers automatically.");
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    setIsSubmitting(true);
    setIsExamActive(false);

    const submissionPayload = {
      examId: exam.id,
      chapterName: exam.chapterName,
      questions: exam.questions,
      answers: answers,
      timeSpentSeconds: exam.durationMinutes * 60 - timeLeft
    };

    try {
      const activeToken = localStorage.getItem('tim_token');
      const resp = await fetch('/api/evaluate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ submission: submissionPayload })
      });

      if (!resp.ok) throw new Error("Mark sheets evaluation failed.");
      const evaluationReport: ExamReport = await resp.json();
      
      setReport(evaluationReport);
      onAddReport(evaluationReport); // Add to global state for Reports tab
    } catch (err: any) {
      setErrorNotice(err.message || "Grade submission pipeline failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert seconds to clean clock string
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="written-exam-container">
      {/* Parameter picker row */}
      {!isExamActive && !report && (
        <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6" id="exam-dashboard-config">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-xl font-black text-slate-900">1st PUC Board Revision Simulator</h1>
            <p className="text-xs text-slate-500 font-semibold">Practice questions aligning with Department of Pre-University Education marks schema.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto shrink-0 animate-fade-in">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(Number(e.target.value))}
              className="px-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none focus:border-[#FF6B00] font-bold"
            >
              {CHANNELS_PUC_DATA.map(c => (
                <option key={c.id} value={c.id} className="bg-white text-slate-850">Ch {c.id}: {c.name}</option>
              ))}
            </select>

            <button
              onClick={handleStartExam}
              disabled={isSubmitting}
              className="px-6 py-2.5 font-bold text-xs md:text-sm bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white hover:brightness-110 disabled:opacity-50 transition-all rounded-xl select-none cursor-pointer shadow-md shadow-orange-500/10 uppercase tracking-wider"
              id="start-exam-sheet-btn"
            >
              {isSubmitting ? "Syllabus Indexing..." : "Launch Board Mock Paper"}
            </button>
          </div>
        </div>
      )}

      {/* Error block */}
      {errorNotice && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2 font-bold animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          {errorNotice}
        </div>
      )}

      {/* Loading overlay spacer */}
      {isSubmitting && !isExamActive && (
        <div className="h-44 flex flex-col items-center justify-center text-center space-y-4 glass-panel bg-white/60" id="exam-loading-spinner">
          <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-[#FF6B00] animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Drafting authentic questions & DPUE rubrics, please hold...</span>
        </div>
      )}

      {/* Active Exam Canvas */}
      {isExamActive && exam && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="exams-active-layout">
          {/* Question List textareas */}
          <div className="lg:col-span-3 glass-panel p-6 space-y-6">
            <div className="pb-4 border-b border-slate-150 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karnataka Pre-University Mock Revision</span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">Chapter: {exam.chapterName}</h2>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded bg-orange-50 border border-orange-100 text-[#FF6B00]">Max marks: 10 Pts</span>
            </div>

            <div className="space-y-6" id="exam-questions-forms">
              {exam.questions.map((q, idx) => (
                <div key={q.id} className="space-y-2.5">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00]">QUESTION {idx + 1} &bull; {q.marks} Marks ({q.bloomLevel})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-sm font-black text-slate-800 leading-tight">{q.questionText}</h3>
                    <div className="shrink-0">
                      <VoiceInputButton 
                        onTranscript={(val) => handleTextChange(q.id, val)}
                        currentValue={answers[q.id] || ''}
                        id={`voice-input-exam-${q.id}`}
                        label="Voice Answer"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    placeholder="Enter mathematical steps, state related equations, and express final quantities in standard SI units..."
                    className="w-full p-4 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#FF6B00] focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                  {/* Score rubric guidelines */}
                  <div className="p-3 bg-orange-50/55 rounded-xl border border-orange-100 text-xs text-slate-600">
                    <span className="font-extrabold text-[#FF6B00] block mb-1">Board Evaluation Benchmark Notes:</span>
                    <ul className="list-disc pl-4 space-y-0.5 font-semibold">
                      {q.rubric.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-6 py-2.5 font-bold text-xs md:text-sm bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white hover:brightness-110 rounded-xl select-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/10 border border-transparent uppercase tracking-wider"
                id="submit-answersheet-btn"
              >
                {isSubmitting ? "Marking Scripts..." : "Hand in Answer Sheet"} <ClipboardCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clock floating panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel p-5 text-center space-y-4">
              <div className="flex justify-center text-[#FF6B00]">
                <Timer className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulation Timer</span>
                <span className="text-3xl font-black text-[#FF6B00] block tracking-wider mt-1 font-mono">{formatTime(timeLeft)}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Answering is open book. To secure maximum marks, follow formulas exactly, declare system constants, and include SI metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Report Panel */}
      {!isExamActive && report && (
        <div className="space-y-8 animate-fade-in" id="evaluation-report-view">
          {/* Header block with statistics */}
          <div className="glass-panel p-7 flex flex-col md:flex-row justify-between items-center gap-6" id="report-top-grade-card">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Official Board Moderation Result</span>
              <h1 className="text-2xl font-black text-slate-900">Revise Mock Result: <span className="text-[#FF6B00]">{exam?.chapterName}</span></h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl font-semibold italic">"{report.overallFeedback}"</p>
            </div>

            <div className="flex gap-4 shrink-0 text-center select-none font-sans">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold">Board Grade</span>
                <span className="text-xl font-black text-slate-900 mt-1 block font-mono">{report.performanceGrade}</span>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-[#FF6B00]">
                <span className="text-[10px] font-mono font-bold text-[#FF6B00] uppercase tracking-widest block">Session Score</span>
                <span className="text-xl font-black text-[#FF6B00] mt-1 block font-mono">{report.totalScore} / {report.totalMarksPossible} Pts</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question Breakdown Details */}
            <div className="lg:col-span-2 space-y-6" id="reports-questions-index">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#FF6B00]" /> Moderated Assessment Script
              </h2>

              {report.evaluations.map((evalQ, i) => (
                <div key={evalQ.questionId || i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-black text-[#FF6B00] block tracking-wide">Question {i + 1} &bull; {evalQ.bloomLevel} Competency</span>
                      <h3 className="text-sm font-black text-slate-800 leading-relaxed mt-1">{evalQ.questionText}</h3>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-orange-50 border border-orange-100 text-[#FF6B00] block shrink-0 font-mono">
                      Score: <b className="text-[#FF6B00] font-black">{evalQ.scoreAwarded}</b> / {evalQ.marks}
                    </span>
                  </div>

                  {/* Feedback Details */}
                  <div className="text-xs text-slate-705 text-slate-700 leading-relaxed font-semibold">
                    💡 <b>Evaluator comment:</b> {evalQ.feedback}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths list */}
                    {evalQ.strengths && evalQ.strengths.length > 0 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                        <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block">Strengths Observed:</span>
                        {evalQ.strengths.map((s, idx) => (
                          <div key={idx} className="text-xs text-emerald-700 font-bold flex gap-1 items-start">
                            <span className="text-emerald-555 text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Missed gaps list */}
                    {evalQ.weaknesses && evalQ.weaknesses.length > 0 && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                        <span className="text-[9px] font-black uppercase text-rose-800 tracking-wider block">Missed Gaps:</span>
                        {evalQ.weaknesses.map((w, idx) => (
                          <div key={idx} className="text-xs text-rose-700 font-bold flex gap-1 items-start">
                            <span className="text-rose-500 font-bold shrink-0">✗</span>
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Board Tips */}
                  {evalQ.boardExamTips && evalQ.boardExamTips.length > 0 && (
                    <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Karnataka Board Success secret:</span>
                      {evalQ.boardExamTips.map((tip, idx) => (
                        <div key={idx} className="text-xs text-amber-900 font-semibold leading-relaxed">
                          • {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Side taxonomy status & roadmap list */}
            <div className="lg:col-span-1 space-y-6" id="reports-sidebar-widgets">
              {/* Responsive SVG radial chart for Bloom's performance */}
              <div className="glass-panel p-5 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold">Bloom Taxonomy Distribution</span>
                
                <div className="flex justify-center py-2">
                  <svg width="150" height="150" viewBox="0 0 36 36" className="w-28 h-28 shrink-0">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FF6B00] drop-shadow-md"
                      strokeDasharray={`${(report.totalScore / report.totalMarksPossible) * 100}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="fill-slate-800 font-extrabold font-sans text-center" textAnchor="middle" fontSize="6px">
                      {Math.round((report.totalScore / report.totalMarksPossible) * 100)}%
                    </text>
                  </svg>
                </div>
                
                <div className="space-y-2 mt-2 border-t border-slate-100 pt-2">
                  {report.bloomTaxonomyAnalysis.map((b, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">{b.level}</span>
                      <span className="text-slate-800 font-black">{b.score} / {b.maxScore} Pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remedial roadmap */}
              <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <BrainCircuit className="w-5 h-5 text-[#FF6B00]" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Study Roadmap Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {report.remedialRoadmap.map((road, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-600 leading-relaxed font-bold shadow-inner">
                      {idx + 1}. {road}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset controls */}
              <button
                onClick={() => {
                  setReport(null);
                  setAnswers({});
                }}
                className="w-full py-3 font-semibold text-xs border border-slate-200 hover:border-[#FF6B00] hover:bg-orange-50 text-slate-700 hover:text-[#FF6B00] rounded-xl transition-all cursor-pointer block text-center flex items-center justify-center gap-1 bg-white select-none shadow-sm"
              >
                <RotateCcw className="w-4 h-4 text-[#FF6B00]" /> Reset Mock Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
