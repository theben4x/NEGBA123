import React from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavClick: (page: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const { t } = useLanguage();

  const links = {
    general: [
      { id: 'home', label: t('nav_home') },
      { id: 'halacha', label: t('nav_halacha') },
      { id: 'siddur', label: t('nav_siddur') },
      { id: 'shabbat', label: t('nav_shabbat') },
    ],
    tools: [
      { id: 'zmanim', label: t('nav_zmanim') },
      { id: 'tracker', label: t('nav_tracker') },
      { id: 'trivia', label: t('nav_trivia') },
      { id: 'blog', label: t('nav_blog') },
    ]
  };

  return (
    <footer className="mt-24 relative z-10" dir="rtl">
      <div className="glass-panel mx-4 mb-4 rounded-[2.5rem] p-10 md:p-16 border-t border-white/40 dark:border-gray-700/50 shadow-glass">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 text-right">
            
            {/* Brand Section */}
            <div className="lg:col-span-4 flex flex-col items-center md:items-start space-y-6">
              <Logo className="scale-110 origin-right" />
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-sm">
                {t('mission_text')}
              </p>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-8">
              
              {/* Column 1 */}
              <div className="text-right">
                <h4 className="font-black text-gray-900 dark:text-white mb-6 text-sm md:text-lg">ניווט מהיר</h4>
                <ul className="space-y-4">
                  {links.general.map((link) => (
                    <li key={link.id}>
                      <button 
                        onClick={() => onNavClick(link.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-gold transition-colors font-medium text-sm md:text-base text-right w-full"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div className="text-right">
                <h4 className="font-black text-gray-900 dark:text-white mb-6 text-sm md:text-lg">כלים שימושיים</h4>
                <ul className="space-y-4">
                  {links.tools.map((link) => (
                    <li key={link.id}>
                      <button 
                        onClick={() => onNavClick(link.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-gold transition-colors font-medium text-sm md:text-base text-right w-full"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold text-gray-400">
            <p>© {new Date().getFullYear()} MyJew. {t('rights_reserved')}</p>
            <p className="flex items-center gap-1">
              {t('built_with_love')} <span className="text-red-500">❤️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};