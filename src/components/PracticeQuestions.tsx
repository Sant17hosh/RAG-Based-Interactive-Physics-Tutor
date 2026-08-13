import React, { useState } from 'react';
import { PracticeQuestion } from '../services/recommendationService';
import { HelpCircle, Check, X, Eye, FileText, Calculator, Award } from 'lucide-react';

interface PracticeQuestionsProps {
  questions: PracticeQuestion[];
  onAddScore?: (points: number) => void;
}

export default function PracticeQuestions({ questions, onAddScore }: PracticeQuestionsProps) {
  // Store answered MCQ states: { questionIndex: selectedOptionIndex }
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  // Store revealed answer indices
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-2xl">
        No practice questions generated.
      </div>
    );
  }

  const handleMCQSelect = (questionIndex: number, optionIndex: number, correctIndex: number) => {
    if (mcqAnswers[questionIndex] !== undefined) return; // Answered already

    setMcqAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));

    if (optionIndex === correctIndex && onAddScore) {
      onAddScore(5); // Award 5 points for correct MCQ answer
    }
  };

  const toggleReveal = (index: number) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Group questions by type to present them beautifully
  const mcqs = questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter(q => q.type === 'mcq');
  const shortAnswers = questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter(q => q.type === 'short');
  const numericals = questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter(q => q.type === 'numerical');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <HelpCircle className="w-5 h-5 text-[#FF6B00]" />
        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Practice & Self-Assessment</h3>
      </div>

      {/* MCQs Section */}
      {mcqs.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-orange-500" />
            <span>Multiple Choice Questions (5 PTS each)</span>
          </h4>
          
          <div className="grid grid-cols-1 gap-4" id="practice-mcqs-list">
            {mcqs.map((q, idx) => {
              const selectedOpt = mcqAnswers[q.originalIndex];
              const isCorrect = selectedOpt === q.correctIndex;
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div key={idx} className="glass-panel p-5 bg-white border-slate-100 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                      MCQ {idx + 1}
                    </span>
                    {hasAnswered && (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-800 leading-normal">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options?.map((option, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrectOpt = optIdx === q.correctIndex;
                      
                      let btnStyle = 'bg-slate-50 hover:bg-slate-100/80 border-slate-100 text-slate-700';
                      if (hasAnswered) {
                        if (isCorrectOpt) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-700 font-extrabold';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleMCQSelect(q.originalIndex, optIdx, q.correctIndex || 0)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                            !hasAnswered ? 'cursor-pointer hover:border-slate-350' : 'cursor-default'
                          } ${btnStyle}`}
                        >
                          <span className="font-black text-[10px] uppercase text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && q.explanation && (
                    <div className="p-3 bg-slate-50 rounded-xl text-[11px] leading-relaxed text-slate-650 font-semibold border border-slate-100 animate-fade-in">
                      <b className="text-slate-800">Explanation:</b> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Short Answer Questions Section */}
      {shortAnswers.length > 0 && (
        <div className="space-y-4 mt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Short Answer Questions</span>
          </h4>

          <div className="grid grid-cols-1 gap-4" id="practice-shorts-list">
            {shortAnswers.map((q, idx) => {
              const isRevealed = revealedAnswers[q.originalIndex];

              return (
                <div key={idx} className="glass-panel p-5 bg-white border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-55 bg-orange-50 text-orange-600 border border-orange-100">
                      Short Answer {idx + 1}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 leading-normal">
                    {q.question}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => toggleReveal(q.originalIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 text-[#FF6B00] text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-4 bg-orange-50/30 border border-orange-100/50 rounded-2xl text-[11px] leading-relaxed text-slate-700 font-semibold italic animate-fade-in">
                      <b className="text-slate-800 block not-italic uppercase text-[9px] tracking-wider mb-1">Model Answer Key Criteria:</b>
                      "{q.modelAnswer || q.explanation}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Numerical Problems Section */}
      {numericals.length > 0 && (
        <div className="space-y-4 mt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-orange-500" />
            <span>Numerical Applications</span>
          </h4>

          <div className="grid grid-cols-1 gap-4" id="practice-numericals-list">
            {numericals.map((q, idx) => {
              const isRevealed = revealedAnswers[q.originalIndex];

              return (
                <div key={idx} className="glass-panel p-5 bg-white border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Numerical Problem
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 leading-normal">
                    {q.question}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => toggleReveal(q.originalIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 text-[#FF6B00] text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Solution' : 'Reveal Formula & Solution'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl text-[11px] leading-relaxed text-slate-700 font-semibold animate-fade-in font-mono">
                      <b className="text-slate-800 block uppercase font-sans text-[9px] tracking-wider mb-1">Step-by-step Solution:</b>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                        {q.solution || q.explanation}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
