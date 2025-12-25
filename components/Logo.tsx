import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center gap-2 select-none group ${className}`} dir="rtl">
      
      {/* Symbol: Liquid Glass Magen David */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-500 group-hover:rotate-[30deg]">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-colors duration-500"></div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          
          {/* Magen David Construction */}
          <g fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
             <path d="M50 15 L85 75 L15 75 Z" stroke="url(#blueGradient)" className="opacity-90 group-hover:opacity-100" />
             <path d="M50 85 L85 25 L15 25 Z" stroke="url(#goldGradient)" className="opacity-90 group-hover:opacity-100" />
          </g>
          
          <circle cx="30" cy="30" r="15" fill="white" fillOpacity="0.15" filter="blur(8px)" />
        </svg>
      </div>

      {/* Typography: Adjusted to be centered and stacked */}
      <div className="flex flex-col items-center justify-center relative z-10">
          <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.8] group-hover:text-brand-blue transition-colors duration-300" style={{ fontFamily: '"Noto Serif Hebrew", serif' }}>
              היהודי
          </span>
          <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400 dark:from-blue-400 dark:to-blue-200 tracking-tighter leading-[0.8] mt-1 group-hover:from-brand-gold group-hover:to-orange-400 transition-all duration-300" style={{ fontFamily: '"Noto Serif Hebrew", serif' }}>
              שלי
          </span>
      </div>
    </div>
  );
};