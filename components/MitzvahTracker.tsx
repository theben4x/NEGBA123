
import React, { useState, useEffect } from 'react';

interface Mitzvah {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
}

export const MitzvahTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Mitzvah[]>([
    { id: 'tefillin', label: 'הנחת תפילין', icon: '🔳', completed: false },
    { id: 'tzedaka', label: 'נתינת צדקה', icon: '💰', completed: false },
    { id: 'shacharit', label: 'תפילת שחרית', icon: '🌅', completed: false },
    { id: 'mincha', label: 'תפילת מנחה', icon: '☀️', completed: false },
    { id: 'arvit', label: 'תפילת ערבית', icon: '🌙', completed: false },
    { id: 'limud', label: 'לימוד תורה יומי', icon: '📚', completed: false },
    { id: 'chesed', label: 'מעשה חסד', icon: '❤️', completed: false },
    { id: 'bracha', label: '100 ברכות', icon: '💯', completed: false },
  ]);

  const [celebrate, setCelebrate] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`myjew_tracker_${today}`);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save state
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`myjew_tracker_${today}`, JSON.stringify(tasks));
    
    // Check for celebration (all done)
    const allDone = tasks.every(t => t.completed);
    if (allDone && tasks.length > 0) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000); // Stop after 3s
    }
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Celebration Effect */}
      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute animate-ping text-9xl opacity-50">🎉</div>
          <div className="absolute top-10 left-10 text-6xl animate-bounce">✨</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-bounce delay-100">🌟</div>
        </div>
      )}

      {/* Header */}
      <section className="bg-green-50 dark:bg-slate-800 text-center py-10 px-4 rounded-b-[2.5rem] border-b border-green-100 dark:border-slate-700 transition-colors duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-green-900 dark:text-green-300 mb-3">
          המדד היומי
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          עקוב אחר המצוות היומיות שלך. כל יום הוא דף חדש!
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto bg-white dark:bg-slate-700 rounded-full h-6 shadow-inner relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-400 to-green-600 transition-all duration-1000 ease-out flex items-center justify-center text-xs font-bold text-white shadow-lg"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && `${progress}%`}
          </div>
        </div>
        <p className="mt-2 text-sm font-bold text-green-700 dark:text-green-400">
          {progress === 100 ? "יישר כוח! השלמת את כל היעדים להיום! 🏆" : `הושלמו ${tasks.filter(t => t.completed).length} מתוך ${tasks.length}`}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-6 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 focus:outline-none focus:ring-4 focus:ring-green-200 relative overflow-hidden group
                ${task.completed 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white transform scale-95 shadow-inner' 
                  : 'glass-btn text-gray-800 dark:text-gray-200 hover:border-green-300 dark:hover:border-green-700'
                }`}
            >
              <div className={`text-4xl transition-transform duration-300 ${task.completed ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                {task.icon}
              </div>
              <span className={`font-black text-center ${task.completed ? 'text-white' : ''}`}>
                {task.label}
              </span>
              
              {task.completed && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
              )}
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${task.completed ? 'bg-white border-white text-green-600' : 'border-gray-300 dark:border-slate-500'}`}>
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 font-bold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
