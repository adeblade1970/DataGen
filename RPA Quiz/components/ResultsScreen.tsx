
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  passingScore: number;
  onRetake: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, passingScore, onRetake }) => {
  const isPassed = score >= passingScore;

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full text-center animate-fade-in">
      {isPassed ? (
        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
      ) : (
        <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
      )}
      <h2 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
        {isPassed ? 'Test Passed!' : 'Test Failed'}
      </h2>
      <p className="text-slate-300 text-lg mb-4">
        You scored {score} out of {totalQuestions}.
      </p>
      <p className="text-slate-400 mb-8">
        (Passing score is {passingScore} correct answers)
      </p>
      <button
        onClick={onRetake}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
      >
        Retake Quiz
      </button>
    </div>
  );
};

export default ResultsScreen;
