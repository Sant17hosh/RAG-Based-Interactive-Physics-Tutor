import React, { useState } from 'react';
import { ExperimentRecommendation } from '../services/recommendationService';
import { FlaskConical, ClipboardList, Eye, CheckCircle, X, Check, RefreshCw } from 'lucide-react';
import PracticeEMIInteractiveGuide from './PracticeEMIInteractiveGuide';

interface ExperimentRecommendationsProps {
  experiments: ExperimentRecommendation[];
  approvedExperiment: ExperimentRecommendation | null;
  onToggleApproveExperiment: (exp: ExperimentRecommendation) => void;
  onRefineExperiment: (prompt: string) => Promise<void>;
  refineLoading: boolean;
  readOnly?: boolean;
}

export default function ExperimentRecommendations({
  experiments,
  approvedExperiment,
  onToggleApproveExperiment,
  onRefineExperiment,
  refineLoading,
  readOnly = false
}: ExperimentRecommendationsProps) {
  const [showLab, setShowLab] = useState<boolean>(false);
  const [refinementInput, setRefinementInput] = useState<string>('');

  if (!experiments || experiments.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-2xl">
        No experiment recommendations available.
      </div>
    );
  }

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || refineLoading) return;
    await onRefineExperiment(refinementInput);
    setRefinementInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Recommended Laboratory Experiment</h3>
        </div>
        {!readOnly && approvedExperiment && (
          <span className="text-[10px] text-emerald-600 font-black uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3px]" />
            <span>Approved</span>
          </span>
        )}
      </div>

      <div className="space-y-6" id="experiments-container">
        {experiments.map((exp, idx) => {
          const isApproved = approvedExperiment?.title === exp.title;
          return (
            <div
              key={idx}
              className={`glass-panel p-6 border bg-[#FFFFFF] relative overflow-hidden transition-all duration-300 ${
                isApproved ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-slate-100'
              }`}
            >
              <div className={`absolute top-0 inset-x-0 h-1 ${isApproved ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}></div>

              <div className="space-y-5">
                {/* Title Section */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-[#FF6B00] border border-orange-200">
                      NCERT Laboratory Guide
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{exp.title}</h4>
                  </div>
                  <div className={`p-3 border rounded-xl transition-colors ${isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-[#FF6B00]'}`}>
                    <FlaskConical className="w-5 h-5" />
                  </div>
                </div>

                {/* Materials Required */}
                {exp.materials && exp.materials.length > 0 && (
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-700 tracking-wider">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span>Materials Required</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-100 text-slate-600 rounded-xl"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Procedure */}
                {exp.procedure && exp.procedure.length > 0 && (
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-700 tracking-wider">
                      <ClipboardList className="w-3.5 h-3.5 text-orange-500" />
                      <span>Experimental Procedure</span>
                    </div>
                    <ol className="list-decimal pl-5 text-xs text-slate-600 font-medium space-y-2 leading-relaxed">
                      {exp.procedure.map((step, i) => (
                        <li key={i} className="pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Expected Observation */}
                {exp.observation && (
                  <div className="p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl space-y-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#FF6B00] tracking-wider">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Expected Scientific Observation</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                      "{exp.observation}"
                    </p>
                  </div>
                )}

                {/* Approval & Lab Simulator Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowLab(true)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <FlaskConical className="w-4 h-4 text-orange-400" />
                    <span>🧪 Launch Simulator</span>
                  </button>
                  
                  {!readOnly && (
                    <button
                      onClick={() => onToggleApproveExperiment(exp)}
                      className={`w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Check className={`w-4 h-4 ${isApproved ? 'stroke-[3px]' : ''}`} />
                      <span>{isApproved ? 'Approved Lab' : 'Approve Lab'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Experiment prompt feedback refinement loops */}
      {!readOnly && (
        <form onSubmit={handleRefineSubmit} className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Refine Experiment Design</span>
            <span className="text-[9px] font-bold text-[#FF6B00] uppercase tracking-wider bg-orange-100/50 px-2 py-0.5 rounded-full">
              Prompt Loop
            </span>
          </div>
          <p className="text-[11px] text-slate-550 font-semibold leading-relaxed">
            Suggest changes to this experiment (e.g. <i>"use simpler household materials"</i> or <i>"explain how we record values in steps"</i>) to trigger AI re-generation.
          </p>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              className="flex-1 bg-white border border-slate-200 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none"
              placeholder="e.g. Can we perform this with simple magnets and compasses at home?..."
              disabled={refineLoading}
            />
            <button
              type="submit"
              disabled={refineLoading || !refinementInput.trim()}
              className="px-4 py-2 bg-[#FF6B00] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 disabled:bg-slate-100 disabled:text-slate-400 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {refineLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Refining...</span>
                </>
              ) : (
                <span>Refine Experiment</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Physics Laboratory Simulation Workspace Modal Overlay */}
      {showLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 md:p-8 animate-fade-in text-left">
          <div className="relative w-full max-w-6xl bg-[#0B1329] border border-[#1B2A4A] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1B2A4A] flex justify-between items-center bg-[#070C1E]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">TIM Virtual Laboratory Workspace</h3>
              </div>
              <button 
                onClick={() => setShowLab(false)}
                className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Exit Laboratory</span>
              </button>
            </div>
            
            {/* Scrollable Laboratory Workspace */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#090D1A]">
              <div className="bg-[#0B1329] border border-[#1B2A4A] rounded-3xl p-5 shadow-inner">
                <PracticeEMIInteractiveGuide />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
