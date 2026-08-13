import React, { useState, useEffect } from 'react';
import { recommendationService, LearningPackageData, VideoRecommendation, ExperimentRecommendation } from '../services/recommendationService';
import { feedbackService } from '../services/feedbackService';
import { skillService, SkillLevel } from '../services/skillService';
import SkillSelector from './SkillSelector';
import RecommendationPanel from './RecommendationPanel';
import FeedbackPanel from './FeedbackPanel';
import { Sparkles, BrainCircuit, BookOpen, AlertCircle, RefreshCw, Layers, Check, ArrowLeft } from 'lucide-react';

interface LearningPackageProps {
  onAddScore?: (points: number) => void;
}

const COMMON_TOPICS = [
  "Electromagnetic Induction",
  "Faraday's Laws of Induction",
  "Lenz's Law & Energy Conservation",
  "Motional Electromotive Force (EMF)",
  "Eddy Currents & Transformer Mitigation",
  "Self-Induction & Solenoid Inductance",
  "Mutual Induction of Coaxial Solenoids",
  "Displacement Current",
  "Ampere-Maxwell Law",
  "Electromagnetic Spectrum",
  "Maxwell's Four Equations"
];

export default function LearningPackage({ onAddScore }: LearningPackageProps) {
  const [topic, setTopic] = useState<string>('Electromagnetic Induction');
  const [skill, setSkill] = useState<SkillLevel>('Beginner');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<LearningPackageData | null>(null);
  const [skillAdjustmentSuggestion, setSkillAdjustmentSuggestion] = useState<SkillLevel | null>(null);

  // Refinement and selection state matching the user diagram
  const [selectedVideos, setSelectedVideos] = useState<VideoRecommendation[]>([]);
  const [approvedExperiment, setApprovedExperiment] = useState<ExperimentRecommendation | null>(null);
  const [refineVideosLoading, setRefineVideosLoading] = useState<boolean>(false);
  const [refineExperimentLoading, setRefineExperimentLoading] = useState<boolean>(false);
  const [isDelivered, setIsDelivered] = useState<boolean>(false);

  // Load current preferred skill on mount
  useEffect(() => {
    setSkill(skillService.getCurrentSkill());
  }, []);

  const handleSkillChange = (newSkill: SkillLevel) => {
    setSkill(newSkill);
    skillService.setCurrentSkill(newSkill);
    if (skillAdjustmentSuggestion === newSkill) {
      setSkillAdjustmentSuggestion(null);
    }
  };

  const generatePackage = async (targetTopic: string = topic) => {
    if (!targetTopic.trim()) {
      setError('Please specify a physics concept or topic first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSkillAdjustmentSuggestion(null);
    setSelectedVideos([]);
    setApprovedExperiment(null);
    setIsDelivered(false);

    const steps = [
      'Performing high-fidelity NCERT vector semantic search...',
      'Retrieving Class 11 physics grounding equations...',
      'Synthesizing adaptive theoretical explanation...',
      'Sourcing conceptual learning videos...',
      'Formulating laboratory experiment steps...',
      'Generating skill-adapted practice question sets...'
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setLoadingStep(steps[stepIndex]);
      }
    }, 900);

    try {
      const data = await recommendationService.getLearningPackage(targetTopic, skill);
      setPackageData(data);
      if (onAddScore) {
        onAddScore(10);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate learning package. Please try again.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleToggleSelectVideo = (video: VideoRecommendation) => {
    setSelectedVideos(prev => {
      const exists = prev.some(v => v.title === video.title);
      if (exists) {
        return prev.filter(v => v.title !== video.title);
      } else {
        return [...prev, video];
      }
    });
  };

  const handleToggleApproveExperiment = (exp: ExperimentRecommendation) => {
    setApprovedExperiment(prev => {
      if (prev?.title === exp.title) {
        return null;
      } else {
        return exp;
      }
    });
  };

  const handleRefineVideos = async (prompt: string) => {
    if (!packageData) return;
    setRefineVideosLoading(true);
    setError(null);
    try {
      const refined = await recommendationService.refineVideos(
        packageData.topic,
        packageData.skill,
        packageData.videos,
        prompt
      );
      setPackageData(prev => {
        if (!prev) return null;
        return { ...prev, videos: refined };
      });
      // Clear selection as content changed
      setSelectedVideos([]);
      if (onAddScore) onAddScore(3);
    } catch (err: any) {
      setError(err.message || 'Failed to refine videos.');
    } finally {
      setRefineVideosLoading(false);
    }
  };

  const handleRefineExperiment = async (prompt: string) => {
    if (!packageData || packageData.experiments.length === 0) return;
    setRefineExperimentLoading(true);
    setError(null);
    try {
      const currentExp = packageData.experiments[0];
      const refined = await recommendationService.refineExperiment(
        packageData.topic,
        packageData.skill,
        currentExp,
        prompt
      );
      setPackageData(prev => {
        if (!prev) return null;
        return { ...prev, experiments: [refined] };
      });
      // Update approved if it was currently approved
      if (approvedExperiment?.title === currentExp.title) {
        setApprovedExperiment(refined);
      } else {
        setApprovedExperiment(null);
      }
      if (onAddScore) onAddScore(3);
    } catch (err: any) {
      setError(err.message || 'Failed to refine experiment.');
    } finally {
      setRefineExperimentLoading(false);
    }
  };

  const handleFeedbackSubmit = (helpful: boolean, difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult') => {
    if (!packageData) return;
    feedbackService.saveFeedback(packageData.topic, packageData.skill, helpful, difficulty);
    const history = feedbackService.getFeedbackHistory();
    const recommendation = skillService.suggestSkillAdjustment(history);
    if (recommendation && recommendation !== skill) {
      setSkillAdjustmentSuggestion(recommendation);
    }
  };

  const applySuggestedSkill = (suggested: SkillLevel) => {
    handleSkillChange(suggested);
    setSkillAdjustmentSuggestion(null);
    if (packageData) {
      generatePackage(packageData.topic);
    }
  };

  const handleSelectRecommendedTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    generatePackage(nextTopic);
    document.getElementById('learning-package-header')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderExplanation = (text: string) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xs font-black text-slate-800 uppercase tracking-wider mt-5 mb-2 border-b border-slate-100 pb-1">$1</h3>');
    html = html.replace(/^#### (.*?)$/gm, '<h4 class="text-xs font-extrabold text-[#FF6B00] mt-3.5 mb-1">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-sm font-black text-slate-900 mt-6 mb-3 border-l-2 border-[#FF6B00] pl-2">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-950">$1</strong>');
    html = html.replace(/^\* (.*?)$/gm, '<li class="ml-4 list-disc pl-0.5 text-slate-650 font-semibold mb-1">$1</li>');
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc pl-0.5 text-slate-650 font-semibold mb-1">$1</li>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-slate-100 text-orange-600 px-1 py-0.5 rounded font-mono text-[10px]">$1</code>');
    html = html.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-xs leading-relaxed text-slate-600 font-medium space-y-1.5" />;
  };

  // If the package is approved and finalized, render the Delivery View
  if (isDelivered && packageData) {
    return (
      <div className="space-y-8 animate-fade-in text-left">
        <div className="glass-panel p-6 border-emerald-100 bg-[#FFFFFF] relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-150">
            <div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3px]" />
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  Final Learning Package Delivery
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Your custom approved physics roadmap for <b>{packageData.topic}</b> ({packageData.skill} Level)
              </p>
            </div>
            <button
              onClick={() => setIsDelivered(false)}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back & Refine</span>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Explanation section */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-slate-550 tracking-wider">Pedagogical Theory Explanation</h3>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                {renderExplanation(packageData.explanation)}
              </div>
            </div>

            {/* Approved Videos Section */}
            {selectedVideos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-550 tracking-wider">Approved Concept Videos ({selectedVideos.length})</h3>
                <RecommendationPanel
                  videos={selectedVideos}
                  experiments={[]}
                  practiceQuestions={[]}
                  nextTopics={[]}
                  currentTopic={packageData.topic}
                  onSelectTopic={handleSelectRecommendedTopic}
                  selectedVideos={selectedVideos}
                  onToggleSelectVideo={handleToggleSelectVideo}
                  onRefineVideos={handleRefineVideos}
                  refineVideosLoading={refineVideosLoading}
                  approvedExperiment={null}
                  onToggleApproveExperiment={handleToggleApproveExperiment}
                  onRefineExperiment={handleRefineExperiment}
                  refineExperimentLoading={refineExperimentLoading}
                  readOnly={true}
                />
              </div>
            )}

            {/* Approved Experiment Section */}
            {approvedExperiment && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-550 tracking-wider">Approved Laboratory Guide</h3>
                <RecommendationPanel
                  videos={[]}
                  experiments={[approvedExperiment]}
                  practiceQuestions={[]}
                  nextTopics={[]}
                  currentTopic={packageData.topic}
                  onSelectTopic={handleSelectRecommendedTopic}
                  selectedVideos={[]}
                  onToggleSelectVideo={handleToggleSelectVideo}
                  onRefineVideos={handleRefineVideos}
                  refineVideosLoading={refineVideosLoading}
                  approvedExperiment={approvedExperiment}
                  onToggleApproveExperiment={handleToggleApproveExperiment}
                  onRefineExperiment={handleRefineExperiment}
                  refineExperimentLoading={refineExperimentLoading}
                  readOnly={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="learning-package-container">
      
      {/* Smart Skill Calibration Toast */}
      {skillAdjustmentSuggestion && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 shadow-md animate-fade-in text-left">
          <AlertCircle className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Smart Skill Calibration Suggestion</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Based on your recent self-evaluations, we suggest adjusting your target skill level to <b>{skillAdjustmentSuggestion}</b> to match your current pacing.
            </p>
            <button
              onClick={() => applySuggestedSkill(skillAdjustmentSuggestion)}
              className="px-3.5 py-1.5 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Apply & Re-generate &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Form Dashboard */}
      <div className="glass-panel p-6 border-slate-100 space-y-6" id="learning-package-header">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-[#FF6B00]" />
              <span>Skill-Based Learning Assistant</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Adaptable educational curriculum materials based on NCERT standards</p>
          </div>
          <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200 uppercase tracking-wider">
            Intelligent Engine
          </span>
        </div>

        {/* Input parameters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quick selector options */}
            <div className="space-y-1.5 text-left md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Select NCERT Concept Topic</label>
              <select
                value={COMMON_TOPICS.includes(topic) ? topic : 'custom'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== 'custom') setTopic(val);
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] px-3.5 py-2.5 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none transition-all"
              >
                <option value="" disabled>-- Select a concept --</option>
                {COMMON_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="custom">-- Type Custom Topic Below --</option>
              </select>
            </div>

            {/* Custom search label */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Current Skill Preset</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                <Layers className="w-4 h-4 text-[#FF6B00]" />
                <span>{skill} Preset Active</span>
              </div>
            </div>

          </div>

          {/* Custom Text input */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Custom Physics Topic Search</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] px-3.5 py-2.5 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g. Newton's laws of motion, Faraday's discovery, Gravitational constant..."
            />
          </div>

          {/* Skill selector toggles */}
          <SkillSelector selectedSkill={skill} onSkillChange={handleSkillChange} />

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => generatePackage()}
              disabled={loading || !topic.trim()}
              className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none ${
                loading 
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white border-transparent hover:brightness-110 shadow-orange-500/10 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Package...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Generate Skill-Based Learning Package &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Progress Spinner Skeletons */}
      {loading && (
        <div className="glass-panel p-10 border-slate-100 flex flex-col items-center justify-center text-center space-y-5 animate-pulse">
          <div className="relative w-14 h-14 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center">
            <BrainCircuit className="w-7 h-7 text-[#FF6B00] animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Assembling Custom Tutorial Package</h3>
            <p className="text-[11px] text-slate-550 font-black tracking-wide animate-pulse">{loadingStep}</p>
          </div>
          
          <div className="w-full max-w-lg space-y-3 pt-4">
            <div className="h-3.5 bg-slate-100 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-3 bg-slate-100 rounded-lg w-5/6 mx-auto"></div>
            <div className="h-3 bg-slate-100 rounded-lg w-2/3 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-left animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs text-rose-700 font-extrabold">{error}</p>
        </div>
      )}

      {/* Learning content result panel */}
      {packageData && !loading && (
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Explanation layout panel */}
          <div className="glass-panel p-6 border-slate-100 bg-[#FFFFFF] relative overflow-hidden" id="explanation-viewer">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#FF6B00]"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">Concept Explanation: {packageData.topic}</h3>
                </div>
                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-orange-50 text-[#FF6B00] border border-orange-200">
                  {packageData.skill} depth
                </span>
              </div>

              {/* Dynamic content reader */}
              <div className="py-2">
                {renderExplanation(packageData.explanation)}
              </div>
            </div>
          </div>

          {/* Recommendations Group tabs (Videos, Experiments, Practice, Roadmap) */}
          <div className="glass-panel p-6 border-slate-100 bg-[#FFFFFF]">
            <RecommendationPanel
              videos={packageData.videos}
              experiments={packageData.experiments}
              practiceQuestions={packageData.practiceQuestions}
              nextTopics={packageData.nextTopics}
              currentTopic={packageData.topic}
              onSelectTopic={handleSelectRecommendedTopic}
              onAddScore={onAddScore}
              selectedVideos={selectedVideos}
              onToggleSelectVideo={handleToggleSelectVideo}
              onRefineVideos={handleRefineVideos}
              refineVideosLoading={refineVideosLoading}
              approvedExperiment={approvedExperiment}
              onToggleApproveExperiment={handleToggleApproveExperiment}
              onRefineExperiment={handleRefineExperiment}
              refineExperimentLoading={refineExperimentLoading}
            />
          </div>

          {/* Approval Gate section */}
          <div className="glass-panel p-6 border-slate-100 bg-[#FFFFFF] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Package Approval Gate</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Approve your selections in the tabs above. Once satisfied, finalize the package to lock in your delivered curriculum.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-slate-400">
                <span className={`px-2.5 py-0.5 rounded-full border ${selectedVideos.length > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  Videos Approved: {selectedVideos.length}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border ${approvedExperiment ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  Experiment Approved: {approvedExperiment ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (selectedVideos.length === 0 && !approvedExperiment) {
                  setError('Please select at least one video or approve the experiment first.');
                  return;
                }
                setIsDelivered(true);
                if (onAddScore) onAddScore(15);
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-[0.98] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer select-none whitespace-nowrap self-start md:self-center"
            >
              Approve & Package Delivery &rarr;
            </button>
          </div>

          {/* Feedback Form Panel */}
          <FeedbackPanel
            onSubmitFeedback={handleFeedbackSubmit}
            savedFeedbackStatus={
              feedbackService.getFeedbackForTopic(packageData.topic).slice(-1)[0]
                ? {
                    helpful: feedbackService.getFeedbackForTopic(packageData.topic).slice(-1)[0].helpful,
                    difficulty: feedbackService.getFeedbackForTopic(packageData.topic).slice(-1)[0].difficulty
                  }
                : null
            }
          />
        </div>
      )}
    </div>
  );
}
