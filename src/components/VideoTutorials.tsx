import React, { useState } from 'react';
import { BookOpen, Tv, Zap, Layers, Play, CheckCircle, Video } from 'lucide-react';
import ConceptVideoPlayer, { TabId } from './ConceptVideoPlayer';

interface VideoItem {
  id: TabId;
  title: string;
  category: 'concept' | 'animation' | 'experiment' | 'pyq';
  duration: string;
  takeaway: string;
  formulas: string[];
}

const CHAPTER_VIDEOS_MAP: Record<number, VideoItem[]> = {
  6: [
    {
      id: 'faraday-laws',
      title: "Faraday's Laws of Electromagnetic Induction",
      category: 'concept',
      duration: "01:20",
      takeaway: "EMF is induced in a circuit only when there is a change in the magnetic flux linkage.",
      formulas: ["e = -N * (dФ_B / dt)"]
    },
    {
      id: 'magnetic-flux',
      title: "Visualizing 3D Magnetic Flux and Area Vectors",
      category: 'animation',
      duration: "01:15",
      takeaway: "Flux equals B dot A cos(θ). Max flux is orthogonal to the surface normal.",
      formulas: ["Ф = B • A • cos(θ)"]
    },
    {
      id: 'faraday-experiments',
      title: "Live Laboratory Setup: Faraday's Seminal Trials",
      category: 'experiment',
      duration: "01:30",
      takeaway: "Changing magnetic fields generate transient galvanometer deflections.",
      formulas: ["Ф = B * A * cos(θ)"]
    },
    {
      id: 'motional-emf',
      title: "Deriving Motional EMF for Sliding Rods",
      category: 'pyq',
      duration: "01:30",
      takeaway: "Motional EMF values represent electrostatic potential differences built by Lorentz drift forces.",
      formulas: ["e = B * v * l"]
    },
    {
      id: 'eddy-currents',
      title: "Eddy Currents and Magnetic Damping",
      category: 'experiment',
      duration: "01:15",
      takeaway: "Swirling bulk metal currents oppose flux sweeps, mitigable by lamination.",
      formulas: ["P = I² * R"]
    },
    {
      id: 'ac-generator',
      title: "Syllabus Derivation: Alternating Current Generators",
      category: 'pyq',
      duration: "01:30",
      takeaway: "Coil rotation inside magnetic fields yields sinusoidal potential waves.",
      formulas: ["e = N * B * A * ω * sin(ωt)"]
    }
  ],
  8: [
    {
      id: 'displacement-current',
      title: "Displacement Current & Ampere-Maxwell Curl",
      category: 'concept',
      duration: "01:20",
      takeaway: "Shifting electric fields act as virtual continuity currents inside dielectric gaps.",
      formulas: ["I_d = ε_0 * (dФ_E / dt)", "∮ B • dl = μ_0(I_c + I_d)"]
    },
    {
      id: 'em-wave-propagation',
      title: "Coupled Transverse Wave Vectors Simulator",
      category: 'animation',
      duration: "01:30",
      takeaway: "Sinusoidal E and B field lines run orthogonal to wave propagation directions.",
      formulas: ["c = 1 / sqrt(μ_0 * ε_0)", "E_0 / B_0 = c"]
    },
    {
      id: 'spectrum-radar',
      title: "The Electromagnetic Spectrum & Microwaves",
      category: 'concept',
      duration: "01:15",
      takeaway: "All spectral wavelengths travel at identical velocity c in vacuum.",
      formulas: ["c = f * λ"]
    }
  ]
};

const CATEGORY_LABELS = {
  concept: "Concept Videos",
  animation: "Animation Videos",
  experiment: "Experiment Videos",
  pyq: "Previous Year Solution Videos"
};

export default function VideoTutorials() {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(6);
  const [activeCategory, setActiveCategory] = useState<'concept' | 'animation' | 'experiment' | 'pyq'>('concept');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(CHAPTER_VIDEOS_MAP[6][0]);

  const handleChapterToggle = (chId: number) => {
    setSelectedChapterId(chId);
    const available = CHAPTER_VIDEOS_MAP[chId] || [];
    // pick first video in that chapter
    const firstMatch = available.find(v => v.category === activeCategory) || available[0];
    if (firstMatch) {
      setSelectedVideo(firstMatch);
    }
  };

  const handleCategoryToggle = (cat: 'concept' | 'animation' | 'experiment' | 'pyq') => {
    setActiveCategory(cat);
    const available = CHAPTER_VIDEOS_MAP[selectedChapterId] || [];
    const matched = available.find(v => v.category === cat);
    if (matched) {
      setSelectedVideo(matched);
    }
  };

  const availableVideos = (CHAPTER_VIDEOS_MAP[selectedChapterId] || []).filter(v => v.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="videos-companion-module">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-3xl shadow-md border border-orange-400/20">
        <div className="max-w-4xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/25 text-white uppercase tracking-wider backdrop-blur-md">
            <Tv className="w-3.5 h-3.5 animate-pulse" /> LMS Video Desk
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black tracking-tight leading-none">
            Chapter-wise Lecture Series
          </h1>
          <p className="text-sm text-white/95 max-w-2xl font-medium leading-relaxed">
            Browse videos organized chapter-wise across four specialized edtech categories.
          </p>
        </div>
      </div>

      {/* Chapters Selection */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-205 max-w-md">
        <button
          onClick={() => handleChapterToggle(6)}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
            selectedChapterId === 6 ? 'bg-white text-orange-600 shadow-sm border border-slate-200' : 'text-slate-650 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-orange-500" />
          <span>Chapter 6: EMI</span>
        </button>
        <button
          onClick={() => handleChapterToggle(8)}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
            selectedChapterId === 8 ? 'bg-white text-orange-600 shadow-sm border border-slate-200' : 'text-slate-650 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Chapter 8: EM Waves</span>
        </button>
      </div>

      {/* Categories Subtabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {(['concept', 'animation', 'experiment', 'pyq'] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border select-none ${
                isActive
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow'
                  : 'bg-white text-slate-650 border-slate-200 hover:bg-orange-50/50'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Videos layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: videos playlist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Available Playlist
            </h3>

            {availableVideos.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <Video className="w-10 h-10 text-slate-300 mx-auto" />
                <span className="text-[11px] text-slate-400 block font-bold leading-normal">
                  No direct videos in this category. Placeholders are active.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {availableVideos.map((video) => {
                  const isActive = selectedVideo.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 border-slate-200 ${
                        isActive ? 'border-[#FF6B00] bg-orange-50/20' : 'bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-orange-50 text-[#FF6B00] shrink-0 mt-0.5">
                        <Play className="w-4 h-4 fill-orange-500" />
                      </div>
                      <div className="space-y-1 pr-4">
                        <span className="text-[8px] font-mono font-black uppercase text-slate-400">{video.duration} Mins</span>
                        <h4 className={`text-xs font-black transition-colors leading-tight ${isActive ? 'text-orange-605' : 'text-slate-800'}`}>{video.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Video Notes takeaways card */}
          {selectedVideo && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Lecture Takeaway:</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold font-serif italic bg-white p-2.5 rounded-lg border border-slate-150">"{selectedVideo.takeaway}"</p>
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Key Formulas:</span>
                {selectedVideo.formulas.map((f, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded p-1.5 text-orange-700 font-mono text-[10.5px] font-black shadow-xs">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Interactive whiteboard simulator player */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-none">
              Interactive Whiteboard Simulation Player
            </h3>
          </div>
          <div className="p-4 bg-[#FAF9F5]/40 flex justify-center border-b border-slate-200">
            {selectedVideo ? (
              <ConceptVideoPlayer tabId={selectedVideo.id} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 font-bold text-xs">
                Select a video to start the simulation.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
