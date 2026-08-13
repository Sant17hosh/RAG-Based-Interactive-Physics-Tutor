import React, { useState } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { Download, Sparkles, Sigma, Info, Star, Printer } from 'lucide-react';

interface FormulaItem {
  name: string;
  expression: string;
  definition: string;
  unit: string;
  derivationSummary: string;
  examTips: string;
}

const FORMULA_SHEET_DATA: Record<number, FormulaItem[]> = {
  6: [
    {
      name: "Magnetic Flux",
      expression: "Ф_B = B • A • cos(θ)",
      definition: "The total measure of the magnetic field passing normally through a given area.",
      unit: "Weber (Wb) or Tesla-meter² (T m²)",
      derivationSummary: "Defined as the dot product of Magnetic Field vector B and Area vector A.",
      examTips: "θ is the angle between B and the normal (perpendicular) to the loop surface. Watch out for questions stating the angle with the plane of the coil (which is 90° - θ)."
    },
    {
      name: "Faraday's Law of Induction",
      expression: "e = -dФ_B / dt",
      definition: "The induced electromotive force (EMF) in any closed circuit is equal to the negative rate of change of the magnetic flux linked with the circuit.",
      unit: "Volt (V)",
      derivationSummary: "Empirically derived from Faraday's experiments moving a bar magnet in/out of a coil.",
      examTips: "For N turns, use e = -N * (dФ_B / dt). The negative sign represents Lenz's law opposing the flux change."
    },
    {
      name: "Motional EMF",
      expression: "e = B * v * l",
      definition: "The potential difference induced across the ends of a conducting rod moving perpendicular to a magnetic field.",
      unit: "Volt (V)",
      derivationSummary: "Free electrons experience a magnetic Lorentz force F = q(v x B). In steady-state, electrostatic field balances this force, generating potential difference e = Bvl.",
      examTips: "This 5-mark derivation is very common. Sketch the U-shaped conducting rails and describe the swept area dx/dt = v."
    },
    {
      name: "Self-Inductance (Solenoid)",
      expression: "L = μ_0 * N^2 * A / l",
      definition: "The coefficient of self-induction indicating a coil's electromagnetic inertia to current change.",
      unit: "Henry (H)",
      derivationSummary: "Total flux N*Ф_B = L*I. Substituting B = μ_0*(N/l)*I inside Ф_B = B*A yields L = μ_0*N^2*A/l.",
      examTips: "Self-inductance depends only on geometry (N, A, l) and core permeability. It is independent of the current flowing."
    }
  ],
  8: [
    {
      name: "Displacement Current",
      expression: "I_d = ε_0 * (dФ_E / dt)",
      definition: "A virtual current arising from the time-varying electric field / electric flux, maintaining circuit continuity inside capacitor dielectrics.",
      unit: "Ampere (A)",
      derivationSummary: "Derived by Maxwell using the rate of change of electric flux Ф_E = q / ε_0 in a charging parallel plate capacitor.",
      examTips: "State that displacement current behaves exactly like conduction current in producing magnetic fields."
    },
    {
      name: "Speed of EM Waves (Vacuum)",
      expression: "c = 1 / sqrt(μ_0 * ε_0)",
      definition: "The constant propagation speed of electromagnetic waves in vacuum.",
      unit: "Meters per second (m/s) ≈ 3 * 10^8 m/s",
      derivationSummary: "Obtained by solving Maxwell's equations in vacuum, proving light is an electromagnetic wave.",
      examTips: "Confirm that c = f * λ. All spectral bands (radio to gamma) share this exact speed in vacuum."
    },
    {
      name: "EM Wave Fields Relation",
      expression: "E_0 / B_0 = c",
      definition: "The constant ratio of the electric field amplitude to the magnetic field amplitude at any point in an electromagnetic wave.",
      unit: "Dimensionless (c is in m/s)",
      derivationSummary: "Derived directly from the coupled Maxwell curl equations.",
      examTips: "Electric fields have much higher numerical values than magnetic fields (B_0 = E_0 / c), but both carry equal energy density."
    }
  ]
};

export default function FormulaSheet() {
  const [selectedChapterId, setSelectedChapterId] = useState<number | 'all'>('all');

  const handlePrint = () => {
    window.print();
  };

  const getFilteredFormulas = () => {
    if (selectedChapterId === 'all') {
      return Object.entries(FORMULA_SHEET_DATA).flatMap(([chId, formulas]) => 
        formulas.map(f => ({ ...f, chapterId: Number(chId) }))
      );
    }
    return (FORMULA_SHEET_DATA[selectedChapterId] || []).map(f => ({ ...f, chapterId: selectedChapterId }));
  };

  const activeFormulas = getFilteredFormulas();

  return (
    <div className="space-y-6 animate-fade-in text-slate-800" id="formula-sheet-module">
      {/* Header card */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-sm print:hidden">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            Physics Companion • Reference Desk
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sigma className="w-8 h-8 text-[#FF6B00]" /> Formula Sheets Hub
          </h1>
          <p className="text-xs text-slate-500 font-semibold max-w-2xl">
            Review definitions, SI units, derivation outlines, and crucial board exam tips for important equations.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="w-full md:w-auto px-4 py-2.5 font-bold text-xs bg-slate-900 text-white rounded-xl shadow cursor-pointer hover:bg-slate-800 transition-all select-none uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-2 pb-2 border-b border-slate-200 print:hidden overflow-x-auto">
        <button
          onClick={() => setSelectedChapterId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border select-none shrink-0 ${
            selectedChapterId === 'all'
              ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow'
              : 'bg-white text-slate-650 border-slate-200 hover:bg-orange-50/50'
          }`}
        >
          All Chapter Formulae
        </button>
        {CHANNELS_PUC_DATA.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapterId(ch.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border select-none shrink-0 ${
              selectedChapterId === ch.id
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow'
                : 'bg-white text-slate-650 border-slate-200 hover:bg-orange-50/50'
            }`}
          >
            Chapter {ch.id}: {ch.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Formulae list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="formulae-sheets-list">
        {activeFormulas.map((f, i) => {
          const chName = CHANNELS_PUC_DATA.find(c => c.id === f.chapterId)?.name || 'Physics';
          return (
            <div key={i} className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-orange-200 transition-all font-sans print:border-slate-400 print:shadow-none">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-wider block font-mono">
                      Chapter {f.chapterId} • {chName}
                    </span>
                    <h3 className="text-base font-black text-slate-800 mt-1 leading-snug">{f.name}</h3>
                  </div>
                  <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-mono font-bold shrink-0">
                    Eq {i + 1}
                  </span>
                </div>

                {/* Equation Expression banner */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center shadow-inner print:border-slate-400">
                  <code className="text-sm md:text-base font-mono font-black text-orange-700 bg-transparent py-0.5 select-all">{f.expression}</code>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wide">Definition:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed font-semibold">{f.definition}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[10px] bg-orange-50 border border-orange-100 text-[#FF6B00] font-mono px-1 rounded shrink-0 leading-none mt-1 py-0.5 font-black uppercase">SI</span>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wide">Standard Unit:</span>
                      <p className="text-slate-750 font-bold text-slate-800 mt-0.5 font-mono">{f.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Sigma className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wide">Derivation Outline:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed font-semibold">{f.derivationSummary}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Tip alert */}
              <div className="mt-4 pt-4 border-t border-slate-100 bg-[#FFF8F2] border border-[#FFEBDB] p-3 rounded-xl flex gap-2 text-xs leading-relaxed text-orange-700 font-sans print:border-slate-300">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 mt-0.5 shrink-0" />
                <div>
                  <strong>Syllabus Tip:</strong> {f.examTips}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
