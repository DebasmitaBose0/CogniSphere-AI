export type StudyMode = 'explain_simply' | 'exam_answer' | 'deep_explanation' | 'quick_revision';

export type SummaryLength = 'short' | 'medium' | 'detailed';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

export interface SummaryData {
  overview: string;
  keyConcepts: string[];
  importantPoints: string[];
  definitions: { term: string; definition: string }[];
  examRevisionNotes: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  percentage: number;
  userAnswers: { [questionId: string]: number };
  completedAt: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  status: 'unseen' | 'known' | 'review';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  mode?: StudyMode;
  isGroundedInNotes?: boolean;
}

export interface StudySession {
  id: string;
  title: string;
  date: string;
  materialPreview: string;
  hasSummary: boolean;
  quizScore?: number;
  quizTotal?: number;
  flashcardCount?: number;
  flashcardMastered?: number;
}

export interface UserStats {
  studySessions: number;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  averageQuizScore: number;
}
