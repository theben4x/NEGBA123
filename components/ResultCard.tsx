
import React from 'react';
import { BlessingResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultCardProps {
  data: BlessingResult;
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'fruit': return '🍎';
    case 'vegetable': return '🥕';
    case 'grain': return '🌾';
    case 'drink': return '🥤';
    case 'sweet': return '🍬';
    default: return '🍽️';
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const { t } = useLanguage();

  const getCategoryLabel = (category: string) => {
    switch (category) {
        case 'grain': return t('category_grain');
        case 'fruit': return t('category_fruit');
        case 'vegetable': return t('category_vegetable');
        case 'drink': return t('category_drink');
        default: return t('category_general');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-[3rem] overflow-hidden mt-8 relative group">
      
      {/* Dynamic Header Background */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-900/20 pointer-events-none"></div>

      {/* Header Content */}
      <div className="relative z-10 p-6 md:p-10 pb-6 text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-6" style={{ direction: 'rtl' }}>
        <div>
           <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 mb-4 shadow-sm">
             <span className="text-sm font-black tracking-wide text-brand-blue dark:text-blue-300">
               {getCategoryLabel(data.category)}
             </span>
           </div>
           <h2 className="text-4xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm leading-none break-words max-w-full">
             {data.foodName}
           </h2>
        </div>
        
        <div className="w-20 h-20 md:w-32 md:h-32 bg-white/40 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-5xl md:text-7xl shadow-apple backdrop-blur-md border border-white/30 flex-shrink-0">
          {data.icon || getIconForCategory(data.category)}
        </div>
      </div>

      <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Bracha Rishona Widget */}
        <div className="bg-white/50 dark:bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/40 dark:border-white/10 text-center flex flex-col items-center shadow-sm">
          <span className="text-brand-blue font-black text-xs tracking-wider uppercase mb-4 bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            {t('blessing_first')}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-4">{data.brachaRishonaTitle}</h3>
          <div className="w-full p-6 rounded-2xl bg-white/70 dark:bg-black/20 shadow-inner">
            <p className="text-lg md:text-xl font-bold leading-relaxed text-gray-900 dark:text-gray-100" lang="he" dir="rtl">
              {data.brachaRishonaText}
            </p>
          </div>
        </div>

        {/* Bracha Acharona Widget */}
        <div className="bg-white/50 dark:bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/40 dark:border-white/10 text-center flex flex-col items-center shadow-sm">
          <span className="text-brand-gold font-black text-xs tracking-wider uppercase mb-4 bg-orange-100/50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
            {t('blessing_last')}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-4">{data.brachaAcharonaTitle}</h3>
          <div className="w-full p-6 rounded-2xl bg-white/70 dark:bg-black/20 shadow-inner">
             <p className="text-lg md:text-xl font-bold leading-relaxed text-gray-900 dark:text-gray-100" lang="he" dir="rtl">
              {data.brachaAcharonaText}
            </p>
          </div>
        </div>
      </div>

      {/* Tip Section */}
      <div className="px-4 md:px-8 pb-8 relative z-10">
        <div className="glass-panel p-6 rounded-[2rem] flex items-start gap-5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-xl md:text-2xl shadow-lg flex-shrink-0 text-white">
            💡
          </div>
          <div>
            <h4 className="font-black text-lg text-gray-900 dark:text-white mb-1">{t('halachic_tip')}</h4>
            <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed text-base md:text-lg">
              {data.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};