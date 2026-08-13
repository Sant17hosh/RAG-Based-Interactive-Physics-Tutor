import React, { useState, useEffect } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { BookOpen } from 'lucide-react';
import ChapterStudyView from './ChapterStudyView';
import { ExamReport } from '../types';

interface ChaptersIndexProps {
  onNavigateToGrader: (questionText: string, rubric: string[], marks: number) => void;
  onAddScore: (points: number) => void;
  onAddReport: (report: ExamReport) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ChaptersIndex({ onNavigateToGrader, onAddScore, onAddReport, onNavigateToTab }: ChaptersIndexProps) {
  const [activeChapterId, setActiveChapterId] = useState<number>(() => {
    return Number(localStorage.getItem('tim_recent_chapter') || '1');
  });

  const handleSelectChapter = (chId: number) => {
    setActiveChapterId(chId);
    localStorage.setItem('tim_recent_chapter', chId.toString());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in text-slate-800 font-sans" id="chapters-index-container">
      {/* Search selection sidebar */}
      <div className="lg:col-span-1 glass-panel p-5 space-y-4 max-h-[650px] overflow-y-auto custom-scrollbar" id="chapters-sidebar-list">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5 select-none">
          <BookOpen className="w-4 h-4 text-[#FF6B00]" /> Chapters Path
        </h2>
        <div className="space-y-1.5">
          {CHANNELS_PUC_DATA.map((ch) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold flex flex-col transition-all cursor-pointer border select-none ${
                activeChapterId === ch.id
                  ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50/40 hover:text-[#FF6B00]'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-[9px] text-slate-400 font-bold">Chapter {ch.id}</span>
                <span className="text-[9px] bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded text-[#FF6B00] font-mono font-black">{ch.weightage}</span>
              </div>
              <span className="mt-1 font-extrabold text-slate-800">{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chapter Details Study Layout */}
      <div className="lg:col-span-3 space-y-6" id="chapter-main-panel">
        <ChapterStudyView 
          chapterId={activeChapterId}
          onNavigateToTab={onNavigateToTab}
          onAddScore={onAddScore}
          onAddReport={onAddReport}
        />
      </div>
    </div>
  );
}
