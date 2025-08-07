
import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (answer: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, questionNumber, totalQuestions, onAnswerSelect }) => {
  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <div className="mb-6">
        <p className="text-sky-400 font-semibold mb-2">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-xl md:text-2xl font-bold leading-tight text-white">
          {question.question}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(option)}
            className="w-full text-left p-4 bg-slate-700 rounded-lg hover:bg-sky-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
          >
            <span className="text-slate-200">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Add a simple fade-in animation to tailwind config if possible, or define here
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default QuizCard;
