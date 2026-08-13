export interface Chapter {
  id: number;
  name: string;
  weightage: string; // PUC Board marks weightage, e.g., "8 Marks"
  pucImportance: string; // High, Medium, Low board impact
  description: string;
  formulas: string[];
}

export interface GroundingChunk {
  id: string;
  chapterId: number;
  chapterName: string;
  section: string;
  content: string;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string; // DeepSeek R1 thinking block
  timestamp: string;
  retrievedChunks?: GroundingChunk[];
}

export interface Question {
  id: string;
  chapterId: number;
  chapterName: string;
  questionText: string;
  marks: number; // 2, 3, or 5 marks for PUC
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  rubric: string[]; // Grading criteria for high score
  sampleAnswer?: string;
}

export interface Exam {
  id: string;
  chapterId: number;
  chapterName: string;
  questions: Question[];
  durationMinutes: number;
}

export interface ExamSubmission {
  examId: string;
  answers: Record<string, string>; // questionId -> studentAnswer
  timeSpentSeconds: number;
}

export interface QuestionEvaluation {
  questionId: string;
  questionText: string;
  marks: number;
  scoreAwarded: number;
  bloomLevel: string;
  strengths: string[];
  weaknesses: string[];
  boardExamTips: string[];
  feedback: string;
}

export interface ExamReport {
  examId: string;
  chapterName: string;
  totalMarksPossible: number;
  totalScore: number;
  payoutPercentage: number;
  performanceGrade: 'Elite (A+)' | 'Excellent (A)' | 'Good (B)' | 'Needs Work (C)' | 'Critical Alert (D)';
  evaluations: QuestionEvaluation[];
  bloomTaxonomyAnalysis: {
    level: string;
    score: number;
    maxScore: number;
  }[];
  overallFeedback: string;
  remedialRoadmap: string[];
}

export interface MCQ {
  id: string;
  chapterId: number;
  chapterName: string;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type?: 'mcq' | 'true_false' | 'fill_blank' | 'short_answer';
}

export interface PerformanceStats {
  chaptersEvaluated: number;
  pucTotalSimulationScore: number;
  overallBloomScores: Record<string, { current: number; total: number }>;
  weakTopics: string[];
  strongTopics: string[];
  pucReadinessLevel: number; // 0 to 100
}
