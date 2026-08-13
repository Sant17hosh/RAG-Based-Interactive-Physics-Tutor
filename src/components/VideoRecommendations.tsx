import React, { useState } from 'react';
import { VideoRecommendation } from '../services/recommendationService';
import { Play, Video, X, Check, RefreshCw } from 'lucide-react';
import ConceptVideoPlayer, { TabId } from './ConceptVideoPlayer';

interface VideoRecommendationsProps {
  videos: VideoRecommendation[];
  selectedVideos: VideoRecommendation[];
  onToggleSelectVideo: (video: VideoRecommendation) => void;
  onRefineVideos: (prompt: string) => Promise<void>;
  refineLoading: boolean;
  readOnly?: boolean;
}

export default function VideoRecommendations({
  videos,
  selectedVideos,
  onToggleSelectVideo,
  onRefineVideos,
  refineLoading,
  readOnly = false
}: VideoRecommendationsProps) {
  const [activeVideoId, setActiveVideoId] = useState<TabId | null>(null);
  const [refinementInput, setRefinementInput] = useState<string>('');

  if (!videos || videos.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-2xl">
        No video recommendations available.
      </div>
    );
  }

  // Maps dynamic AI video titles to the 12 existing high-fidelity interactive player configurations
  const getTabIdFromTitle = (title: string, description: string): TabId => {
    const t = (title + ' ' + description).toLowerCase();
    if (t.includes('lenz')) return 'lenzs-law';
    if (t.includes('flux')) return 'magnetic-flux';
    if (t.includes('faraday') && (t.includes('law') || t.includes('second'))) return 'faraday-laws';
    if (t.includes('faraday') || t.includes('experiments')) return 'faraday-experiments';
    if (t.includes('self') && t.includes('induction')) return 'self-induction';
    if (t.includes('mutual') && t.includes('induction')) return 'mutual-induction';
    if (t.includes('motional') || t.includes('emf') || t.includes('conducting rod')) return 'motional-emf';
    if (t.includes('eddy') || t.includes('damping')) return 'eddy-currents';
    if (t.includes('generator') || t.includes('alternator') || t.includes('ac power')) return 'ac-generator';
    if (t.includes('displacement') || t.includes('capacitor')) return 'displacement-current';
    if (t.includes('propagation') || t.includes('3d sine')) return 'em-wave-propagation';
    if (t.includes('spectrum') || t.includes('radar') || t.includes('mnemonic')) return 'spectrum-radar';
    
    return 'faraday-laws';
  };

  const handlePlayVideo = (title: string, description: string) => {
    const resolvedId = getTabIdFromTitle(title, description);
    setActiveVideoId(resolvedId);
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || refineLoading) return;
    await onRefineVideos(refinementInput);
    setRefinementInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Recommended Learning Videos</h3>
        </div>
        {!readOnly && (
          <span className="text-[10px] text-slate-500 font-extrabold uppercase bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            Selected: {selectedVideos.length} of {videos.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="video-recommendations-grid">
        {videos.map((video, index) => {
          const isSelected = selectedVideos.some(v => v.title === video.title);
          return (
            <div
              key={index}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
                isSelected 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/25' 
                  : 'border-slate-150 hover:border-orange-250 hover:shadow-lg hover:shadow-orange-500/5'
              }`}
            >
              {/* Thumbnail with Video Play Overlay */}
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
                
                {/* Wave graphic */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.4)_0,transparent_100%)] pointer-events-none"></div>

                {/* Animated Play button */}
                <button 
                  onClick={() => handlePlayVideo(video.title, video.description)}
                  className="relative z-20 w-11 h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 active:scale-95 transition-all duration-350 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                <span className="absolute bottom-2 right-2 z-20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/90 text-orange-400">
                  TIM Video
                </span>
                
                {/* Selection Checkbox Overlay */}
                {!readOnly && (
                  <button
                    onClick={() => onToggleSelectVideo(video)}
                    className={`absolute top-2 left-2 z-20 p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-900/80 text-white/70 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[3px]' : 'opacity-0'}`} />
                  </button>
                )}
              </div>

              {/* Video description */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-[#FF6B00] transition-colors leading-tight line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 font-semibold">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>Duration: ~5-10 mins</span>
                  <button 
                    onClick={() => handlePlayVideo(video.title, video.description)}
                    className="text-[#FF6B00] group-hover:underline font-bold cursor-pointer bg-transparent border-none p-0"
                  >
                    Play &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video prompt feedback refinement loops */}
      {!readOnly && (
        <form onSubmit={handleRefineSubmit} className="mt-4 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Refine Video Suggestions</span>
            <span className="text-[9px] font-bold text-[#FF6B00] uppercase tracking-wider bg-orange-100/50 px-2 py-0.5 rounded-full">
              Prompt Loop
            </span>
          </div>
          <p className="text-[11px] text-slate-550 font-semibold leading-relaxed">
            Suggest changes to these 4 videos (e.g. <i>"make them more animation-focused"</i> or <i>"explain simple dynamo first"</i>) to trigger AI re-generation.
          </p>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              className="flex-1 bg-white border border-slate-200 focus:border-[#FF6B00] px-3.5 py-2 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none"
              placeholder="e.g. I need visual derivations or real-world application videos..."
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
                <span>Refine Videos</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Video Player Modal Overlay */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 md:p-8 animate-fade-in text-left">
          <div className="relative w-full max-w-5xl bg-[#0B1329] border border-[#1B2A4A] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1B2A4A] flex justify-between items-center bg-[#070C1E]">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">TIM Interactive Concept Lecture</h3>
              </div>
              <button 
                onClick={() => setActiveVideoId(null)}
                className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Player</span>
              </button>
            </div>
            
            {/* Scrollable Player viewport */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#090D1A]">
              <ConceptVideoPlayer tabId={activeVideoId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
