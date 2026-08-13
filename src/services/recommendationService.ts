import { SkillLevel } from './skillService';

export interface VideoRecommendation {
  title: string;
  description: string;
}

export interface ExperimentRecommendation {
  title: string;
  materials: string[];
  procedure: string[];
  observation: string;
}

export interface PracticeQuestion {
  type: 'mcq' | 'short' | 'numerical';
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  modelAnswer?: string; // used for short answer
  solution?: string; // used for numerical/short answer fallback
}

export interface LearningPackageData {
  topic: string;
  skill: SkillLevel;
  explanation: string;
  videos: VideoRecommendation[];
  experiments: ExperimentRecommendation[];
  practiceQuestions: PracticeQuestion[];
  nextTopics: string[];
}

export const recommendationService = {
  async getLearningPackage(topic: string, skill: SkillLevel): Promise<LearningPackageData> {
    const response = await fetch('/api/learning-package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, skill })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch learning package: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      topic,
      skill,
      explanation: data.explanation || '',
      videos: data.videos || [],
      experiments: data.experiments || [],
      practiceQuestions: data.practiceQuestions || [],
      nextTopics: data.nextTopics || []
    };
  },

  async refineVideos(topic: string, skill: SkillLevel, currentVideos: VideoRecommendation[], prompt: string): Promise<VideoRecommendation[]> {
    const response = await fetch('/api/refine-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, skill, currentVideos, prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to refine videos: ${response.statusText}`);
    }

    const data = await response.json();
    return data.videos || [];
  },

  async refineExperiment(topic: string, skill: SkillLevel, currentExperiment: ExperimentRecommendation, prompt: string): Promise<ExperimentRecommendation> {
    const response = await fetch('/api/refine-experiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, skill, currentExperiment, prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to refine experiment: ${response.statusText}`);
    }

    const data = await response.json();
    return data.experiment;
  }
};
