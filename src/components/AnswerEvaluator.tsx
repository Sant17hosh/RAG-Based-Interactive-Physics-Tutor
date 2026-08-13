import React, { useState } from 'react';
import { Sparkles, FileText, Award, XSquare, AlertCircle, RefreshCw, Star } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

interface AnswerEvaluatorProps {
  initialQuestion?: string;
  initialRubric?: string[];
  initialMarks?: number;
  onClearInitialPreset?: () => void;
  onAddScore: (score: number) => void;
}

export default function AnswerEvaluator({
  initialQuestion = "State static friction and kinetic friction limits. Explain which is greater and why.",
  initialRubric = ["Accurate statement of static friction limit proportional to Normal force [1 mark]", "Statement of kinetic friction [1 mark]", "Explaining static limit is greater than kinetic friction [1 mark]"],
  initialMarks = 3,
  onClearInitialPreset,
  onAddScore
}: AnswerEvaluatorProps) {
  const [questionText, setQuestionText] = useState<string>(initialQuestion);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);

  const samplePrompts = [
    {
      q: "Explain the inconsistency of Ampere's circuital law and define displacement current with its mathematical expression.",
      marks: 3,
      r: ["Explain why Ampere's law is inconsistent for a charging capacitor. [1 mark]", "Define displacement current and state its formula. [1 mark]", "State the unified Ampere-Maxwell law. [1 mark]"]
    },
    {
      q: "State Faraday's laws of electromagnetic induction and derive the expression for motional electromotive force (e = B * v * l).",
      marks: 5,
      r: ["State Faraday's first and second laws of induction. [1 mark]", "Set up the geometry of a moving arm on a rectangular loop in a magnetic field. [1 mark]", "Derive the relation using rate of change of flux or Lorentz force. [2 marks]", "State the final expression e = B * v * l with standard SI units. [1 mark]"]
    }
  ];

  const handleApplySample = (sample: typeof samplePrompts[0]) => {
    setQuestionText(sample.q);
    setEvaluation(null);
    if (onClearInitialPreset) onClearInitialPreset();
  };

  const handleEvaluate = async () => {
    if (!studentAnswer.trim()) return;
    setIsLoading(true);
    setErrorPrompt(null);
    setEvaluation(null);

    try {
      const resp = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionText,
          studentAnswer,
          rubric: initialRubric,
          marks: initialMarks
        })
      });

      if (!resp.ok) throw new Error("Could not connect to evaluate-answer endpoints.");
      const report = await resp.json();
      
      setEvaluation(report);
      onAddScore(3); // Reward points

    } catch (e: any) {
      setErrorPrompt(e.message || "Failed to submit answers sheet grading scripts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="answer-grader-container">
      {/* Configuration Header Card */}
      <div className="glass-panel p-6 bg-white space-y-5" id="answer-grader-inputs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 animate-pulse">DPUE Single Answer Auditor</h1>
            <p className="text-xs text-slate-500 font-semibold">Instantly score answers and map responses with precise textbook checklists.</p>
          </div>
          <span className="p-2.5 rounded bg-orange-50 border border-orange-100 text-[#FF6B00] text-xs font-black uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Audit
          </span>
        </div>

        {/* Input Question Area */}
        <div className="space-y-4 font-sans">
          <div className="space-y-1.5 flex flex-col">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
              <label className="font-extrabold uppercase tracking-widest text-[#FF6B00]">Exam Board Question</label>
              <span className="font-black text-slate-500">Assign: {initialMarks} Marks possible</span>
            </div>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B00] bg-slate-50 text-slate-800 text-xs md:text-sm focus:bg-white focus:outline-none font-bold"
              placeholder="State the boards exam question detail..."
              id="grading-target-question-text"
            />
          </div>

          <div className="space-y-1.5 font-sans">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-black text-[#FF6B00] uppercase tracking-widest block">Student Written Answer</label>
              <VoiceInputButton 
                onTranscript={setStudentAnswer}
                currentValue={studentAnswer}
                id="voice-input-grader"
                label="Voice Answers"
              />
            </div>
            <textarea
              rows={5}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-205 focus:border-[#FF6B00] bg-slate-50 text-slate-800 text-xs md:text-sm focus:bg-white focus:outline-none font-bold placeholder:text-slate-400"
              placeholder="Draft your response here. For high scores, include core variables, derivations, and standard SI parameters..."
              id="student-written-input-field"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-slate-100 font-sans">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-slate-400 font-black uppercase py-2 tracking-widest block">Core Presets:</span>
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(s)}
                className="text-[11px] bg-slate-50 border border-slate-200 hover:border-[#FF6B00] hover:text-[#FF6B00] px-3 py-1.5 rounded-lg text-slate-600 font-extrabold transition-all hover:bg-orange-50 cursor-pointer block"
              >
                Preset {idx + 1} ({s.marks}M)
              </button>
            ))}
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isLoading || !studentAnswer.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white font-extrabold text-xs md:text-sm disabled:opacity-50 transition-all rounded-xl select-none cursor-pointer shadow-md shadow-orange-500/10 border border-transparent uppercase tracking-wider"
            id="evaluate-submission-btn"
          >
            {isLoading ? "Running Board Moderation..." : "Execute Audit Grader"}
          </button>
        </div>
      </div>

      {/* Error display */}
      {errorPrompt && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2 font-bold animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          {errorPrompt}
        </div>
      )}

      {/* Loading component placeholder */}
      {isLoading && (
        <div className="h-44 flex flex-col items-center justify-center text-center space-y-4 bg-white/60 border border-slate-100 rounded-2xl animate-fade-in" id="grader-loading-spinner">
          <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-[#FF6B00] animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Comparing text semantics with NCERT key standards...</span>
        </div>
      )}

      {/* Evaluation Result Sheet */}
      {evaluation && (
        <div className="glass-panel p-6 bg-white space-y-6 animate-fade-in" id="grader-results-panel">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Audit Assessment Details</span>
              <h2 className="text-sm font-extrabold text-slate-850 mt-1 leading-relaxed">Assessing: "{questionText}"</h2>
            </div>

            <div className="bg-orange-50 border border-orange-100 px-4 py-2 text-center rounded-xl shrink-0 select-none">
              <span className="text-[10px] font-bold text-[#FF6B00] uppercase block tracking-wider font-sans">Marks Awarded</span>
              <span className="text-2xl font-black text-[#FF6B00] font-mono block tracking-wide mt-0.5">{evaluation.score} <b className="text-xs text-slate-400">/ {initialMarks}</b></span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Detailed distribution explanation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-700 leading-relaxed font-bold">
              🤔 <b>Marking Rationale:</b> {evaluation.explanation}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              {/* Strengths list card */}
              <div className="p-4 border border-emerald-100 rounded-xl bg-emerald-50 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 blockAll">Strengths Observed:</span>
                <div className="space-y-1.5">
                  {evaluation.strengths?.map((str: string, i: number) => (
                    <div key={i} className="text-xs text-emerald-700 font-bold flex gap-1.5 items-start">
                      <span className="text-emerald-600 font-black shrink-0">✓</span>
                      <span>{str}</span>
                    </div>
                  ))}
                  {(!evaluation.strengths || evaluation.strengths.length === 0) && (
                    <span className="text-xs text-slate-400 block font-bold">None noticed. Try to include physical constants or proofs.</span>
                  )}
                </div>
              </div>

              {/* Weaknesses card */}
              <div className="p-4 border border-rose-100 rounded-xl bg-rose-50 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 block">Critical Gaps Identified:</span>
                <div className="space-y-1.5">
                  {evaluation.weaknesses?.map((weak: string, i: number) => (
                    <div key={i} className="text-xs text-rose-700 font-bold flex gap-1.5 items-start">
                      <span className="text-rose-500 font-bold shrink-0">✗</span>
                      <span>{weak}</span>
                    </div>
                  ))}
                  {(!evaluation.weaknesses || evaluation.weaknesses.length === 0) && (
                    <span className="text-xs text-slate-400 block font-bold">No fatal conceptual gaps located. Well done!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Improvement suggestions */}
            <div className="p-4 border border-slate-150 rounded-xl space-y-2 bg-slate-50 font-sans">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Pedagogical Improvement Plan:</span>
              <ul className="list-disc pl-4 space-y-1">
                {evaluation.improvementSuggestions?.map((s: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 font-bold">{s}</li>
                ))}
              </ul>
            </div>

            {/* Board Success secrets */}
            {evaluation.boardExamTips && evaluation.boardExamTips.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2 font-sans">
                <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-spin" /> DPUE Centum Board Secret Strategy
                </span>
                <div className="space-y-1">
                  {evaluation.boardExamTips.map((tip: string, idx: number) => (
                    <div key={idx} className="text-xs text-amber-900 font-semibold leading-relaxed">
                      • {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
