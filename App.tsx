
import React, { useState, useEffect, Suspense } from 'react';
import { Logo } from './components/Logo';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { getDateDisplay } from './utils/dateUtils';
import { Spinner } from './components/Spinner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Footer } from './components/Footer';

// Lazy load components
const BrachotPage = React.lazy(() => import('./components/BrachotPage').then(module => ({ default: module.BrachotPage })));
const HalachaPage = React.lazy(() => import('./components/HalachaPage').then(module => ({ default: module.HalachaPage })));
const SiddurPage = React.lazy(() => import('./components/SiddurPage').then(module => ({ default: module.SiddurPage })));
const ShabbatPage = React.lazy(() => import('./components/ShabbatPage').then(module => ({ default: module.ShabbatPage })));
const MitzvahTracker = React.lazy(() => import('./components/MitzvahTracker').then(module => ({ default: module.MitzvahTracker })));
const TriviaPage = React.lazy(() => import('./components/TriviaPage').then(module => ({ default: module.TriviaPage })));
const ZmanimPage = React.lazy(() => import('./components/ZmanimPage').then(module => ({ default: module.ZmanimPage })));
const BlogPage = React.lazy(() => import('./components/BlogPage').then(module => ({ default: module.BlogPage })));
const VideoGeneratorPage = React.lazy(() => import('./components/VideoGeneratorPage').then(module => ({ default: module.VideoGeneratorPage })));
const RabbiChat = React.lazy(() => import('./components/RabbiChat').then(module => ({ default: module.RabbiChat })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));

type Page = 'home' | 'halacha' | 'siddur' | 'shabbat' | 'tracker' | 'trivia' | 'zmanim' | 'blog' | 'video' | 'chat' | 'contact';

// Inner component to use the context
const AppContent: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [dateInfo, setDateInfo] = useState({ dayName: '', gregorianDate: '', hebrewDate: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // SEO
  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: 'מדריך הברכות | MyJew',
      halacha: 'שו"ת ומאגר הלכתי | MyJew',
      siddur: 'סידור ותפילות | MyJew',
      shabbat: 'זמני כניסת שבת | MyJew',
      tracker: 'המדד היומי | MyJew',
      trivia: 'טריוויה יהודית | MyJew',
      zmanim: 'זמני היום בהלכה | MyJew',
      blog: 'בלוג יהדות וחיזוק | MyJew',
      video: 'יוצר וידאו | MyJew',
      chat: 'שאל את הרב | MyJew',
      contact: 'צור קשר | MyJew',
    };
    document.title = pageTitles[currentPage];
  }, [currentPage]);

  useEffect(() => {
    setDateInfo(getDateDisplay());
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: t('nav_home'), icon: '🍎' },
    { id: 'halacha', label: t('nav_halacha'), icon: '📜' },
    { id: 'siddur', label: t('nav_siddur'), icon: '📖' },
    { id: 'shabbat', label: t('nav_shabbat'), icon: '🕯️' },
    { id: 'zmanim', label: t('nav_zmanim'), icon: '⏳' },
    { id: 'tracker', label: t('nav_tracker'), icon: '📈' },
    { id: 'trivia', label: t('nav_trivia'), icon: '🧠' },
    { id: 'blog', label: t('nav_blog'), icon: '✍️' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans relative selection:bg-brand-blue/30 selection:text-brand-blue" dir={direction}>
      
      {/* Enhanced Animated Background */}
      <AnimatedBackground />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-brand-blue text-white p-4 rounded-xl z-50">
        Skip to main content
      </a>

      {/* Floating Glass Navbar */}
      <header className={`sticky top-4 z-40 px-4 transition-all duration-300`}>
        <nav className={`mx-auto max-w-7xl rounded-3xl transition-all duration-300 ${scrolled ? 'glass-panel shadow-glass p-2' : 'bg-transparent py-4'}`}>
          <div className="flex items-center justify-between px-2">
            
            {/* Logo Area */}
            <div 
              onClick={() => handleNavClick('home')}
              className="cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-200 flex items-center gap-2"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
            >
              <Logo className="scale-90" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-2 bg-white/40 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-sm overflow-x-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'glass-btn-primary shadow-sm scale-100' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full glass-btn flex items-center justify-center text-gray-600 dark:text-yellow-400"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden w-10 h-10 rounded-full glass-btn flex items-center justify-center text-gray-700 dark:text-gray-200"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                 </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown (Glass) */}
          {isMobileMenuOpen && (
            <div className="xl:hidden absolute top-full left-0 right-0 mt-4 mx-2 glass-panel rounded-3xl p-4 animate-fade-in-up z-50">
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl font-bold transition-all ${
                      currentPage === item.id
                        ? 'glass-btn-primary'
                        : 'glass-btn text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow w-full max-w-[1920px] mx-auto relative z-10 pt-4 px-4">
        <Suspense fallback={<Spinner />}>
          {currentPage === 'home' && <BrachotPage />}
          {currentPage === 'shabbat' && <ShabbatPage />}
          {currentPage === 'siddur' && <SiddurPage />}
          {currentPage === 'halacha' && <HalachaPage />}
          {currentPage === 'tracker' && <MitzvahTracker />}
          {currentPage === 'trivia' && <TriviaPage />}
          {currentPage === 'zmanim' && <ZmanimPage />}
          {currentPage === 'blog' && <BlogPage />}
          {currentPage === 'video' && <VideoGeneratorPage />}
          {currentPage === 'chat' && <RabbiChat />}
          {currentPage === 'contact' && <ContactPage />}
        </Suspense>
      </main>

      {/* Comprehensive Footer */}
      <Footer onNavClick={handleNavClick} />

      <AccessibilityMenu />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
