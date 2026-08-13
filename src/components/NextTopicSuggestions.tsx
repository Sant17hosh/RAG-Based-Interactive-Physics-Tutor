import React from 'react';
import { ArrowRight, GitFork } from 'lucide-react';

interface NextTopicSuggestionsProps {
  nextTopics: string[];
  currentTopic: string;
  onSelectTopic: (topic: string) => void;
}

export default function NextTopicSuggestions({ nextTopics, currentTopic, onSelectTopic }: NextTopicSuggestionsProps) {
  if (!nextTopics || nextTopics.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-2xl">
        No topic recommendations available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <GitFork className="w-5 h-5 text-[#FF6B00]" />
        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Concept Study Roadmap</h3>
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        Below is the logical progression of physics topics linked to **{currentTopic}**. Click any topic box to study it next.
      </p>

      {/* Flowchart container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 overflow-x-auto custom-scrollbar" id="next-topics-flowchart">
        
        {/* Current Topic Indicator (Start of Flow) */}
        <div className="flex flex-col items-center justify-center p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-center shadow-sm min-w-[150px] max-w-[180px]">
          <span className="text-[8px] font-black uppercase text-[#FF6B00] tracking-wider mb-0.5">Current Concept</span>
          <span className="text-xs font-black text-slate-800 line-clamp-1">{currentTopic}</span>
        </div>

        {/* Roadmap Arrows and Recommendations */}
        {nextTopics.map((topic, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center justify-center text-orange-400 rotate-90 md:rotate-0">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            <button
              onClick={() => onSelectTopic(topic)}
              className="group flex flex-col items-center justify-center p-3.5 bg-white border border-slate-150 hover:border-orange-300 hover:shadow-md rounded-xl text-center transition-all duration-200 cursor-pointer min-w-[150px] max-w-[180px] select-none"
              style={{ contentVisibility: 'auto' }}
            >
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Topic {index + 1}</span>
              <span className="text-xs font-extrabold text-slate-750 text-slate-750 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{topic}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
