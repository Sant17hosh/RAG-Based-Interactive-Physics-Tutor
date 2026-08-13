import React, { useState, useEffect } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { Sparkles, FileText, ChevronRight, HelpCircle, Star, Award } from 'lucide-react';

interface SummaryContent {
  keyPoints: string[];
  definitions: Array<{ term: string; explanation: string }>;
  examples: string[];
  importantQuestions: Array<{ q: string; ans: string }>;
  quickRevision: string[];
  examTips: string[];
}

const STATIC_SUMMARIES: Record<number, SummaryContent> = {
  6: {
    keyPoints: [
      "Electromagnetic induction generates potential differences wirelessly across adjacent copper wire coils.",
      "The change in magnetic flux linkage over time acts as the absolute trigger for induced electromotive force.",
      "Lenz's opposition represents the thermodynamic compliance of energy conservation in closed fields.",
      "Bulk metal pieces generate swirling volume loop paths called Eddy currents when subjected to changing fluxes."
    ],
    definitions: [
      { term: "Magnetic Flux (Ф_B)", explanation: "The count of parallel magnetic field lines intersecting a conductive coil cross-section: Ф_B = B • A • cos(θ)." },
      { term: "Motional EMF (e)", explanation: "The potential difference generated across a sliding conductor moving inside magnetic fields: e = B * v * l." },
      { term: "Self-Inductance (L)", explanation: "The ratio of total magnetic flux linkages to the current passing inside the coil: Ф = L * I." }
    ],
    examples: [
      "Thrusting a bar magnet rapidly into a wire solenoid creates galvanometer spikes.",
      "Switching key tap events on concentrically wound primary coils sparks induction in adjacent secondaries.",
      "Industrial electromagnetic braking loops in high-speed trains damp movement through Eddy resistance."
    ],
    importantQuestions: [
      { q: "State Faraday's laws of induction.", ans: "First Law: EMF is induced when linking flux changes. Second Law: induced voltage magnitude equals rate of flux change (e = -dФ_B / dt)." },
      { q: "Explain how Lenz's law complies with energy conservation.", ans: "If induced currents didn't oppose magnet insertion, the magnet would accelerate infinitely without external work. Mechanical work done against repulsion is converted into electrical heating." }
    ],
    quickRevision: [
      "Ф_B = B • A • cos(θ) • Wb",
      "e = -N * (dФ / dt) • Volts",
      "L = μ_0 * N^2 * A / l • Henry",
      "AC peak value e_0 = N * B * A * ω • sin(ωt)"
    ],
    examTips: [
      "State the physical assumptions of variables first in 5-mark proofs.",
      "SI Dimensions are critical. State Weber (Wb) and Henry (H) properly.",
      "Always sketch U-shaped sliding rail layouts for motional EMF."
    ]
  },
  8: {
    keyPoints: [
      "Displacement currents resolve Ampere's circuital law contradictions inside charging capacitor gaps.",
      "Accelerated or oscillating electric charges radiate electromagnetic waves wirelessly across space.",
      "Oscillating electric and magnetic fields propagate transverse and coupled at light speed c in vacuum.",
      "The electromagnetic spectrum organizes wave ranges by decreasing frequency: radio, microwave, IR, visible, UV, X-ray, gamma."
    ],
    definitions: [
      { term: "Displacement Current (I_d)", explanation: "A virtual current arising from time-varying electric field flux: I_d = ε_0 * (dФ_E / dt)." },
      { term: "Electromagnetic Wave", explanation: "Coupled sinusoidal oscillating electric and magnetic fields propagating transverse to each other through space." },
      { term: "Poynting Vector (S)", explanation: "A vector representing the rate of energy transfer per unit area of an electromagnetic wave." }
    ],
    examples: [
      "AC current continuity across parallel plate capacitor charging wires and vacuum gaps.",
      "Radio waves carrying telecommunication cell signals from transceiver aerials.",
      "Oven microwave frequencies resonant-vibrating water molecules to heat food."
    ],
    importantQuestions: [
      { q: "State the inconsistency identified by Maxwell in Ampere's law.", ans: "Outside plates, conduction current yields B ≠ 0. Inside the gap, conduction current is 0, implying B = 0 boundary mismatch. Maxwell solved this by defining displacement current inside the plates." },
      { q: "Why welders goggles protect eyes from welding arcs?", ans: "Welding arcs produce high volumes of Ultraviolet (UV) radiation. Goggles strongly absorb UV rays, preventing ocular sunburn or retina damage." }
    ],
    quickRevision: [
      "I_d = ε_0 * (dФ_E / dt) • Ampere",
      "c = 1 / sqrt(μ_0 * ε_0) ≈ 3 * 10^8 m/s",
      "E_0 / B_0 = c • wave fields ratio",
      "Wave vector k = 2 * π / λ • speed c = ω / k"
    ],
    examTips: [
      "All spectral divisions travel at exact speed c in void vacuum.",
      "State displacement current produces identical magnetic induction as conduction currents.",
      "Practice drawing transverse propagation charts with sinusoidal axes."
    ]
  }
};

export default function SummaryNotes() {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(CHANNELS_PUC_DATA[0].id);
  const [summary, setSummary] = useState<SummaryContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [customSummaryText, setCustomSummaryText] = useState<string>('');

  useEffect(() => {
    // Reset custom summary and load static fallback summary
    setCustomSummaryText('');
    setSummary(STATIC_SUMMARIES[selectedChapterId] || STATIC_SUMMARIES[6]);
  }, [selectedChapterId]);

  const generateSummaryWithAI = async () => {
    setLoading(true);
    setCustomSummaryText('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate structured Summary Notes for Chapter: "${CHANNELS_PUC_DATA.find(c => c.id === selectedChapterId)?.name}". Output should list Key Points, Definitions, Examples, Important Questions, Quick Revision, and Exam Tips. Do not use LaTeX.`,
          chapterId: selectedChapterId,
          bloomLevel: 'Understand',
          includeExample: true
        })
      });
      const data = await response.json();
      setCustomSummaryText(data.content);
    } catch (e) {
      setCustomSummaryText("Offline RAG compiler generated fallback. Check Ollama daemon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800" id="summary-notes-module">
      {/* Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            Physics AI Lounge • Lecture Summaries
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" /> AI Summary Notes Desk
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Query the vector database for Class 11 physics summaries containing key concepts, examples, and exam review sheets.
          </p>
        </div>
        <button
          onClick={generateSummaryWithAI}
          disabled={loading}
          className="w-full md:w-auto px-4 py-2.5 font-bold text-xs bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:brightness-110 active:scale-95 text-white rounded-xl shadow cursor-pointer disabled:opacity-50 select-none uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0"
        >
          {loading ? 'Compiling AI summary...' : 'Regenerate summary with AI'}
        </button>
      </div>

      {/* Selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 max-w-md">
        {CHANNELS_PUC_DATA.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapterId(ch.id)}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
              selectedChapterId === ch.id
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <span>Chapter {ch.id}: {ch.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main summary view content */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[400px]">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#FF6B00] animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Querying local LLM container...</span>
          </div>
        ) : customSummaryText ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-705 font-bold">
            {customSummaryText}
          </div>
        ) : summary ? (
          <div className="space-y-8 font-sans">
            {/* Key Points */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-[#FF6B00] font-black">■</span> Key Points
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 leading-relaxed font-semibold">
                {summary.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>

            {/* Definitions */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-[#FF6B00] font-black">■</span> Important Definitions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summary.definitions.map((d, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-150 bg-slate-50 space-y-1">
                    <span className="text-xs font-extrabold text-orange-700 font-mono">{d.term}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold mt-1">{d.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-[#FF6B00] font-black">■</span> Practical Examples
              </h3>
              <ul className="list-decimal pl-5 space-y-2 text-xs text-slate-650 leading-relaxed font-semibold">
                {summary.examples.map((ex, i) => <li key={i}>{ex}</li>)}
              </ul>
            </div>

            {/* Important Qs */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-[#FF6B00] font-black">■</span> Important Board Questions
              </h3>
              <div className="space-y-3">
                {summary.importantQuestions.map((q, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl space-y-1 bg-slate-50">
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 leading-snug">
                      <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" /> {q.q}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold mt-1.5 pl-5 border-l-2 border-slate-300 italic">Ans: {q.ans}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Revision */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-[#FF6B00] font-black">■</span> Quick Revision Cheat-sheet
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {summary.quickRevision.map((rev, i) => (
                  <div key={i} className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl text-xs font-mono font-bold text-orange-850 text-orange-700">
                    {rev}
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Tips */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="text-amber-500 font-black"><Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" /></span> Exam Tips to Secure Centum
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-orange-850 text-orange-700 leading-relaxed font-semibold bg-[#FFF8F2] border border-[#FFEBDB] p-4 rounded-2xl">
                {summary.examTips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 font-bold text-xs">
            Select a chapter to review summary logs.
          </div>
        )}
      </div>
    </div>
  );
}
