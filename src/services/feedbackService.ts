import { SkillLevel } from './skillService';

export interface FeedbackItem {
  id: string;
  topic: string;
  skill: SkillLevel;
  helpful: boolean;
  difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult';
  timestamp: string;
}

const FEEDBACK_KEY = 'tim_feedback_history';

export const feedbackService = {
  getFeedbackHistory(): FeedbackItem[] {
    const data = localStorage.getItem(FEEDBACK_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as FeedbackItem[];
    } catch (e) {
      console.error('Error parsing feedback history:', e);
      return [];
    }
  },

  saveFeedback(topic: string, skill: SkillLevel, helpful: boolean, difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult'): FeedbackItem {
    const history = this.getFeedbackHistory();
    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic,
      skill,
      helpful,
      difficulty,
      timestamp: new Date().toISOString()
    };
    
    history.push(newItem);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(history));
    return newItem;
  },

  getFeedbackForTopic(topic: string): FeedbackItem[] {
    return this.getFeedbackHistory().filter(item => item.topic.toLowerCase() === topic.toLowerCase());
  },

  clearFeedbackHistory(): void {
    localStorage.removeItem(FEEDBACK_KEY);
  }
};
