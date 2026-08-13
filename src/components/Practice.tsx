import React, { useState, useEffect } from 'react';
import { STATIC_MCQS_BANK, BOARD_QUESTION_BANK } from '../ncertData';
import { HelpCircle, RefreshCw, Star, Award, Check, X, ShieldAlert } from 'lucide-react';

interface PracticeQuestionItem {
  id: string;
  category: string; // MCQ, Numerical, OneMark, TwoMarks, ThreeMarks, FiveMarks, CaseStudy, PYQ
  questionText: string;
  options?: string[]; // for MCQ / Case Study
  correctIndex?: number; // for MCQ / Case Study
  explanation: string;
  marks?: number;
  bloomLevel: string;
}

const CATEGORIES = [
  { id: 'MCQ', label: 'MCQs' },
  { id: 'Numerical', label: 'Numericals' },
  { id: 'OneMark', label: 'One Mark' },
  { id: 'TwoMarks', label: 'Two Marks' },
  { id: 'ThreeMarks', label: 'Three Marks' },
  { id: 'FiveMarks', label: 'Five Marks' },
  { id: 'CaseStudy', label: 'Case Study' },
  { id: 'PYQ', label: 'Previous Year' }
];

export default function Practice({ onAddScore }: { onAddScore: (score: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('MCQ');
  const [questions, setQuestions] = useState<PracticeQuestionItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [typedAnswers, setTypedAnswers] = useState<Record<string, string>>({});
  const [lockedAnswers, setLockedAnswers] = useState<Record<string, boolean>>({});

  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);

  // Load custom questions by category
  useEffect(() => {
    loadQuestions();
  }, [selectedCategory]);

  const loadQuestions = () => {
    let list: PracticeQuestionItem[] = [];

    if (selectedCategory === 'MCQ') {
      list = STATIC_MCQS_BANK.map((m, i) => ({
        id: `mcq-p-${i}`,
        category: 'MCQ',
        questionText: m.question,
        options: m.options,
        correctIndex: m.correctIndex,
        explanation: m.explanation,
        bloomLevel: m.bloomLevel
      }));
    } else if (selectedCategory === 'Numerical') {
      list = [
        {
          id: 'num-1',
          category: 'Numerical',
          questionText: "Compute the displacement current inside a parallel plate capacitor of area 0.1 m² with changing electric field dE/dt = 10^12 V/m/s.",
          explanation: "Id = ε_0 * A * (dE/dt) = 8.854e-12 * 0.1 * 10^12 = 0.885 Amperes. Correct SI unit is Amperes.",
          bloomLevel: 'Apply',
          marks: 3
        },
        {
          id: 'num-2',
          category: 'Numerical',
          questionText: "Find the frequency of a sinusoidal electromagnetic wave having a wavelength of 3 cm in vacuum.",
          explanation: "f = c / λ = (3 * 10^8) / 0.03 = 10 GHz or 10^10 Hz.",
          bloomLevel: 'Apply',
          marks: 2
        }
      ];
    } else if (selectedCategory === 'OneMark') {
      list = [
        {
          id: 'om-1',
          category: 'OneMark',
          questionText: "What is the SI unit of magnetic flux?",
          explanation: "Weber (Wb) or Tesla-meter² (T m²).",
          bloomLevel: 'Remember',
          marks: 1
        },
        {
          id: 'om-2',
          category: 'OneMark',
          questionText: "State the velocity equation of electromagnetic waves in a material medium.",
          explanation: "v = 1 / sqrt(μ * ε), where μ is magnetic permeability and ε is dielectric permittivity.",
          bloomLevel: 'Remember',
          marks: 1
        }
      ];
    } else if (selectedCategory === 'TwoMarks') {
      list = BOARD_QUESTION_BANK.filter(q => q.marks === 2).map(q => ({
        id: q.id,
        category: 'TwoMarks',
        questionText: q.questionText,
        explanation: q.rubric.join(" | "),
        bloomLevel: q.bloomLevel,
        marks: 2
      }));
      if (list.length === 0) {
        list = [
          {
            id: 'tm-1',
            category: 'TwoMarks',
            questionText: "State Lenz's law of electromagnetic induction.",
            explanation: "The direction of induced current is such that it opposes the change in magnetic flux that produces it: e = -dФ/dt.",
            bloomLevel: 'Remember',
            marks: 2
          }
        ];
      }
    } else if (selectedCategory === 'ThreeMarks') {
      list = BOARD_QUESTION_BANK.filter(q => q.marks === 3).map(q => ({
        id: q.id,
        category: 'ThreeMarks',
        questionText: q.questionText,
        explanation: q.rubric.join(" | "),
        bloomLevel: q.bloomLevel,
        marks: 3
      }));
    } else if (selectedCategory === 'FiveMarks') {
      list = BOARD_QUESTION_BANK.filter(q => q.marks === 5).map(q => ({
        id: q.id,
        category: 'FiveMarks',
        questionText: q.questionText,
        explanation: q.rubric.join(" | "),
        bloomLevel: q.bloomLevel,
        marks: 5
      }));
    } else if (selectedCategory === 'CaseStudy') {
      list = [
        {
          id: 'cs-1',
          category: 'CaseStudy',
          questionText: "Case Study: In an induction cooktop, bulk pieces of metallic pans generate heating currents when positioned above changing electromagnetic field induction loops. Name these circulating currents.",
          options: ["Conduction currents", "Displacement currents", "Eddy currents", "Galvanic currents"],
          correctIndex: 2,
          explanation: "Eddy currents (or circulating Foucault currents) are produced in conductors subjected to changing magnetic field lines, causing heating via H = I²Rt.",
          bloomLevel: 'Analyze',
          marks: 4
        }
      ];
    } else if (selectedCategory === 'PYQ') {
      list = [
        {
          id: 'pyq-1',
          category: 'PYQ',
          questionText: "Karnataka Board 2024: State Faraday's First and Second laws of Electromagnetic Induction.",
          explanation: "First Law: Changing flux induces EMF. Second Law: magnitude of induced EMF is e = -dФ/dt.",
          bloomLevel: 'Understand',
          marks: 5
        }
      ];
    }

    setQuestions(list);
    setSelectedOptions({});
    setShowExplanations({});
    setTypedAnswers({});
    setLockedAnswers({});
  };

  const handleRandomize = () => {
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const selectOption = (qId: string, optIdx: number, correctIdx: number) => {
    if (lockedAnswers[qId]) return;
    setSelectedOptions(prev => ({ ...prev, [qId]: optIdx }));
    setLockedAnswers(prev => ({ ...prev, [qId]: true }));
    setTotalAttempts(t => t + 1);

    const isCorrect = optIdx === correctIdx;
    if (isCorrect) {
      setCorrectAttempts(c => c + 1);
      onAddScore(2);
    }
  };

  const submitWrittenAnswer = (qId: string) => {
    if (lockedAnswers[qId]) return;
    setLockedAnswers(prev => ({ ...prev, [qId]: true }));
    setTotalAttempts(t => t + 1);
    
    const hasLength = (typedAnswers[qId] || '').trim().length > 5;
    if (hasLength) {
      setCorrectAttempts(c => c + 1);
      onAddScore(3);
    }
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="practice-hub-module">
      {/* Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            Practice Sandbox • Category Worksheets
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-8 h-8 text-orange-500 animate-pulse" /> Practice Hub
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Solve questions grouped by board specifications, review detailed explanations, and audit your precision score.
          </p>
        </div>

        {/* Stats card */}
        <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full justify-between md:w-auto font-mono shrink-0">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">Accuracy Rate</span>
            <span className="text-sm font-black text-emerald-600 leading-none mt-1">{accuracy}% Accuracy</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total Solved</span>
            <span className="text-sm font-black text-slate-800 leading-none mt-1">{correctAttempts} / {totalAttempts} Qs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all select-none shrink-0 border border-transparent ${
              selectedCategory === cat.id
                ? 'bg-white text-orange-600 shadow-sm border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Header operations */}
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <span className="text-xs text-slate-550 font-bold">Category: {CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
        <button
          onClick={handleRandomize}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-705 text-xs font-black rounded-lg cursor-pointer flex items-center gap-1.5 select-none uppercase"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Randomize Questions</span>
        </button>
      </div>

      {/* Questions list */}
      <div className="space-y-4" id="practice-questions-list">
        {questions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50 border rounded-2xl font-bold text-xs">
            No questions available for the selected category.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex justify-between text-[9px] uppercase font-black text-slate-400">
                <span>Question {idx + 1} • {q.bloomLevel} Level</span>
                {q.marks && <span>{q.marks} Marks</span>}
              </div>

              <h3 className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{q.questionText}</h3>

              {/* Options if MCQ or CaseStudy */}
              {q.options ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs font-semibold">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOptions[q.id] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    const isLocked = lockedAnswers[q.id];

                    let btnColor = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (isLocked) {
                      if (isCorrect) btnColor = 'bg-emerald-50 border-emerald-350 text-emerald-700 font-extrabold';
                      else if (isSelected) btnColor = 'bg-rose-50 border-rose-350 text-rose-700';
                      else btnColor = 'opacity-40 bg-slate-50 border border-slate-150';
                    } else if (isSelected) {
                      btnColor = 'bg-orange-50 border-orange-300 text-[#FF6B00] border-2';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectOption(q.id, optIdx, q.correctIndex!)}
                        disabled={isLocked}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${btnColor}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  <textarea
                    rows={4}
                    value={typedAnswers[q.id] || ''}
                    onChange={(e) => setTypedAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={lockedAnswers[q.id]}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] focus:bg-white p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter your comprehensive theoretical solution..."
                  />
                  {!lockedAnswers[q.id] && (
                    <div className="flex justify-end select-none">
                      <button
                        onClick={() => submitWrittenAnswer(q.id)}
                        disabled={!(typedAnswers[q.id] || '').trim()}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-lg hover:bg-slate-800 disabled:opacity-40 cursor-pointer uppercase tracking-wider"
                      >
                        Submit Response
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 select-none">
                <button
                  onClick={() => setShowExplanations(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100/50 border border-orange-100 text-orange-700 text-xs font-black rounded-lg cursor-pointer uppercase tracking-wider transition-all"
                >
                  {showExplanations[q.id] ? 'Hide Solution' : 'View Solution'}
                </button>
              </div>

              {showExplanations[q.id] && (
                <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-650 leading-relaxed font-semibold animate-fade-in font-sans">
                  <strong>Solution Walkthrough:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
