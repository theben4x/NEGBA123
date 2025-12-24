
import React, { useState, useEffect } from 'react';

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (grayscale) {
      document.documentElement.classList.add('grayscale-mode');
    } else {
      document.documentElement.classList.remove('grayscale-mode');
    }
  }, [fontSize, highContrast, grayscale]);

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 glass-btn-primary p-3 rounded-full shadow-2xl transition-transform hover:scale-110 border-2 border-white focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="תפריט נגישות"
        title="נגישות"
      >
        {/* Standard Accessibility Icon (Person in Circle) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v2m0 0v2m0-2h2m-2 0H10" /> {/* Head-like + */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16l3-6 3 6m-5.5-2h5" /> {/* Body-like A shape */}
          <path d="M12 2a2 2 0 100 4 2 2 0 000-4zm0 6c-2.67 0-8 1.34-8 4v2h2v-2c0-1.33 5.33-2 6-2h0c.67 0 6 .67 6 2v2h2v-2c0-2.66-5.33-4-8-4z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 glass-panel p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 w-72 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-lg text-gray-900 dark:text-white">כלי נגישות</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <p className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">גודל טקסט</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFontSize(Math.max(100, fontSize - 10))}
                  className="flex-1 glass-btn py-2 rounded-lg font-bold"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontSize(100)}
                  className="flex-1 glass-btn py-2 rounded-lg font-bold"
                >
                  רגיל
                </button>
                <button 
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  className="flex-1 glass-btn py-2 rounded-lg font-bold"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Contrast */}
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-between px-4 transition-colors ${highContrast ? 'bg-yellow-400 text-black border-yellow-500' : 'glass-btn text-gray-800 dark:text-gray-200'}`}
            >
              <span>ניגודיות גבוהה</span>
              <span>{highContrast ? 'פעיל' : 'כבוי'}</span>
            </button>

            {/* Grayscale */}
            <button 
              onClick={() => setGrayscale(!grayscale)}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-between px-4 transition-colors ${grayscale ? 'bg-gray-800 text-white border-gray-900' : 'glass-btn text-gray-800 dark:text-gray-200'}`}
            >
              <span>גווני אפור</span>
              <span>{grayscale ? 'פעיל' : 'כבוי'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .high-contrast {
          filter: contrast(150%);
        }
        .high-contrast body, .high-contrast div, .high-contrast p, .high-contrast h1, .high-contrast h2, .high-contrast h3, .high-contrast span {
          background-color: #000 !important;
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        .high-contrast button {
          background-color: #FFFF00 !important;
          color: #000 !important;
          border: 2px solid #fff !important;
        }
        .grayscale-mode {
          filter: grayscale(100%);
        }
      `}</style>
    </>
  );
};
