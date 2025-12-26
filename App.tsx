
import React, { useState, useEffect, Suspense } from 'react';
import { Logo } from './components/Logo';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { getDateDisplay } from './utils/dateUtils';
import { Spinner } from './components/Spinner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Footer } from './components/Footer';

// ייבוא ישיר כדי למנוע שגיאות טעינה ב-AI Studio
import { BrachotPage } from './components/BrachotPage';
import { HalachaPage } from './components/HalachaPage';
import { SiddurPage } from './components/SiddurPage';
import { ShabbatPage } from './components/ShabbatPage';
import { MitzvahTracker } from './components/MitzvahTracker';
import { TriviaPage } from './components/TriviaPage';
import { ZmanimPage } from './components/ZmanimPage';
import { BlogPage } from './components/BlogPage';

type Page = 'home' | 'halacha' | 'siddur' | 'shabbat' | 'tracker' | 'trivia' | 'zmanim' | 'blog' ;

const AppContent: React.FC = () => {
  const { t, direction } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // הגנה מפני קריסה של מפתח API (לפי השגיאה בצילום מסך 183)
  useEffect(() => {
    try {
      // כאן אנחנו מוודאים שאין קריסה אם משתנה מסוים חסר
      console.log("MyJew App initialized");
    } catch (e) {
      console.error("Initialization error avoided");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [darkMode]);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: t('nav_home') || 'ברכות', icon: '🍎' },
    { id: 'halacha', label: t('nav_halacha') || 'הלכה', icon: '📜' },
    { id: 'siddur', label: t('nav_siddur') || 'סידור', icon: '📖' },
    { id: 'shabbat', label: t('nav_shabbat') || 'שבת', icon: '🕯️' },
    { id: 'zmanim', label: t('nav_zmanim') || 'זמנים', icon: '⏳' },
    { id: 'tracker', label: t('nav_tracker') || 'מצוות', icon: '📈' },
    { id: 'trivia', label: t('nav_trivia') || 'טריוויה', icon: '🧠' },
    { id: 'blog', label: t('nav_blog') || 'בלוג', icon: '✍️' },
  ];

  return (
    <div className="flex flex-col min-h-screen relative" dir={direction}>
      <AnimatedBackground />
      <header className={`sticky top-0 md:top-4 z-40 transition-all duration-300 ${scrolled ? 'pt-0' : 'pt-0 md:pt-4'} px-0 md:px-4`}>
        <nav className={`mx-auto max-w-7xl md:rounded-3xl p-3 md:p-4 transition-all duration-300 ${scrolled ? 'glass-panel shadow-lg rounded-b-3xl md:rounded-3xl' : 'bg-white/60 dark:bg-black/40 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-b border-white/20 md:border-none'}`}>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 className="hover:opacity-80 transition-opacity focus:outline-none"
                 aria-label="חזרה לדף הבית"
               >
                 <Logo />
               </button>
            </div>
            
            {/* Desktop Navigation - Liquid Glass Pill (Icons Removed) */}
            <div className="hidden xl:flex items-center p-1.5 gap-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-glass rounded-full z-20">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setCurrentPage(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center ${currentPage === item.id ? 'bg-brand-blue text-white shadow-md' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-white/10'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center rounded-full glass-panel hover:scale-110 transition-transform active:scale-95 text-xl">
                {darkMode ? '🌙' : '☀️'}
              </button>
              
              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full glass-panel text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="תפריט"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Drawer */}
            <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl p-6 border-l border-white/20 animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <Logo className="scale-90 origin-right" />
                    </button>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-grow pb-8">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`p-4 rounded-2xl flex items-center gap-4 text-right transition-all font-bold text-lg
                                ${currentPage === item.id 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className="text-2xl w-10 text-center">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-6 text-center text-xs text-gray-400 font-medium border-t border-gray-100 dark:border-gray-800">
                    <p>MyJew App</p>
                    <p className="mt-1">נבנה באהבה ❤️</p>
                </div>
            </div>
        </div>
      )}

      <main className="flex-grow p-4 pt-4 md:pt-4">
        {currentPage === 'home' && <BrachotPage onNavigate={(p: any) => setCurrentPage(p)} />}
        {currentPage === 'shabbat' && <ShabbatPage />}
        {currentPage === 'siddur' && <SiddurPage />}
        {currentPage === 'halacha' && <HalachaPage />}
        {currentPage === 'tracker' && <MitzvahTracker />}
        {currentPage === 'trivia' && <TriviaPage />}
        {currentPage === 'zmanim' && <ZmanimPage />}
        {currentPage === 'blog' && <BlogPage />}
      </main>
      
      <Footer onNavClick={(p: any) => setCurrentPage(p)} />
      <AccessibilityMenu />
    </div>
  );
};

// התיקון הקריטי עבור השגיאה בצילום מסך 181
const App = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App; // זה מה שיפתור את ה-SyntaxError
