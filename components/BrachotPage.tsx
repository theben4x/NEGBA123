import React, { useState, useEffect, useRef } from 'react';
import { BlessingResult, FoodItem, InspirationQuote, Prayer, HalachaItem } from '../types';
import { ResultCard } from './ResultCard';
import { COMMON_FOODS, CHIZUK_QUOTES, TEHILLIM_DB, TEFILAT_HADERECH, HALACHA_DB } from '../constants';
import { getBlessingInfo } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface BrachotPageProps {
  onNavigate?: (page: string) => void;
}

export const BrachotPage: React.FC<BrachotPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<BlessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<InspirationQuote>(CHIZUK_QUOTES[0]);
  const [dailyHalacha, setDailyHalacha] = useState<HalachaItem | null>(null);
  const [showHalachaAnswer, setShowHalachaAnswer] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDailyQuote(CHIZUK_QUOTES[Math.floor(Math.random() * CHIZUK_QUOTES.length)]);
    setDailyHalacha(HALACHA_DB[Math.floor(Math.random() * HALACHA_DB.length)]);
    
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedPrayer && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedPrayer]);

  const rotateQuote = () => {
    let newQuote;
    do { newQuote = CHIZUK_QUOTES[Math.floor(Math.random() * CHIZUK_QUOTES.length)]; } 
    while (newQuote.text === dailyQuote.text && CHIZUK_QUOTES.length > 1);
    setDailyQuote(newQuote);
  };

  const rotateHalacha = () => {
    let newHalacha;
    setShowHalachaAnswer(false);
    do { newHalacha = HALACHA_DB[Math.floor(Math.random() * HALACHA_DB.length)]; } 
    while (newHalacha?.id === dailyHalacha?.id && HALACHA_DB.length > 1);
    setDailyHalacha(newHalacha);
  };

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
  const handlePrayerClick = (prayer: Prayer) => setSelectedPrayer(prayer);
  const closePrayerModal = () => setSelectedPrayer(null);
  const resetSearch = () => { setData(null); setQuery(''); setSuggestions([]); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const isTehillim = (prayer: Prayer | null) => prayer && TEHILLIM_DB.some(p => p.title === prayer.title);
  const handleNextTehillim = () => {
    if (!selectedPrayer) return;
    let newPsalm;
    do { newPsalm = TEHILLIM_DB[Math.floor(Math.random() * TEHILLIM_DB.length)]; } 
    while (newPsalm.title === selectedPrayer.title && TEHILLIM_DB.length > 1);
    setSelectedPrayer(newPsalm);
  };

  const BLESSING_TYPES = [
    { title: 'המוציא', desc: 'לחם מחמשת מיני דגן.', icon: '🍞' },
    { title: 'מזונות', desc: 'מאפים ותבשילים מדגן.', icon: '🥨' },
    { title: 'הגפן', desc: 'יין ומיץ ענבים טבעי.', icon: '🍷' },
    { title: 'העץ', desc: 'פירות העץ.', icon: '🌳' },
    { title: 'האדמה', desc: 'ירקות ופירות האדמה.', icon: '🌱' },
    { title: 'שהכל', desc: 'בשר, חלב, מים וכל השאר.', icon: '🥛' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Liquid Hero Section */}
      <section className={`relative transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${data ? 'max-h-0 opacity-0 overflow-hidden scale-95 origin-top' : 'py-12 md:py-20 scale-100 opacity-100'}`}>
        
        <div className="relative z-10 w-full max-w-5xl px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 drop-shadow-sm leading-tight transition-transform hover:scale-[1.01] duration-500">
            {t('hero_title')}
          </h1>

          <div className="flex items-center justify-center mb-8">
             <span className="glass-panel px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-brand-gold flex items-center gap-2 animate-pulse-slow">
                <span>💡</span> {t('tip_label')}
             </span>
          </div>

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
             
             {/* Enhanced Search Button */}
             <button 
               onClick={() => handleSearch()}
               className={`absolute ${language === 'he' ? 'left-2' : 'right-2'} top-2 bottom-2 
                 bg-blue-600 hover:bg-blue-700 text-white shadow-lg
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
                 <>
                   <span className="hidden md:inline">{t('search_button')}</span>
                   <svg className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </>
               )}
             </button>

             {/* Glass Dropdown */}
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

          {/* Simplified Quick Shortcuts */}
          {!data && (
            <div className="mt-8 md:mt-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-center flex-wrap gap-4 max-w-2xl mx-auto">
                <button onClick={() => handlePrayerClick(TEFILAT_HADERECH)} className="glass-btn px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group w-32 md:w-40">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🚍</span>
                    <span className="font-bold text-sm">תפילת הדרך</span>
                </button>
                <button onClick={() => handlePrayerClick(TEHILLIM_DB[Math.floor(Math.random() * TEHILLIM_DB.length)])} className="glass-btn px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors group w-32 md:w-40">
                    <span className="text-3xl group-hover:scale-110 transition-transform">📖</span>
                    <span className="font-bold text-sm">פרק תהילים</span>
                </button>
                <button onClick={() => onNavigate?.('blog')} className="glass-btn px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors group w-32 md:w-40">
                    <span className="text-3xl group-hover:scale-110 transition-transform">✍️</span>
                    <span className="font-bold text-sm">מאמרים</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
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

          {!data && !error && (
            <div className="mt-12 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Inspiration Widget */}
                  <div className="relative group rounded-[2.5rem] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                     <div className="relative h-full glass-panel p-6 md:p-8 rounded-[2.5rem] text-center flex flex-col justify-center items-center hover:shadow-glass-hover transition-all bg-white/80 dark:bg-gray-900/80 overflow-hidden border-2 border-transparent hover:border-brand-gold/50 hover:-translate-y-1 duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <div className="text-xs font-black tracking-widest text-brand-gold uppercase mb-6 bg-yellow-400/10 px-3 py-1 rounded-full">{t('daily_chizuk')}</div>
                        <blockquote className="text-xl md:text-3xl font-black text-gray-800 dark:text-white mb-6 leading-tight relative z-10 transition-colors group-hover:text-brand-dark dark:group-hover:text-white">"{dailyQuote.text}"</blockquote>
                        <cite className="text-gray-500 font-bold not-italic block mb-6">{dailyQuote.author}</cite>
                        <button onClick={rotateQuote} className="glass-btn text-brand-blue text-sm font-bold px-5 py-2 rounded-full">
                           {t('another_quote')}
                        </button>
                     </div>
                  </div>

                  {/* Halacha Widget */}
                  {dailyHalacha && (
                     <div className="relative group rounded-[2.5rem] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="relative h-full glass-panel p-6 md:p-8 rounded-[2.5rem] hover:shadow-glass-hover transition-all bg-white/80 dark:bg-gray-900/80 overflow-hidden flex flex-col border-2 border-transparent hover:border-brand-blue/50 hover:-translate-y-1 duration-300">
                           {/* Decorative Blue Corner */}
                           <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/20 rounded-br-[100px] -ml-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                           
                           <div className="flex justify-between items-center mb-6 mt-2 relative z-10">
                              <h3 className="font-black text-xl text-gray-800 dark:text-white flex items-center gap-2">📜 {t('daily_halacha')}</h3>
                              <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-gray-500 dark:text-gray-300">{dailyHalacha.topic}</span>
                           </div>
                           <div className="flex-grow relative z-10">
                              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">{dailyHalacha.question}</p>
                              {showHalachaAnswer ? (
                                 <div className="bg-gray-50/50 dark:bg-black/20 p-5 rounded-2xl animate-fade-in border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{dailyHalacha.answer}</p>
                                    <div className="mt-2 text-xs text-gray-400 font-bold">{t('source')}: {dailyHalacha.source}</div>
                                 </div>
                              ) : (
                                 <button onClick={() => setShowHalachaAnswer(true)} className="glass-btn w-full py-6 md:py-8 rounded-2xl text-brand-blue font-bold">
                                    {t('click_for_answer')}
                                 </button>
                              )}
                           </div>
                           <div className="mt-6 text-center relative z-10">
                              <button onClick={rotateHalacha} className="text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors">{t('another_halacha')}</button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               {/* Blessing Dictionary Grid */}
               <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-center text-3xl font-black text-gray-900 dark:text-white mb-10">{language === 'he' ? 'מילון הברכות' : 'Blessings Dictionary'}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                     {BLESSING_TYPES.map((type, i) => (
                        <div key={type.title} className="relative group rounded-3xl" style={{ animationDelay: `${i * 100}ms` }}>
                           <div className="glass-btn relative h-full p-4 md:p-6 rounded-3xl flex flex-col items-center text-center gap-3">
                              <div className="text-3xl md:text-4xl p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                              <div>
                                 <div className="font-black text-base md:text-lg text-gray-800 dark:text-white">{type.title}</div>
                                 <div className="text-xs text-gray-500 font-bold mt-1 leading-tight opacity-80 group-hover:opacity-100 transition-opacity">{type.desc}</div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Glass Modal */}
      {selectedPrayer && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in" onClick={closePrayerModal}>
            <div className="glass-panel w-full max-w-lg max-h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="p-6 md:p-8 text-center bg-white/40 dark:bg-white/5 border-b border-white/10">
                  <div className="text-5xl md:text-6xl mb-4 transform hover:scale-110 transition-transform duration-300 inline-block">{selectedPrayer.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-black dark:text-white">{selectedPrayer.title}</h3>
                  <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-wide">{selectedPrayer.description}</p>
               </div>
               <div ref={modalScrollRef} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
                  <p className="text-lg md:text-2xl font-serif text-center leading-loose text-gray-800 dark:text-gray-100 whitespace-pre-line">
                     {selectedPrayer.text}
                  </p>
               </div>
               <div className="p-6 bg-gray-50/50 dark:bg-black/20 flex gap-3 justify-center">
                  {isTehillim(selectedPrayer) && (
                     <button onClick={handleNextTehillim} className="glass-btn-primary px-6 py-3 rounded-xl font-bold shadow-lg">{language === 'he' ? 'קרא עוד ↻' : 'Next'}</button>
                  )}
                  <button onClick={closePrayerModal} className="glass-btn px-6 py-3 rounded-xl font-bold shadow-md">{language === 'he' ? 'סגור' : 'Close'}</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}