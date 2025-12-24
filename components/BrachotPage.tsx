
import React, { useState, useEffect, useRef } from 'react';
import { BlessingResult, FoodItem } from '../types';
import { ResultCard } from './ResultCard';
import { COMMON_FOODS } from '../constants';
import { getBlessingInfo } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface BrachotPageProps {
  onNavigate?: (page: any) => void;
}

export const BrachotPage: React.FC<BrachotPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<BlessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setQuery(userInput);
    setError(null);
    if (userInput.length > 0 && language === 'he') {
      const filtered = COMMON_FOODS.filter(food => food.label.includes(userInput));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (searchTerm: string = query) => {
    if (!searchTerm.trim()) return;
    setQuery(searchTerm);
    setShowSuggestions(false);
    setError(null);
    setData(null);

    const localMatch = COMMON_FOODS.find(f => f.label === searchTerm.trim());
    if (localMatch && localMatch.data) {
      setData({ ...localMatch.data, icon: localMatch.icon });
      return;
    }

    setLoading(true);
    try {
      const result = await getBlessingInfo(searchTerm, language);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(t('not_found_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: FoodItem) => {
    setQuery(suggestion.label);
    if (suggestion.data) {
      setData({ ...suggestion.data, icon: suggestion.icon });
      setError(null);
      setShowSuggestions(false);
    } else {
      handleSearch(suggestion.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };
  const resetSearch = () => { setData(null); setQuery(''); setSuggestions([]); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const HOME_OPTIONS = [
    { id: 'siddur', label: 'סידור', icon: '📖', color: 'bg-blue-100 text-blue-600' },
    { id: 'shabbat', label: 'שבת', icon: '🕯️', color: 'bg-orange-100 text-orange-600' },
    { id: 'halacha', label: 'שו"ת', icon: '📜', color: 'bg-purple-100 text-purple-600' },
    { id: 'chat', label: 'שאל רב', icon: '🧔🏻‍♂️', color: 'bg-teal-100 text-teal-600' },
    { id: 'zmanim', label: 'זמנים', icon: '⏳', color: 'bg-red-100 text-red-600' },
    { id: 'tracker', label: 'מדד', icon: '📈', color: 'bg-green-100 text-green-600' },
    { id: 'trivia', label: 'טריוויה', icon: '🧠', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'blog', label: 'מאמרים', icon: '✍️', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'video', label: 'וידאו AI', icon: '🎥', color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className={`relative transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${data ? 'max-h-0 opacity-0 overflow-hidden scale-95 origin-top' : 'py-10 md:py-20 scale-100 opacity-100'}`}>
        
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 drop-shadow-sm leading-tight transition-transform hover:scale-[1.01] duration-500">
            {t('hero_title')}
          </h1>

          <p className="text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            {t('hero_subtitle')}
          </p>

          {/* Glass Search Bar */}
          <div className="max-w-2xl mx-auto relative group z-30" ref={wrapperRef}>
             <input
               type="text"
               value={query}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
               onFocus={() => { if (query.length > 0 && language === 'he') setShowSuggestions(true); }}
               placeholder={t('search_placeholder')}
               className={`glass-input w-full py-5 md:py-6 rounded-[2rem] font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-apple hover:shadow-glass-hover focus:scale-[1.01]
                 ${language === 'he' ? 'pr-6 pl-20 md:pl-40' : 'pl-6 pr-20 md:pr-40'}
                 text-lg md:text-xl placeholder:text-base md:placeholder:text-xl placeholder:leading-normal`}
               dir={language === 'he' ? 'rtl' : 'ltr'}
             />
             
             {/* Search Button */}
             <button 
               onClick={() => handleSearch()}
               className={`absolute ${language === 'he' ? 'left-2' : 'right-2'} top-2 bottom-2 
                 glass-btn-primary
                 px-4 md:px-8 rounded-[1.6rem] 
                 font-black tracking-wide
                 flex items-center gap-2 z-10 group/btn`}
             >
               {loading ? (
                 <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 </div>
               ) : (
                 <span className="hidden md:inline">{t('search_button')}</span>
               )}
             </button>

             {/* Suggestions Dropdown */}
             {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-4 right-4 mt-2 glass-panel rounded-3xl overflow-hidden z-50 max-h-72 overflow-y-auto text-right animate-fade-in-up shadow-2xl border border-white/50 backdrop-blur-xl">
                  {suggestions.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="px-6 py-4 hover:bg-blue-50/50 dark:hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-gray-100/50 dark:border-gray-700/50 last:border-0 group"
                    >
                      <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">{item.icon}</span>
                      <span className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-brand-blue dark:group-hover:text-blue-300 transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
             )}
          </div>
          
          {/* Main App Options Grid - Displayed when NO search data is present */}
          {!data && onNavigate && (
            <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-gray-400 font-bold mb-6 text-sm tracking-widest uppercase">תפריט מהיר</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
                {HOME_OPTIONS.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => onNavigate(opt.id)}
                    className="glass-btn p-6 rounded-[2rem] flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300 group bg-white/60 dark:bg-slate-800/60 shadow-sm hover:shadow-lg border-2 border-transparent hover:border-white/50"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${opt.color} bg-opacity-20 transition-transform group-hover:scale-110`}>
                      {opt.icon}
                    </div>
                    <span className="text-lg font-black text-gray-700 dark:text-gray-300 group-hover:text-brand-blue dark:group-hover:text-white transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Result Section (Only appears when searching) */}
      <section className={`px-4 pb-20 relative z-10 min-h-[50vh] transition-all duration-500 ${data ? 'mt-8' : '-mt-8'}`}>
        <div className="max-w-6xl mx-auto">
          
          {error && (
            <div className="glass-panel p-10 rounded-[2.5rem] text-center max-w-xl mx-auto mt-12 animate-fade-in-up">
              <div className="text-6xl mb-6 opacity-50 animate-bounce">🔍</div>
              <h3 className="text-2xl font-black mb-2 dark:text-white">{t('no_result_title')}</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button onClick={() => { setQuery(''); setError(null); }} className="text-brand-blue font-bold hover:underline">
                  {t('try_searching_else')}
              </button>
            </div>
          )}

          {data && (
            <div className="animate-fade-in-up duration-500 max-w-2xl mx-auto">
               <button onClick={resetSearch} className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue transition-colors px-4 group">
                 <span className="transform group-hover:-translate-x-1 transition-transform">→</span> {t('back_to_search')}
               </button>
               <ResultCard data={data} />
               <div className="text-center mt-12">
                 <button onClick={resetSearch} className="glass-btn px-6 py-3 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300">
                   ↺ {t('search_again')}
                 </button>
               </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
