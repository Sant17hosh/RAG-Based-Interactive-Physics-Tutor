import React, { useState } from 'react';
import { VideoRecommendation, ExperimentRecommendation, PracticeQuestion } from '../services/recommendationService';
import VideoRecommendations from './VideoRecommendations';
import ExperimentRecommendations from './ExperimentRecommendations';
import PracticeQuestions from './PracticeQuestions';
import NextTopicSuggestions from './NextTopicSuggestions';
import { Tv, FlaskConical, HelpCircle, GitFork } from 'lucide-react';

interface RecommendationPanelProps {
  videos: VideoRecommendation[];
  experiments: ExperimentRecommendation[];
  practiceQuestions: PracticeQuestion[];
  nextTopics: string[];
  currentTopic: string;
  onSelectTopic: (topic: string) => void;
  onAddScore?: (points: number) => void;
  selectedVideos: VideoRecommendation[];
  onToggleSelectVideo: (video: VideoRecommendation) => void;
  onRefineVideos: (prompt: string) => Promise<void>;
  refineVideosLoading: boolean;
  approvedExperiment: ExperimentRecommendation | null;
  onToggleApproveExperiment: (exp: ExperimentRecommendation) => void;
  onRefineExperiment: (prompt: string) => Promise<void>;
  refineExperimentLoading: boolean;
  readOnly?: boolean;
}

type TabType = 'videos' | 'experiments' | 'questions' | 'roadmap';

export default function RecommendationPanel({
  videos,
  experiments,
  practiceQuestions,
  nextTopics,
  currentTopic,
  onSelectTopic,
  onAddScore,
  selectedVideos,
  onToggleSelectVideo,
  onRefineVideos,
  refineVideosLoading,
  approvedExperiment,
  onToggleApproveExperiment,
  onRefineExperiment,
  refineExperimentLoading,
  readOnly = false
}: RecommendationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  const tabs = [
    { id: 'videos' as TabType, name: 'Videos', icon: Tv, count: videos.length },
    { id: 'experiments' as TabType, name: 'Experiments', icon: FlaskConical, count: experiments.length },
    { id: 'questions' as TabType, name: 'Practice', icon: HelpCircle, count: practiceQuestions.length },
    { id: 'roadmap' as TabType, name: 'Roadmap', icon: GitFork, count: nextTopics.length }
  ];

  return (
    <div className="space-y-6" id="recommendation-tabs-panel">
      {/* Navigation Tabs Header */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
              style={{ contentVisibility: 'auto' }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {tab.count > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-orange-500/10 text-[#FF6B00]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels with smooth mounting */}
      <div className="p-1 animate-fade-in" id="recommendation-tabs-content">
        {activeTab === 'videos' && (
          <VideoRecommendations
            videos={videos}
            selectedVideos={selectedVideos}
            onToggleSelectVideo={onToggleSelectVideo}
            onRefineVideos={onRefineVideos}
            refineLoading={refineVideosLoading}
            readOnly={readOnly}
          />
        )}
        {activeTab === 'experiments' && (
          <ExperimentRecommendations
            experiments={experiments}
            approvedExperiment={approvedExperiment}
            onToggleApproveExperiment={onToggleApproveExperiment}
            onRefineExperiment={onRefineExperiment}
            refineLoading={refineExperimentLoading}
            readOnly={readOnly}
          />
        )}
        {activeTab === 'questions' && (
          <PracticeQuestions questions={practiceQuestions} onAddScore={onAddScore} />
        )}
        {activeTab === 'roadmap' && (
          <NextTopicSuggestions
            nextTopics={nextTopics}
            currentTopic={currentTopic}
            onSelectTopic={onSelectTopic}
          />
        )}
      </div>
    </div>
  );
}
