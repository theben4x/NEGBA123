
import React, { useState, useEffect } from 'react';
import { JEWISH_TRIVIA } from '../constants';
import { TriviaQuestion } from '../types';

export const TriviaPage: React.FC = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Shuffle questions and pick 10
    const shuffled = [...JEWISH_TRIVIA].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsGameOver(false);
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (showResult) return; // Prevent double clicking

    setSelectedAnswer(optionIndex);
    setShowResult(true);

    if (optionIndex === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      setIsGameOver(true);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  if (isGameOver) {
    return (
      <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="glass-panel rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-slate-700">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-2">המשחק הסתיים!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">הניקוד הסופי שלך:</p>
          
          <div className="text-5xl font-black text-brand-blue dark:text-blue-400 mb-8">
            {score} <span className="text-2xl text-gray-400">/ 100</span>
          </div>

          <p className="text-lg font-bold mb-8 text-gray-800 dark:text-gray-200">
            {score === 100 ? "מושלם! גאון בתורה! 👑" : 
             score >= 80 ? "תוצאה מעולה! כל הכבוד! 👏" : 
             score >= 50 ? "לא רע, אבל יש מקום לשיפור 😉" : 
             "כדאי לחזור על החומר... נסה שוב! 📚"}
          </p>

          <button 
            onClick={startNewGame}
            className="w-full glass-btn-primary font-black py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            משחק חדש
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-indigo-50 dark:bg-slate-800 text-center py-8 px-4 rounded-b-[2.5rem] border-b border-indigo-100 dark:border-slate-700 mb-8 transition-colors duration-300">
        <h1 className="text-3xl md:text-4xl font-black text-indigo-900 dark:text-indigo-300 mb-2">
          טריוויה יהודית
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
          <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">
            שאלה {currentIndex + 1} מתוך {questions.length}
          </div>
          <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">
            ניקוד: <span className="text-brand-blue dark:text-blue-400">{score}</span>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4">
        {/* Question Card */}
        <div className="glass-panel rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden relative">
          
          {/* Question Text */}
          <div className="p-6 md:p-8 text-center bg-brand-blue dark:bg-blue-900/30 text-white">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "glass-btn text-gray-800 dark:text-gray-200";
              
              if (showResult) {
                if (idx === currentQuestion.correctAnswer) {
                  btnClass = "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300 ring-2 ring-green-500 shadow-md";
                } else if (idx === selectedAnswer) {
                  btnClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-300 ring-2 ring-red-500 shadow-md";
                } else {
                  btnClass = "opacity-50 glass-btn grayscale";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-lg font-bold transition-all duration-200 text-right relative ${btnClass}`}
                >
                  {option}
                  {showResult && idx === currentQuestion.correctAnswer && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                  )}
                  {showResult && idx === selectedAnswer && idx !== currentQuestion.correctAnswer && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600">✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {showResult && (
            <div className="bg-gray-50/50 dark:bg-slate-700/50 p-6 border-t border-gray-100 dark:border-slate-700 animate-fade-in backdrop-blur-sm">
              <div className="mb-4">
                <p className="font-bold text-gray-800 dark:text-white mb-1">
                  {selectedAnswer === currentQuestion.correctAnswer ? "נכון מאוד! 🎉" : "לא נורא, בפעם הבאה! 😅"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {currentQuestion.explanation}
                </p>
              </div>
              <button
                onClick={handleNextQuestion}
                className="w-full glass-btn-primary font-black py-3 rounded-xl shadow-md transition-colors"
              >
                {currentIndex + 1 === questions.length ? "סיים משחק" : "השאלה הבאה"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
