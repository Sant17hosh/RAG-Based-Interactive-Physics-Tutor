import React, { useState } from 'react';
import PracticeEMIInteractiveGuide from './PracticeEMIInteractiveGuide';
import { Layers, Info, BookOpen, Wrench, Play, Eye, ClipboardList, HelpCircle, Sparkles } from 'lucide-react';

interface ExperimentItem {
  id: number;
  title: string;
  objective: string;
  theory: string;
  materials: string[];
  procedure: string[];
  observation: string;
  result: string;
  application: string;
  vivaQuestions: Array<{ q: string; ans: string }>;
}

const EXPERIMENT_DATA: ExperimentItem[] = [
  {
    id: 1,
    title: "Experiment 1: Faraday's Induction & Magnetic Flux Deflections",
    objective: "To verify Faraday's laws of electromagnetic induction and Lenz's law by observing current impulses induced in a wire coil by moving magnet sweeps.",
    theory: "Whenever the magnetic flux linking a circuit changes, an electromotive force (EMF) is induced. e = -dФ_B / dt. The induced polarity opposes the motion, complying with Lenz's Law and energy conservation.",
    materials: [
      "Vibrant insulated copper solenoid coil (100 to 500 turns)",
      "Strong NdFeB neodymium cylindrical bar magnet",
      "Center-zero sensitive galvanometer",
      "Connecting copper terminals",
      "Solenoid support armature structure"
    ],
    procedure: [
      "Connect the copper wire solenoid directly to the sensitive galvanometer.",
      "Thrust the North pole of the bar magnet rapidly into the solenoid core. Observe the galvanometric needle deflection.",
      "Hold the magnet static inside the coil core. Verify the galvanometer needle returns instantly to zero.",
      "Pull the magnet rapidly away from the solenoid. Observe the needle deflecting in the opposite direction.",
      "Vary thrust speed and turns ratio N. Verify needle deflection magnitudes spike under rapid sweeps."
    ],
    observation: "A moving magnetic field generates temporary deflection spikes on the galvanometer. Forward thrusts deflection polarity is opposite to receding pull deflections. A stationary magnet yields zero deflection.",
    result: "Michael Faraday's laws of electromagnetic induction are verified. Lenz's direction law is confirmed by polarity oppositions.",
    application: "Foundational principal behind power plant alternators, dynamos, current transformers, induction stove tops, cell chargers, and magnetic train braking.",
    vivaQuestions: [
      { q: "What does the galvanometer needle deflection indicate?", ans: "It indicates a transient current flows inside the solenoid, induced by changing magnetic flux linkages." },
      { q: "Why is the deflection zero when the magnet is stationary inside the coil?", ans: "Though the magnetic field is high, the rate of change of magnetic flux dФ/dt is exactly zero, yielding zero induced EMF." },
      { q: "How is Lenz's law linked to energy conservation?", ans: "Work expended in pushing the magnet against opposing induced fields converts directly into electrical heat energy inside the solenoid loops." }
    ]
  },
  {
    id: 2,
    title: "Experiment 2: Wave spectrum and displacement current capacitor charging",
    objective: "To measure displacement current and prove current continuity across parallel plate charging capacitors.",
    theory: "Conduction current I_c exists in wires, whereas displacement current I_d exists in the vacuum gap between plates, maintaining unified path loops: I_d = ε_0 * (dФ_E / dt).",
    materials: [
      "Dual parallel plate capacitors with area A and separation d",
      "High frequency alternating voltage generator",
      "AC micro-ammeter",
      "Connecting copper wire loops"
    ],
    procedure: [
      "Wire the parallel plate capacitor in series with the AC micro-ammeter.",
      "Start the frequency generator at 100 kHz. Verify AC current flows continuously.",
      "Insert a glass slab inside the plate gap. Measure current amplitude shifts.",
      "Formulate displacement current values matching electric flux rate parameters."
    ],
    observation: "Current flows through the open plate gap without physical contact, driven by shifting electric flux parameters inside the dielectric.",
    result: "Maxwell's displacement current continuity is verified.",
    application: "Radio tuning aerial networks, high-frequency capacitor design, and coupled wave spectrum transmission.",
    vivaQuestions: [
      { q: "What is displacement current?", ans: "A current parameter representing changing electric flux fields over time inside insulating spaces." },
      { q: "Does displacement current produce a magnetic field?", ans: "Yes, displacement currents have identical magnetic effects as conduction currents, satisfying the Ampere-Maxwell unified curl equation." }
    ]
  }
];

export default function VirtualLab() {
  const [selectedExpId, setSelectedExpId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('objective');

  const exp = EXPERIMENT_DATA.find(e => e.id === selectedExpId) || EXPERIMENT_DATA[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-800" id="virtual-lab-module">
      {/* Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-205 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            TIM Physics Labs • Simulation Workspace
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-orange-500" /> Virtual Physics Lab
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Interact with high-fidelity physical models, verify laws, and review procedures with corresponding viva prep questions.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-xl">
        {EXPERIMENT_DATA.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExpId(e.id)}
            className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center text-center ${
              selectedExpId === e.id
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <span>Exp {e.id}: {e.title.split(":")[0].replace("Experiment", "")}</span>
          </button>
        ))}
      </div>

      {/* Internal Tabs menu */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'objective', label: 'Objective', icon: Info },
          { id: 'theory', label: 'Theory', icon: BookOpen },
          { id: 'materials', label: 'Materials', icon: Wrench },
          { id: 'simulation', label: 'Simulation', icon: Play },
          { id: 'procedure', label: 'Procedure', icon: ClipboardList },
          { id: 'viva', label: 'Viva Questions', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none shrink-0 ${
                isActive ? 'bg-white text-orange-600 shadow-sm border border-slate-200' : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel container */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl min-h-[400px]">
        {activeTab === 'objective' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Objective</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{exp.objective}</p>
            
            <h3 className="text-sm font-black text-slate-800 pt-2 uppercase tracking-wide">Application</h3>
            <p className="text-xs text-slate-605 text-slate-600 leading-relaxed font-semibold">{exp.application}</p>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Theory</h3>
            <p className="text-xs text-slate-655 text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">{exp.theory}</p>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Materials & Apparatus Required</h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 font-semibold">
              {exp.materials.map((m, idx) => <li key={idx}>{m}</li>)}
            </ul>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Simulation Sandbox</h3>
            {exp.id === 1 ? (
              <div className="space-y-4">
                <PracticeEMIInteractiveGuide />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs">
                <Sparkles className="w-10 h-10 text-orange-400 mx-auto animate-pulse mb-2" />
                Select Experiment 1 to run the live Faraday magnetic flux sweeps simulator!
              </div>
            )}
          </div>
        )}

        {activeTab === 'procedure' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Procedure</h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 font-semibold leading-relaxed">
              {exp.procedure.map((step, idx) => <li key={idx}>{step}</li>)}
            </ol>

            <h3 className="text-sm font-black text-slate-800 pt-4 uppercase tracking-wide">Observations</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">{exp.observation}</p>

            <h3 className="text-sm font-black text-slate-800 pt-2 uppercase tracking-wide">Result</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">{exp.result}</p>
          </div>
        )}

        {activeTab === 'viva' && (
          <div className="space-y-4 animate-fade-in font-sans">
            <h3 className="text-base font-black text-slate-800 border-b pb-2">Viva Questions</h3>
            <div className="space-y-4">
              {exp.vivaQuestions.map((v, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-1 bg-slate-50">
                  <h4 className="text-xs font-extrabold text-slate-800 flex gap-2">
                    <span className="text-[#FF6B00]">Q {idx + 1}:</span> {v.q}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-1.5 pl-7 border-l-2 border-slate-300 italic">Ans: {v.ans}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
