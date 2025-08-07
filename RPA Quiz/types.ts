
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum QuizState {
  START,
  LOADING,
  QUIZ,
  RESULTS,
  ERROR,
}
