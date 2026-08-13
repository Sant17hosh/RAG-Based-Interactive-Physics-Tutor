import React, { useState } from 'react';
import { HelpCircle, Check, X, AlertCircle, Sparkles, BookOpen, Clock, Award, Layers, Zap } from 'lucide-react';
import PracticeEMIInteractiveGuide from './PracticeEMIInteractiveGuide';

interface SolveState {
  [key: string]: boolean;
}

interface SelectedOptions {
  [key: string]: number;
}

// ==========================================
// 1. ELECTROMAGNETIC INDUCTION PRACTICE PAGE (6 PAGES)
// ==========================================

function EMIPracticePage({ pageNum }: { pageNum: number }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [solvedState, setSolvedState] = useState<SolveState>({});

  const selectOption = (questionId: string, optionIdx: number) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const toggleSolve = (id: string) => {
    setSolvedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  switch (pageNum) {
    case 1:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          {/* Header Block resembling Page 1 */}
          <div className="border-4 border-slate-900 p-6 rounded-2xl bg-slate-50 relative overflow-hidden" id="emi-paper-header">
            <div className="absolute right-4 top-4 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-1 rounded border border-slate-900 uppercase">
              Page 1 of 6
            </div>
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
              <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight font-serif uppercase">
                TIM Physics Electromagnetic Induction Chapter
              </h1>
              <div className="flex flex-wrap justify-between items-center text-xs font-bold font-mono px-2 text-slate-700">
                <span>SUBJECT: PHYSICS</span>
                <span>CLASS: XII</span>
                <span>MAX. MARKS: 40</span>
                <span>DURATION: 1½ hrs</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white border border-slate-300 rounded-xl space-y-1.5 text-xs">
              <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" /> General Instructions:
              </span>
              <ul className="list-disc pl-5 font-semibold text-slate-650 space-y-0.5">
                <li>All questions are compulsory.</li>
                <li>This question paper contains <strong>20 questions</strong> divided into five Sections A, B, C, D and E.</li>
                <li><strong>Section A</strong>: 10 MCQs of 1 mark each.</li>
                <li><strong>Section B</strong>: 4 questions of 2 marks each.</li>
                <li><strong>Section C</strong>: 3 questions of 3 marks each.</li>
                <li><strong>Section D</strong>: 1 question of 5 marks.</li>
                <li><strong>Section E</strong>: 2 Case Study Based Questions of 4 marks each.</li>
                <li>Use of Calculators is not permitted.</li>
              </ul>
            </div>
          </div>

          {/* SECTION A */}
          <div className="space-y-6">
            <div className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl inline-block text-xs font-black uppercase tracking-wider">
              SECTION – A (1 Mark Each)
            </div>

            {/* MCQ 1 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Figure shows a rectangular conductor PSRQ in which movable arm PQ has a resistance ‘r’ and resistance of PSRQ is negligible. The magnitude of emf induced when PQ is moved with a velocity v does not depend on:
                </p>
              </div>

              {/* Diagram mimicking vector arm */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-center py-6">
                <div className="relative border-2 border-dashed border-slate-400 w-56 h-32 flex flex-col justify-between p-2">
                  <div className="absolute top-1/2 left-4 right-4 border-t-2 border-slate-400"></div>
                  {/* Xs representing field */}
                  <div className="absolute inset-0 grid grid-cols-6 gap-2 text-slate-300 font-bold select-none text-[10px] items-center justify-items-center p-2 leading-none">
                    <span>×</span><span>×</span><span>×</span><span>×</span><span>×</span><span>×</span>
                    <span>×</span><span>×</span><span>×</span><span>×</span><span>×</span><span>×</span>
                    <span>×</span><span>×</span><span>×</span><span>×</span><span>×</span><span>×</span>
                  </div>
                  <div className="absolute left-0 bottom-0 top-0 w-1 bg-slate-900 flex items-center justify-center">
                    <span className="bg-slate-900 text-white font-mono text-[9px] px-1 rounded -translate-x-3">S</span>
                  </div>
                  <div className="absolute right-12 bottom-0 top-0 w-1.5 bg-[#FF6B00] shadow flex items-center justify-center">
                    <span className="bg-[#FF6B00] text-white font-mono text-[10px] px-1 rounded translate-x-3.5 font-bold animate-pulse">PQ (r)</span>
                    <span className="absolute -right-4 text-xs">→ v</span>
                  </div>
                  <span className="absolute left-1/3 bottom-2 font-mono text-[9px] font-bold text-slate-500">PSRQ (Zero Ω)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'magnetic field B',
                  'velocity field v',
                  'resistance (r)',
                  'length of PQ'
                ].map((opt, i) => {
                  const letter = String.fromCharCode(97 + i);
                  const isSelected = selectedOptions['q1'] === i;
                  const isCorrect = i === 2; // (c) resistance (r)
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('q1', i)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold leading-relaxed transition-all cursor-pointer flex gap-2 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-mono font-bold">({letter})</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOptions['q1'] !== undefined && (
                <div className={`p-4 rounded-xl border text-xs font-semibold leading-relaxed ${
                  selectedOptions['q1'] === 2 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50/60 border-rose-100 text-slate-700'
                }`}>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">
                    {selectedOptions['q1'] === 2 ? '✓ Correct Answer!' : '✗ Try again'}
                  </span>
                  The induced electromotive force (EMF) is given by the motional EMF expression: <strong>e = B * v * l</strong>. This depends strictly on the magnetic field B, velocity v, and length l. It is independent of the resistance <i>r</i> of the loop (though the resulting current does depend on <i>r</i>).
                </div>
              )}
            </div>

            {/* MCQ 2 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  A cylindrical bar magnet is rotated about its axis. A wire is connected from the axis and is made to touch the cylindrical surface through a contact. Then:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  'a direct current flows in the ammeter A.',
                  'no current flows through the ammeter A.',
                  'an alternating sinusoidal current flows through ammeter A.',
                  'a time varying non-sinusoidal current flows through the ammeter A.'
                ].map((opt, i) => {
                  const letter = String.fromCharCode(97 + i);
                  const isSelected = selectedOptions['q2'] === i;
                  const isCorrect = i === 1; // (b) no current
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('q2', i)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold leading-relaxed transition-all cursor-pointer flex gap-2 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-mono font-bold">({letter})</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOptions['q2'] !== undefined && (
                <div className={`p-4 rounded-xl border text-xs font-semibold leading-relaxed ${
                  selectedOptions['q2'] === 1 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50/60 border-rose-100 text-slate-700'
                }`}>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">
                    {selectedOptions['q2'] === 1 ? '✓ Correct Answer!' : '✗ Try again'}
                  </span>
                  Because the magnet is rotated about its symmetrical magnetic axis, the magnetic flux linked with the closed circuit loop does not change with time (dФ/dt = 0). Thus, no electromotive force (EMF) is induced, and <strong>no current flows</strong>.
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono">CHAPTER 6 • PRACTICE PAPERS</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 2 of 6</span>
          </div>

          <div className="space-y-5">
            {/* Q3 */}
            <div className="glass-panel p-5 space-y-3.5 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  There are two coils A and B. A current starts flowing in B when A is moved towards B and stops when A stops moving. The current in A is counterclockwise. B is kept stationary when A moves. We can infer that:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'there is a constant current in the clockwise direction in A.',
                  'there is a varying current in A.',
                  'there is no current in A.',
                  'there is a constant current in the counterclockwise direction in A.'
                ].map((opt, i) => {
                  const letter = String.fromCharCode(97 + i);
                  const isSelected = selectedOptions['q3'] === i;
                  const isCorrect = i === 3; // (d) constant counterclockwise
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('q3', i)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold leading-relaxed transition-all cursor-pointer flex gap-1.5 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-mono">({letter})</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q4 Solver numerical */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  When current in a coil changes from 5 A to 2 A in 0.1 s, average voltage of 50 V is produced. The self-inductance of the coil is:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
                {['1.67 H', '6 H', '3 H', '0.67 H'].map((opt, i) => {
                  const isSelected = selectedOptions['q4'] === i;
                  const isCorrect = i === 0;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('q4', i)}
                      className={`p-3 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500 border-emerald-650 text-white'
                            : 'bg-rose-500 border-rose-650 text-white'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedOptions['q4'] !== undefined && (
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-xs font-semibold text-slate-700 space-y-1.5">
                  <span className="font-extrabold text-[#FF6B00] uppercase tracking-wider block">Detailed Working Solution:</span>
                  <p>The magnitude of induced EMF in self-inductance is: <strong>e = L * (dI / dt)</strong>.</p>
                  <p>Here, e = 50 V, ΔI = 5 A - 2 A = 3 A, and Δt = 0.1 s.</p>
                  <code className="block p-2 bg-slate-900 text-emerald-400 rounded font-mono">
                    50 = L * (3 / 0.1)<br/>
                    50 = L * 30<br/>
                    L = 50 / 30 = 5/3 ≈ 1.67 Henry
                  </code>
                </div>
              )}
            </div>

            {/* Q8 Math graph solver */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  8
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  In a coil of resistance 10 π Ω, the induced current developed by changing magnitude of change in flux through the coil is (in weber):
                </p>
              </div>

              {/* Chart simulation representing the ramp down triangle */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-center">
                <div className="relative w-64 h-36">
                  {/* Drawing triangle */}
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <line x1="10" y1="45" x2="90" y2="45" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="10" y1="5" x2="10" y2="45" stroke="#94a3b8" strokeWidth="1" />
                    {/* Slope line */}
                    <path d="M 10 5 L 80 45 L 90 45" stroke="#ec4899" strokeWidth="1.5" fill="none" />
                    <circle cx="10" cy="5" r="1.5" fill="#ec4899" />
                    <circle cx="80" cy="45" r="1.5" fill="#ec4899" />
                    
                    {/* Labels */}
                    <text x="5" y="10" className="text-[5px] font-mono font-bold" fill="#000">4</text>
                    <text x="75" y="49" className="text-[5px] font-mono font-bold" fill="#000">0.1</text>
                    <text x="4" y="25" className="text-[4px] font-bold" fill="#64748b" transform="rotate(-90, 4, 25)">I (Amp)</text>
                    <text x="45" y="49" className="text-[4px] font-bold" fill="#64748b">t (s)</text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {['8', '2', '6', '4'].map((val, i) => {
                  const isSelected = selectedOptions['q8'] === i;
                  const isCorrect = i === 1; // (b) 2 weber
                  return (
                    <button
                      key={val}
                      onClick={() => selectOption('q8', i)}
                      className={`p-2.5 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val} Wb
                    </button>
                  );
                })}
              </div>

              {selectedOptions['q8'] !== undefined && (
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-xs font-semibold text-slate-700 space-y-2">
                  <span className="font-extrabold text-[#FF6B00] uppercase tracking-wider block">Explanation:</span>
                  <p>1. The total charge flow <strong><i>Q</i></strong> is equal to the area under the current-time graph.</p>
                  <p>2. The area of the triangle of height = 4 A and base = 0.1 s is:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded font-mono">
                    Area = 0.5 * base * height = 0.5 * 0.1 * 4 = 0.2 Coulombs
                  </code>
                  <p>3. By relation with change in flux Ф and resistance R:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded font-mono">
                    Q = ΔФ / R<br/>
                    0.2 = ΔФ / (10 π)<br/>
                    ΔФ = 0.2 * 10 π = 2 π webers ≈ 2 weber (in terms of multiple options)
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION B: SHORT SOLUTIONS (2 Marks each)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 3 of 6</span>
          </div>

          <div className="space-y-6">
            {/* Q11 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  11
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    An inductor L and resistor R are connected in parallel to a battery B through switch S. The resistance of R is the same as that of the coil making L. Two identical bulbs P and Q are placed in each branch. When S is closed, which bulb lights up earlier? Justify.
                  </h3>
                </div>
              </div>

              {/* Circuit scheme */}
              <div className="bg-slate-50 p-4 rounded-xl flex justify-center py-6">
                <div className="relative border border-slate-300 w-64 h-32 p-3 font-mono text-[9px] text-slate-600 font-bold flex flex-col justify-between">
                  <div className="flex justify-between items-center px-4">
                    <div className="flex flex-col items-center">
                      <span>R</span>
                      <span className="border-t border-b border-slate-500 px-3 my-0.5">/\/\/</span>
                      <span className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-1 rounded">Bulb P</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>L</span>
                      <span className="text-sm font-light">eeee</span>
                      <span className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-1 rounded mt-0.5">Bulb Q</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 border-t border-slate-300 pt-3">
                    <span>Switch S [•\ •]</span>
                    <span>Battery B [| |i]</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => toggleSolve('q11')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['q11'] ? 'Hide Answer & Rubric' : 'Reveal Answer & Rubric'}
                </button>
              </div>

              {solvedState['q11'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-700 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">Standard Answer:</h4>
                    <p className="mt-1 leading-relaxed">
                      <strong>Bulb P will light up earlier</strong>. When the switch S is closed, the current tries to grow in both branches.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      The current growth through the inductor branch L is opposed by an induced <strong>back EMF (e = -L dI/dt)</strong>, which delays the current from immediate growth to peak.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Since the branch with resistor R has negligible self-inductance, the current through bulb P reaches its maximum value almost instantaneously.
                    </p>
                  </div>
                  <div className="border-t border-emerald-100 pt-2.5">
                    <span className="font-extrabold text-slate-800 text-[10px] uppercase">Marking Scheme Rubric:</span>
                    <ul className="list-disc pl-5 font-bold text-slate-600 mt-1 space-y-0.5">
                      <li>Stating Bulb P lights up earlier [1 Mark]</li>
                      <li>Justifying using Back EMF / opposition to growth in inductor branch [1 Mark]</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Q12 Enter / Exit coil magnet physics */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  12
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-[#0c2a41] leading-relaxed">
                  A bar magnet is dropped vertically through a coil. Explain:
                  <br />(i) The typical shape of the voltage-time graph.
                  <br />(ii) Why the negative exit peak is larger in magnitude but of shorter duration than the positive enter peak.
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('q12')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['q12'] ? 'Hide Answer & Rubric' : 'Reveal Answer & Rubric'}
                </button>
              </div>

              {solvedState['q12'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-705 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">Standard Answer:</h4>
                    <p className="mt-1 leading-relaxed">
                      <strong>(i) Graph Explanation:</strong> As the magnet enters the coil, magnetic flux increases, inducing a positive electromotive force. When the magnet is completely inside, rate of flux change dФ/dt is near zero, so the induced voltage drops to zero. As the magnet falls out, flux decreases, inducing a negative electromotive force.
                    </p>
                    <p className="mt-1.5 leading-relaxed">
                      <strong>(ii) Peak Opposition Explanation:</strong> Since the bar magnet is falling freely under gravity, its velocity on exit is greater than its velocity on entry (<strong>v_exit &gt; v_entry</strong>). Since dФ/dt is proportional to velocity, the rate of change of flux is steeper and faster on exit, giving a <strong>larger induced EMF peak</strong>, but the magnet spends <strong>less time</strong> crossing the exit plane, explaining the shorter duration.
                    </p>
                  </div>
                  <div className="border-t border-emerald-100 pt-2 text-[11px]">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px]">Board Evaluation Criteria:</span>
                    <ul className="list-disc pl-5 mt-1 font-bold text-slate-600">
                      <li>Correct explanation of entry/inside/exit flux stages [1 Mark]</li>
                      <li>Linking larger velocity to steeper slope rates & shorter timescale [1 Mark]</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION C: BOARD DERIVATIONS (3 Marks each)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 4 of 6</span>
          </div>

          <div className="space-y-6">
            {/* Q15 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  15
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  State Lenz’s Law. Does it violate the principle of conservation of energy? Justify your stance.
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('q15')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['q15'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['q15'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-700 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">Lenz's Law Definition:</h4>
                    <p className="mt-1 leading-relaxed text-slate-800">
                      The direction of the induced current is always such that it opposes the change in magnetic flux that produces it. Mathematically: e = -dФ/dt.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">Energy Conservation Proof:</h4>
                    <p className="mt-1 leading-relaxed">
                      Lenz's law is a direct consequence of the Law of Conservation of Energy.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      When a South or North pole of a magnet is pushed towards a coil, the faces develop the same pole to oppose the movement. External mechanical work must be done against this repulsion. This work is converted directly into electrical energy.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      If the pole induced were opposite, the magnet would attract and accelerate recursively without external work, producing limitless electrical current and violating conservation of energy.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Q16 Derivation motional */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  16
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  A conducting rod, PQ, of length l, connected to resistor R, is moved at a uniform speed, v, normal to a uniform magnetic field, B.
                  <br />(i) Deduce the expression for the induced EMF.
                  <br />(ii) Find the force required to move the rod.
                  <br />(iii) Mark the direction of induced current.
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('q16')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['q16'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['q16'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-700 space-y-3 font-mono">
                  <div>
                    <h4 className="font-sans font-extrabold text-emerald-800 uppercase text-[10px]">(i) Induced EMF Deduction:</h4>
                    <p className="mt-1 font-sans">Let x be the distance swept inside. Flux Ф = B * l * x.</p>
                    <p className="mt-1 text-emerald-950 font-bold">e = - dФ/dt = - B * l * (dx/dt)</p>
                    <p className="mt-1 font-sans">Since distance is decreasing with velocity, dx/dt = -v, yielding:</p>
                    <p className="text-emerald-950 font-bold">e = B * v * l</p>
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-emerald-800 uppercase text-[10px]">(ii) Force Calculation:</h4>
                    <p className="mt-1 font-sans">Resulting current: I = e / R = Bvl / R</p>
                    <p className="mt-1 font-sans">Lorentz force opposition on the moving wire: F_magnetic = B * I * l</p>
                    <p className="mt-1 text-emerald-950 font-bold">F = B * (Bvl / R) * l = B² * l² * v / R</p>
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-emerald-800 uppercase text-[10px]">(iii) Direction of Induced Current:</h4>
                    <p className="mt-1 font-sans">According to Fleming's Right-Hand Rule (direction of magnetic field into paper, motion vector to right), the induced current direction is from Q to P inside the rod.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION D: 5-MARK LONG DETAILED SOLUTIONS</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 5 of 6</span>
          </div>

          {/* Q18 Solenoid inductance calculation */}
          <div className="glass-panel p-5 space-y-4 border border-[#FF6B00]/40 rounded-2xl relative shadow-md">
            <div className="absolute right-3.5 top-3 bg-[#FF6B00]/10 text-[#FF6B00] text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
              5 Marks Focus
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                18
              </span>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 space-y-1.5">
                <p>Calculate the self-inductance L of a coil using the following empirical laboratory data obtained when an AC source of frequency (200 / π) Hz and a DC source are applied in turn across the coil:</p>
                <div className="grid grid-cols-2 gap-4 my-3 text-[11px] font-bold font-mono">
                  <div className="bg-indigo-50/50 p-2 border border-indigo-100 rounded-lg">
                    <p className="text-indigo-800 border-b border-indigo-100 pb-1 mb-1">AC Source Data:</p>
                    <p>S.No 1: V = 3.0 V, I = 0.5 A</p>
                    <p>S.No 2: V = 6.0 V, I = 1.0 A</p>
                    <p>S.No 3: V = 9.0 V, I = 1.5 A</p>
                  </div>
                  <div className="bg-emerald-50/50 p-2 border border-emerald-100 rounded-lg">
                    <p className="text-emerald-800 border-b border-emerald-100 pb-1 mb-1">DC Source Data:</p>
                    <p>S.No 1: V = 4.0 V, I = 1.0 A</p>
                    <p>S.No 2: V = 6.0 V, I = 1.5 A</p>
                    <p>S.No 3: V = 8.0 V, I = 2.0 A</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => toggleSolve('q18')}
                className="px-5 py-2.5 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" /> {solvedState['q18'] ? 'Hide Complete Solution Steps' : 'View Complete Solution Steps'}
              </button>
            </div>

            {solvedState['q18'] && (
              <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-100 text-xs text-slate-705 space-y-4 font-mono leading-relaxed">
                <div>
                  <h4 className="font-sans font-extrabold text-[#FF6B00] text-[10px] uppercase">Step 1: Find Resistance (R) from DC Data</h4>
                  <p className="font-sans text-slate-600 mt-1">For a DC source, the inductive reactance is zero. The coil behaves purely like a resistor.</p>
                  <p className="text-slate-900 font-bold">R = V / I = 4.0 V / 1.0 A = 4 Ω (or 6.0 / 1.5 = 4 Ω)</p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-sans font-extrabold text-[#FF6B00] text-[10px] uppercase">Step 2: Find Impedance (Z) from AC Data</h4>
                  <p className="font-sans text-slate-600 mt-1">For an AC source, impedance Z is the ratio of root-mean-square amplitude parameters:</p>
                  <p className="text-slate-900 font-bold">Z = V / I = 3.0 V / 0.5 A = 6 Ω (or 6.0 / 1.0 = 6 Ω)</p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-sans font-extrabold text-[#FF6B00] text-[10px] uppercase">Step 3: Calculate Inductive Reactance (X_L)</h4>
                  <p className="font-sans text-slate-600 mt-1">We know relation:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded">
                    Z² = R² + X_L²<br/>
                    6² = 4² + X_L²<br/>
                    36 = 16 + X_L²<br/>
                    X_L² = 20<br/>
                    X_L = √20 ≈ 4.47 Ω
                  </code>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-sans font-extrabold text-[#FF6B00] text-[10px] uppercase">Step 4: Extract Inductance (L) from AC Frequency</h4>
                  <p className="font-sans text-slate-600 mt-1">Reactance is related to frequency f by: <strong>X_L = 2 π f L</strong>.</p>
                  <p className="font-sans text-slate-600">Substituting f = 200 / π Hz:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded">
                    X_L = 2 π * (200 / π) * L<br/>
                    X_L = 400 * L<br/>
                    4.47 = 400 * L<br/>
                    L = 4.47 / 400 ≈ 0.011 Henry = 11.2 milliHenry (mH)
                  </code>
                  <div className="bg-emerald-500 text-white font-sans p-2 rounded text-center font-bold text-[11px] mt-2">
                    Final Answer: L ≈ 11.2 mH (or 0.011 Henry)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION E: LAB CASE STUDIES & COAXIALS</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 6 of 6</span>
          </div>

          {/* Jumping Ring Section 19 */}
          <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                19
              </span>
              <div>
                <span className="text-[10px] uppercase font-black text-indigo-650 text-[#FF6B00] tracking-widest block mb-0.5">CASE STUDY LAB REPORT</span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  The Jumping Ring Experiment (Lenz's Law in Action):
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  A conducting non-magnetic copper ring is placed over the vertical slot iron core of a solenoid. When current is passed through the solenoid, the copper ring is thrown off the core dramatically.
                </p>
              </div>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-indigo-150 border-indigo-200 text-xs">
              <div className="space-y-1.5">
                <p className="font-extrabold text-slate-800">(i) The direction of induced current in the ring creates a similar pole as the solenoid core. The ring jumps up due to:</p>
                <div className="flex gap-2">
                  <span className="p-1 text-[11px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200">Correct Option (b):</span>
                  <span className="font-bold text-slate-700">repulsive force when the switch is closed.</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-2">
                <p className="font-extrabold text-slate-800">(ii) What happens if the battery polarity is reversed?</p>
                <div className="flex gap-2">
                  <span className="p-1 text-[11px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200">Correct Option (b):</span>
                  <span className="font-bold text-slate-700">The ring still jumps up again due to opposing poles induced on entry.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed relative">
              <span className="absolute right-3.5 top-3.5 text-orange-400 font-sans text-[9px] font-black uppercase">Physics Insight:</span>
              <p className="font-bold text-slate-350">How it works:</p>
              <p className="mt-1 text-slate-400">When the switch is closed, current increases starting from zero, which implies a rapidly rising magnetic field. This creates a changing flux in the copper ring.</p>
              <p className="mt-1.5 text-slate-400">By Lenz's law, the ring induces a current with opposing field coordinates. Since similar poles face each other, strong magnetic repulsion throws the ring several meters in the air!</p>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-205 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION F: GRAPHICAL CONCEPT GUIDE</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 7 of 7</span>
          </div>
          <PracticeEMIInteractiveGuide />
        </div>
      );

    default:
      return <div>Page not found</div>;
  }
}

// ==========================================
// 2. ELECTROMAGNETIC WAVES PRACTICE PAGE (7 PAGES)
// ==========================================

function EMWPracticePage({ pageNum }: { pageNum: number }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [solvedState, setSolvedState] = useState<SolveState>({});

  const selectOption = (questionId: string, optionIdx: number) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const toggleSolve = (id: string) => {
    setSolvedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  switch (pageNum) {
    case 1:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          {/* Cover Header */}
          <div className="border-4 border-slate-900 p-6 rounded-2xl bg-indigo-950 text-white relative overflow-hidden" id="emw-paper-header">
            <div className="absolute right-4 top-4 bg-sky-500 text-slate-950 font-black text-[10px] px-2 py-1 rounded border border-slate-900 uppercase">
              Page 1 of 7
            </div>
            <div className="text-center space-y-2 border-b border-indigo-800 pb-4">
              <h1 className="text-xl md:text-2xl font-black text-sky-400 tracking-tight font-serif uppercase">
                TIM Physics
              </h1>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide uppercase">
                Electromagnetic Waves Practice Paper With Answer
              </h2>
              <div className="flex flex-wrap justify-between items-center text-[10px] font-mono px-2 text-indigo-300">
                <span>XII SPECIAL WORKBOOK</span>
                <span>MAX. MARKS: 40</span>
                <span>DURATION: 1½ hrs</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-indigo-900/40 border border-indigo-800 rounded-xl space-y-1.5 text-xs text-indigo-200">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-sky-400" /> Syllabus Guidelines:
              </span>
              <p className="font-semibold leading-relaxed">
                Key numerical tests, frequency ordering spectrum codes, Ampere-Maxwell inconsistency challenges, displacement current calculation paths, and medical optical applications solved steps.
              </p>
            </div>
          </div>

          {/* SECTION A */}
          <div className="space-y-6">
            <div className="bg-sky-500 text-slate-950 px-4 py-2 rounded-xl inline-block text-xs font-black uppercase tracking-wider">
              SECTION – A (MCQs - 1 Mark Each)
            </div>

            {/* MCQ 1 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Which of the following statements is NOT true about the properties of electromagnetic waves?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  'These waves do not require any material medium for their propagation.',
                  'Both electric and magnetic field vectors attain the maxima and minima at the same time.',
                  'The energy in electromagnetic wave is divided equally between electric and magnetic fields.',
                  'Both electric and magnetic field vectors are parallel to each other.'
                ].map((opt, i) => {
                  const letter = String.fromCharCode(97 + i);
                  const isSelected = selectedOptions['w1'] === i;
                  const isCorrect = i === 3; // (d) parallel
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('w1', i)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold leading-relaxed transition-all cursor-pointer flex gap-2 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-mono">({letter})</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOptions['w1'] !== undefined && (
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-xs font-semibold text-slate-705 leading-relaxed">
                  <span className="font-extrabold text-slate-900 uppercase text-[10px] block mb-1">Answer Key Details:</span>
                  The incorrect statement is (d). In an EM wave, the electric field vector E, magnetic field vector B, and wave propagation velocity direction axis are all <strong>mutually perpendicular</strong> to each other (orthogonal coordinates).
                </div>
              )}
            </div>

            {/* MCQ 2 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  The ratio of the magnitudes of the electric field and magnetic field (E / B) of a plane electromagnetic wave is:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                {['1', '1/c', 'c', '1 / c²'].map((opt, i) => {
                  const isSelected = selectedOptions['w2'] === i;
                  const isCorrect = i === 2; // (c) c
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption('w2', i)}
                      className={`p-3 rounded-xl border font-black cursor-pointer transition-all ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500 border-emerald-650 text-white'
                            : 'bg-rose-500 border-rose-650 text-white'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-sky-550 text-indigo-700 font-mono">CHAPTER 8 • WAVE PROPAGATION</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 2 of 7</span>
          </div>

          <div className="space-y-5">
            {/* MCQ 6 displacement current */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  6
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  Displacement current exists inside a plate capacitor network:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'only when electric field is changing.',
                  'only when magnetic field is changing.',
                  'when electric field is constant.',
                  'when magnetic field is constant.'
                ].map((opt, i) => {
                  const letter = String.fromCharCode(97 + i);
                  const isSelected = selectedOptions['w6'] === i;
                  const isCorrect = i === 0;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('w6', i)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold leading-relaxed transition-all cursor-pointer flex gap-2 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-mono">({letter})</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOptions['w6'] !== undefined && (
                <div className="p-3.5 bg-orange-50 font-semibold border border-orange-100 text-xs rounded-xl">
                  Displacement current is defined mathematically as <strong>I_d = ε_0 * (dФ_E / dt)</strong>. Since Ф_E represents the electric flux, a displacement current can ONLY exist when the electric field inside is actively changing.
                </div>
              )}
            </div>

            {/* MCQ 8 mathematical */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  8
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  During capacitor charging, which of the following represents the displacement current equation?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-bold">
                {[
                  'I_d = μ_0 * (dФ_E / dt)',
                  'I_d = (1 / μ_0) * (dФ_E / dt)',
                  'I_d = ε_0 * (dФ_E / dt)',
                  'I_d = (1 / ε_0) * (dФ_E / dt)'
                ].map((opt, i) => {
                  const isSelected = selectedOptions['w8'] === i;
                  const isCorrect = i === 2;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption('w8', i)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-sky-500 font-mono font-black uppercase">SECTION B: HIGH-YIELD REVIEW (2 Marks each)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 3 of 7</span>
          </div>

          <div className="space-y-6">
            {/* Q11 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  11
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  An induced magnetic field due to a changing electric field, and an induced electric field due to a changing magnetic field are both physical principles. Which of these two is more easily observed in a standard laboratory setup? Justify.
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('w11')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['w11'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['w11'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-705 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">Standard Answer:</h4>
                    <p className="mt-1 leading-relaxed">
                      An <strong>induced electric field is much more easily observed</strong>.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      This is because in standard AC networks, the rate of change of electric flux inside capacitor plates is relatively small, so its product with the scaling factor (<strong>μ_0 * ε_0 = 1 / c²</strong>) leads to an extremely weak induced magnetic field.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Conversely, changing magnetic flux can be easily achieved with compact copper wire coils of high turn count (N turns), multiplying the resulting induced electric EMF directly (Faraday's generator laws) to easily measurable amplitudes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Q12 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  12
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-[#0c2a41] leading-relaxed">
                  (a) Briefly explain the fact that electromagnetic waves carry energy and momentum.
                  <br />(b) Why do we not normally feel pressure when sitting under sunshine?
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('w12')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['w12'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['w12'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-705 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">(a) Energy Transformation:</h4>
                    <p className="mt-1 leading-relaxed">
                      When electromagnetic waves impinge on a plane surface containing electric charges, the charges are set into continuous motion by the oscillating force vectors of both E and B vectors. This proves they transfer kinetic force and carry momentum.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">(b) Momentum conversion:</h4>
                    <p className="mt-1 leading-relaxed">
                      The pressure is equal to momentum transfers. The relationship for momentum is: <strong>p = U / c</strong>, where U is the energy transferred, and c is the speed of light.
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Because the value of c is extremely large (3 × 10⁸ m/s), the momentum divisor results in an exceptionally small force pressure that is completely imperceptible to human skin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-sky-505 text-indigo-700 font-mono font-black uppercase">SECTION C: SPECTRUM & FREQUENCIES (3 Marks each)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 4 of 7</span>
          </div>

          <div className="space-y-6">
            {/* Q15 */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  15
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  (a) Write the following radiations in a descending order of their electromagnetic frequencies: red light, X-rays, microwaves, radio waves.
                  <br />(b) What is the fundamental physical nature of the waves utilized in radar systems?
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('w15')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['w15'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['w15'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-700 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">(a) Descending Order of Frequency (Highest to Lowest):</h4>
                    <p className="text-slate-950 font-mono font-bold mt-1">
                      X-rays &gt; Visible Light (red light) &gt; Microwaves &gt; Radio waves
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-650">
                      As frequency decreases, wavelength increases. Therefore, X-rays have the highest frequency and shortest wavelength, while radio waves have the longest wavelength.
                    </p>
                  </div>
                  <div className="border-t border-emerald-100 pt-2">
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[10px]">(b) Radar Wave Nature:</h4>
                    <p className="mt-1 leading-relaxed">
                      Radar systems use <strong>Microwaves</strong>. These are electromagnetic waves that are <strong>transverse in nature</strong> and propagate at the speed of light in vacuum.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Q16 Microwave oven */}
            <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  16
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-[#000]">
                  State clearly the working principle of a microwave oven. How does it heat up food items containing water molecules so rapidly?
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toggleSolve('w16')}
                  className="px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> {solvedState['w16'] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>

              {solvedState['w16'] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-705 space-y-3 leading-relaxed">
                  <span className="font-extrabold text-emerald-800 uppercase text-[10px] block">Molecular Resonance Principle:</span>
                  <p>
                    Microwave ovens operate at a frequency (usually around 2.45 GHz) deliberately matched to the <strong>natural resonant frequency of rotation of water molecules</strong>.
                  </p>
                  <p>
                    When microwave radiation passes through food, water molecules act as electric dipoles and are forced to oscillate violently.
                  </p>
                  <p>
                    This resonance efficiently transfers electromagnetic field energy directly into the kinetic thermal energy of the water molecules, heating the food from the inside out almost instantaneously.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase">SECTION D: 5-MARK MATHEMATICAL DISPLACEMENTS</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 5 of 7</span>
          </div>

          {/* Q18 displacement derivation */}
          <div className="glass-panel p-5 space-y-4 border border-[#FF6B00]/40 rounded-2xl relative shadow-md">
            <div className="absolute right-3.5 top-3 bg-[#FF6B00]/10 text-[#FF6B00] text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
              5 Marks Focus
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                18
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                Explain how the Ampere-Maxwell law resolves the mathematical inconsistency in Ampere's circuital law during capacitor charging. Write the expression for the displacement current in terms of the rate of change of electric flux.
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => toggleSolve('w18')}
                className="px-5 py-2.5 font-bold text-xs rounded-xl bg-slate-900 hover:bg-[#FF6B00] text-white cursor-pointer transition-all uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" /> {solvedState['w18'] ? 'Hide Complete Derivation' : 'View Complete Derivation Steps'}
              </button>
            </div>

            {solvedState['w18'] && (
              <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-100 text-xs text-slate-705 space-y-4 font-mono leading-relaxed">
                <div>
                  <h4 className="font-sans font-extrabold text-slate-900 text-[10px] uppercase">1. Inconsistency Identification:</h4>
                  <p className="font-sans text-slate-600 mt-1">Applying Ampere's law (Line integral of B•dl = μ_0 I) to a loop outside a capacitor plate gives a non-zero magnetic field. But applying it to a loop enclosing the region between plates initially gives zero, since no conducting current runs in the gap. This violates loop continuity constraints.</p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-sans font-extrabold text-slate-900 text-[10px] uppercase">2. Maxwell's Displacement Current Solution:</h4>
                  <p className="font-sans text-slate-600 mt-1">Maxwell generalized that changing electric flux itself acts as a virtual current, named the displacement current:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded text-[11px]">
                    I_d = ε_0 * (dФ_E / dt)
                  </code>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-sans font-extrabold text-slate-900 text-[10px] uppercase">3. Final Unified Mathematical Law:</h4>
                  <p className="font-sans text-slate-600 mt-1">The Ampere-Maxwell equation is written as:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded">
                    ∮ B • dl = μ_0 * ( I_c + I_d )<br/>
                    ∮ B • dl = μ_0 * [ I_c + ε_0 * (dФ_E / dt) ]
                  </code>
                  <p className="font-sans text-slate-500 mt-2">Where I_c is the conduction current and I_d is the displacement current. This equation holds true across all boundary regions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-[#FF6B00] font-mono font-black uppercase font-black">SECTION E: DETAILED ATMOSPHERE ANALYSIS (4 Marks)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 6 of 7</span>
          </div>

          {/* Atmospheric Case Study */}
          <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                19
              </span>
              <div>
                <span className="text-[10px] uppercase font-black text-indigo-650 text-[#FF6B00] tracking-widest block mb-0.5">ATMOSPHERE REVIEWS</span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                  Sources & Atmospheric Effects of EM Waves:
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  Electromagnetic waves have varying interactions with the Earth's atmosphere. While the ozone layer intercepts high-frequency UV vectors, infrared waves are trapped by carbon gases to sustain warm temperatures.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pl-2 border-l-2 border-sky-350 border-sky-350 text-xs">
              <div className="space-y-1">
                <p className="font-extrabold text-slate-800">(i) Solar radiation reaching the Earth's upper layer propagates primarily as:</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Option (a):</span>
                  <span className="font-bold text-slate-700">transverse electromagnetic wave.</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-2">
                <p className="font-extrabold text-slate-800">(ii) Greenhouse effect is primarily triggered by which of the following:</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Option (a):</span>
                  <span className="font-bold text-slate-700">Infrared rays (trapped by greenhouse gases).</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-2">
                <p className="font-extrabold text-slate-800">(iii) Biological importance of the ozone layer is that:</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Option (a):</span>
                  <span className="font-bold text-slate-700">it completely blocks sterilizing ultraviolet rays.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-sky-500 font-mono font-black uppercase">SECTION E: COMPLETE SPECTRUM HIGHLIGHTS (4 Marks)</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Page 7 of 7</span>
          </div>

          {/* Spectrum Case Study 20 */}
          <div className="glass-panel p-5 space-y-4 border border-slate-200 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                20
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Multiple-Choice Case study Questions (Class XII Blueprint):
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 pl-2 border-l-2 border-indigo-200 text-xs">
              <div className="space-y-1.5">
                <p className="font-extrabold text-slate-800">(i) Which of the following has the longest wavelength in the electromagnetic spectrum?</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Correct Option (d):</span>
                  <span className="font-bold text-slate-705">radiowaves</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-2">
                <p className="font-extrabold text-slate-800">(ii) Which one of the following is NOT of electromagnetic origin?</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Correct Option (c):</span>
                  <span className="font-bold text-slate-705">cathode rays (they are high-speed electron beams).</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-2">
                <p className="font-extrabold text-slate-800">(iii) Which sequence matches the correct decreasing order of wavelengths?</p>
                <div className="flex gap-2">
                  <span className="p-0.5 px-1.5 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold rounded border border-emerald-200 uppercase">Correct Option (a):</span>
                  <span className="font-bold text-slate-705">microwave &gt; infrared &gt; ultraviolet &gt; gamma rays</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-indigo-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed relative">
              <span className="absolute right-3.5 top-3.5 text-xs text-sky-400 font-bold font-sans uppercase">Wavelength formula</span>
              <p className="text-white font-extrabold">Wave Equation relation:</p>
              <code className="block text-emerald-400 my-1">
                λ_microwave &gt; λ_infrared &gt; λ_ultraviolet &gt; λ_gamma
              </code>
              <p className="text-slate-400 mt-1">Since frequency f is inversely proportional to λ (c = f λ), this matches their opposing high frequency sequences.</p>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Page not found</div>;
  }
}

// ==========================================
// CENTRAL ROUTER FUNCTION EXPORTED TO PDFS
// ==========================================

export function renderPracticePage(type: 'emi' | 'emw', page: number) {
  if (type === 'emi') {
    return <EMIPracticePage pageNum={page} />;
  } else {
    return <EMWPracticePage pageNum={page} />;
  }
}
