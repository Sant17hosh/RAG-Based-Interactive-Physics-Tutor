export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

const SKILL_KEY = 'tim_current_skill';

export const skillService = {
  getCurrentSkill(): SkillLevel {
    const saved = localStorage.getItem(SKILL_KEY);
    if (saved === 'Beginner' || saved === 'Intermediate' || saved === 'Advanced') {
      return saved as SkillLevel;
    }
    return 'Beginner';
  },

  setCurrentSkill(skill: SkillLevel): void {
    localStorage.setItem(SKILL_KEY, skill);
  },

  /**
   * Evaluates recent feedback to recommend adjusting the skill level.
   * If the student repeatedly finds the material "Too Easy" or "Too Difficult",
   * it suggests an upgrade or downgrade.
   */
  suggestSkillAdjustment(feedbackList: Array<{ skill: SkillLevel; difficulty: 'Too Easy' | 'Perfect' | 'Too Difficult' }>): SkillLevel | null {
    if (feedbackList.length < 2) return null;

    // Get the two most recent feedbacks for the current skill
    const currentSkill = this.getCurrentSkill();
    const relevantFeedback = feedbackList
      .filter(f => f.skill === currentSkill)
      .slice(-2);

    if (relevantFeedback.length < 2) return null;

    const allTooEasy = relevantFeedback.every(f => f.difficulty === 'Too Easy');
    const allTooHard = relevantFeedback.every(f => f.difficulty === 'Too Difficult');

    if (allTooEasy) {
      if (currentSkill === 'Beginner') return 'Intermediate';
      if (currentSkill === 'Intermediate') return 'Advanced';
    }

    if (allTooHard) {
      if (currentSkill === 'Advanced') return 'Intermediate';
      if (currentSkill === 'Intermediate') return 'Beginner';
    }

    return null;
  }
};
