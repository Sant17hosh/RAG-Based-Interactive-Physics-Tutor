import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';

interface FeedbackPanelProps {
  onSubmitFeedback: (helpful: boolean, difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult') => void;
  savedFeedbackStatus?: { helpful: boolean; difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult' } | null;
}

export default function FeedbackPanel({ onSubmitFeedback, savedFeedbackStatus }: FeedbackPanelProps) {
  const [helpful, setHelpful] = useState<boolean | null>(savedFeedbackStatus ? savedFeedbackStatus.helpful : null);
  const [difficulty, setDifficulty] = useState<'Too Easy' | 'Perfect' | 'Too Difficult' | null>(
    savedFeedbackStatus ? savedFeedbackStatus.difficulty : null
  );
  const [submitted, setSubmitted] = useState<boolean>(!!savedFeedbackStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (helpful === null || difficulty === null) return;
    
    onSubmitFeedback(helpful, difficulty);
    setSubmitted(true);
  };

  const handleReset = () => {
    setHelpful(null);
    setDifficulty(null);
    setSubmitted(false);
  };

  return (
    <div className="glass-panel p-6 border-slate-100 bg-[#FFFFFF] relative overflow-hidden" id="feedback-panel-container">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-[#FF6B00]"></div>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center text-center py-4 space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Feedback Submitted!</h4>
            <p className="text-[11px] text-slate-500 font-medium max-w-sm">
              Thank you! Your responses have been saved and will calibrate the AI to serve better explanations and question sets.
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleReset}
            className="text-[10px] font-black uppercase text-[#FF6B00] hover:underline cursor-pointer select-none"
          >
            Update Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <h4 className="font-extrabold text-sm text-slate-850 text-slate-800 uppercase tracking-wider">Calibrate Learning Material</h4>
            <p className="text-[11px] text-slate-550 text-slate-500 font-medium">Was this explanation helpful? How was the difficulty rating?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Helpfulness Check */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Helpful Explanation?</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setHelpful(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    helpful === true
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setHelpful(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    helpful === false
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Not Helpful</span>
                </button>
              </div>
            </div>

            {/* Difficulty Calibration */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Calibrate Difficulty</label>
              <div className="flex gap-2">
                {(['Too Easy', 'Perfect', 'Too Difficult'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2 text-[10px] font-bold border rounded-xl text-center transition-all cursor-pointer select-none ${
                      difficulty === diff
                        ? 'bg-orange-50 border-orange-300 text-[#FF6B00] shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={helpful === null || difficulty === null}
              className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all select-none flex items-center justify-center gap-2 border ${
                helpful !== null && difficulty !== null
                  ? 'bg-[#FF6B00] border-transparent text-white hover:brightness-110 shadow-md shadow-orange-500/10 cursor-pointer'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
