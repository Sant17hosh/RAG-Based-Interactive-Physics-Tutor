import React, { useState } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { MCQ } from '../types';
import { Lightbulb, Check, X, Award, Eye, HelpCircle, ArrowRight, RefreshCw, Zap } from 'lucide-react';

interface MCQTestProps {
  onAddScore: (score: number) => void;
}

export default function MCQTest({ onAddScore }: MCQTestProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(CHANNELS_PUC_DATA[0].id); // Default to first available chapter (Electromagnetic Waves)
  const [bloomFilter, setBloomFilter] = useState<string>('All');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isAnsLocked, setIsAnsLocked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const saveMCQAttempt = async (finalCorrectCount: number, questionsCount: number) => {
    try {
      const activeToken = localStorage.getItem('tim_token');
      const chapterName = mcqs[0]?.chapterName || 'Unknown Chapter';
      const percentage = questionsCount > 0 ? Math.round((finalCorrectCount / questionsCount) * 100) : 0;
      const score = finalCorrectCount * 2;

      await fetch('/api/mcq/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          chapter: chapterName,
          totalQuestions: questionsCount,
          correctAnswers: finalCorrectCount,
          score,
          percentage
        })
      });
    } catch (err) {
      console.error("Failed to save MCQ attempt:", err);
    }
  };

  const startMCQTest = async () => {
    setIsLoading(true);
    setErrorText(null);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnsLocked(false);
    setCorrectCount(0);
    setCurrentIndex(0);
    setTestFinished(false);

    try {
      const activeToken = localStorage.getItem('tim_token');
      const resp = await fetch('/api/generate-mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          chapterId: Number(selectedChapterId),
          bloomLevel: bloomFilter === 'All' ? '' : bloomFilter
        })
      });

      if (!resp.ok) throw new Error("MCQ generation failed at server endpoint.");
      const list: MCQ[] = await resp.json();
      
      if (list.length === 0) {
        throw new Error("No physical MCQs returned for selected chapter parameters.");
      }

      setMcqs(list);
    } catch (e: any) {
      setErrorText(e.message || "Failed to parse questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnsLocked) return;
    setSelectedOption(idx);
  };

  const handleLockOption = () => {
    if (isAnsLocked) return;

    const activeMcq = mcqs[currentIndex];
    let isCorrect = false;

    if (activeMcq.type === 'fill_blank') {
      const answerVal = activeMcq.options[0] || '';
      isCorrect = typedAnswer.trim().toLowerCase() === answerVal.toLowerCase();
    } else if (activeMcq.type === 'short_answer') {
      isCorrect = typedAnswer.trim().length > 0;
    } else {
      if (selectedOption === null) return;
      isCorrect = selectedOption === activeMcq.correctIndex;
    }

    setIsAnsLocked(true);
    if (isCorrect) {
      setCorrectCount(prev => {
        const nextCorrect = prev + 1;
        onAddScore(2); // Award points
        return nextCorrect;
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnsLocked(false);
    
    if (currentIndex + 1 < mcqs.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      saveMCQAttempt(correctCount, mcqs.length);
      setTestFinished(true);
    }
  };

  const activeMcq = mcqs[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="mcq-test-container">
      {/* Parameter picker setup */}
      {mcqs.length === 0 && (
        <div className="glass-panel p-6 bg-white space-y-5" id="mcq-test-start-form">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-slate-900">1st PUC Board CET / NEET Quick-Quiz Generator</h1>
              <p className="text-xs text-slate-500 font-semibold">Generate topic customized multiple choice options straight from Class 11 textbooks.</p>
            </div>
            <span className="p-2 border border-orange-100 rounded bg-orange-50 text-[#FF6B00] text-xs font-black uppercase tracking-wider">CET Format</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Syllabus Chapter</label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 focus:border-[#FF6B00] bg-slate-50 text-slate-800 text-xs md:text-sm focus:outline-none font-bold"
              >
                {CHANNELS_PUC_DATA.map(c => (
                  <option key={c.id} value={c.id} className="bg-white text-slate-805">Chapter {c.id}: {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={startMCQTest}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:brightness-110 text-white font-black text-xs md:text-sm disabled:opacity-50 transition-all rounded-xl select-none cursor-pointer flex items-center gap-1.5 shadow shadow-orange-500/10 border border-transparent uppercase tracking-wider"
              id="gen-mcq-button"
            >
              {isLoading ? "Compiling MCQs..." : "Assemble Test Set"} <Zap className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Error block */}
      {errorText && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2 font-bold animate-fade-in">
          <X className="w-5 h-5 text-rose-500 font-bold" />
          {errorText}
        </div>
      )}

      {/* Loading overview */}
      {isLoading && mcqs.length === 0 && (
        <div className="h-44 flex flex-col items-center justify-center text-center space-y-4 glass-panel bg-white/60" id="mcq-loading-spinner">
          <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-[#FF6B00] animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Retrieving NCERT contexts & formulating high-fidelity CET questions...</span>
        </div>
      )}

      {/* MCQ Playing Screen */}
      {mcqs.length > 0 && !testFinished && activeMcq && (
        <div className="glass-panel p-6 bg-white space-y-6" id="mcq-active-panel">
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {mcqs.length}</span>
            <span className="px-3 py-1 bg-orange-50 text-[#FF6B00] border border-orange-100 rounded-full font-black uppercase tracking-wider">CET FORMAT</span>
          </div>

          <h3 className="text-base font-black text-slate-800 leading-relaxed">{activeMcq.question}</h3>

          <div className="space-y-2.5" id="mcq-options-container">
            {activeMcq.type === 'fill_blank' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  disabled={isAnsLocked}
                  className="w-full px-4 py-3 rounded-xl border border-slate-205 focus:border-[#FF6B00] bg-slate-50 text-slate-800 text-xs md:text-sm focus:outline-none font-bold"
                  placeholder="Type the correct term or word here..."
                  id="fill-blank-field"
                />
                {isAnsLocked && (
                  <div className="text-xs font-bold text-slate-500 mt-2">
                    Expected Answer: <span className="text-emerald-600 font-extrabold">{activeMcq.options[0]}</span>
                  </div>
                )}
              </div>
            ) : activeMcq.type === 'short_answer' ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  disabled={isAnsLocked}
                  className="w-full p-4 rounded-xl border border-slate-205 focus:border-[#FF6B00] bg-slate-50 text-slate-800 text-xs md:text-sm focus:outline-none font-bold"
                  placeholder="Draft your explanation here..."
                  id="short-answer-field"
                />
              </div>
            ) : (
              activeMcq.options.map((option, idx) => {
                // Color styles post option locking
                let optStyle = "border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 bg-white shadow-sm";
                if (selectedOption === idx) {
                  optStyle = "border-[#FF6B00] bg-orange-50/50 text-[#FF6B00] font-bold";
                }
                if (isAnsLocked) {
                  if (idx === activeMcq.correctIndex) {
                    optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold";
                  } else if (selectedOption === idx) {
                    optStyle = "border-rose-500 bg-rose-50 text-rose-800 font-bold";
                  } else {
                    optStyle = "border-slate-50 bg-slate-50 text-slate-300 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnsLocked}
                    className={`w-full text-left p-4 rounded-xl border text-sm flex items-center justify-between transition-all select-none cursor-pointer ${optStyle}`}
                  >
                    <span className="font-semibold">{option}</span>
                    <div className="shrink-0 flex items-center justify-center">
                      {isAnsLocked && idx === activeMcq.correctIndex && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isAnsLocked && selectedOption === idx && idx !== activeMcq.correctIndex && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Locked Explanation section */}
          {isAnsLocked && (
            <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/40 text-xs text-slate-705 text-slate-600 leading-relaxed font-semibold animate-fade-in space-y-2">
              <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#FF6B00]" /> NCERT Physics Explanation
              </span>
              <p>{activeMcq.explanation}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-150 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold">Session Score: <b className="text-slate-850 text-[#FF6B00] font-black">{correctCount}</b> correct answers</span>
            
            <div className="flex gap-2 font-sans">
              {!isAnsLocked ? (
                <button
                  onClick={handleLockOption}
                  disabled={
                    activeMcq.type === 'fill_blank' || activeMcq.type === 'short_answer'
                      ? !typedAnswer.trim()
                      : selectedOption === null
                  }
                  className="px-5 py-2 font-black bg-[#FF6B00] text-white hover:brightness-110 rounded-lg disabled:opacity-50 transition-all select-none cursor-pointer text-xs"
                >
                  Verify Option
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 font-black bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white rounded-lg transition-all flex items-center gap-1 select-none cursor-pointer text-xs shadow-md shadow-orange-500/10"
                >
                  {currentIndex + 1 < mcqs.length ? "Continue" : "Finish Test"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finished scoreboard panel */}
      {testFinished && (
        <div className="glass-panel p-8 text-center bg-white space-y-5 animate-fade-in" id="mcq-scorecard-panel">
          <div className="flex justify-center text-[#FF6B00]">
            <Award className="w-16 h-16" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-bold">MCQ Evaluation Final Report</span>
            <h2 className="text-2xl font-black text-slate-900">Quiz Completed</h2>
            <span className="text-4xl font-extrabold text-[#FF6B00] block mt-2 font-mono">{correctCount} <b className="text-base text-slate-400">/ {mcqs.length} Correct</b></span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-semibold">
            Excellent revision! Working rapid-fire multiple choice exams helps solidifies fundamental values of linear acceleration vector formulas, dimensions, and SI indicators.
          </p>

          <div className="flex justify-center gap-3 pt-2 font-sans">
            <button
              onClick={startMCQTest}
              className="px-5 py-2.5 font-bold text-xs bg-slate-50 text-slate-700 border border-slate-200 hover:bg-orange-50 hover:text-[#FF6B00] hover:border-orange-100 transition-all rounded-xl select-none cursor-pointer"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => setMcqs([])}
              className="px-5 py-2.5 font-bold text-xs bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white transition-all rounded-xl select-none cursor-pointer"
            >
              Reset Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
