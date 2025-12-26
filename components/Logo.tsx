
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center gap-1 select-none ${className}`} dir="rtl">
      
      {/* Symbol */}
      <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="logoGold" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          
          <path d="M50 15 L85 75 L15 75 Z" fill="none" stroke="url(#logoBlue)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 85 L85 25 L15 25 Z" fill="none" stroke="url(#logoGold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center items-center">
          <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none" style={{ fontFamily: '"Noto Serif Hebrew", serif' }}>
              היהודי
          </span>
          <span className="text-lg md:text-xl font-black text-brand-blue dark:text-blue-300 tracking-tight leading-none -mt-1" style={{ fontFamily: '"Noto Serif Hebrew", serif' }}>
              שלי
          </span>
      </div>
    </div>
  );
};
