
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'he' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav_home': { he: 'ברכות', en: 'Blessings' },
  'nav_halacha': { he: 'הלכה', en: 'Halacha' },
  'nav_siddur': { he: 'סידור', en: 'Siddur' },
  'nav_shabbat': { he: 'שבת', en: 'Shabbat' },
  'nav_zmanim': { he: 'זמנים', en: 'Times' },
  'nav_tracker': { he: 'מדד', en: 'Tracker' },
  'nav_trivia': { he: 'טריוויה', en: 'Trivia' },
  'nav_blog': { he: 'בלוג', en: 'Blog' },
  
  // Home / BrachotPage
  'hero_title': { he: 'מה מברכים?', en: 'What\'s the Blessing?' },
  'hero_subtitle': { he: 'כל המידע ההלכתי במקום אחד. פשוט הקלידו את שם המאכל וקבלו תשובה מיידית.', en: 'Halachic guide for food. Type a food name and get an instant answer.' },
  'search_placeholder': { he: 'מה תרצו לאכול היום?', en: 'What would you like to eat?' },
  'search_button': { he: 'חפש', en: 'Search' },
  'tip_label': { he: 'טיפ: חשוב לכוון במשמעות הברכה בעת האמירה', en: 'Tip: Have intent (Kavana) when saying the blessing' },
  'rule_label_pre': { he: '* כלל ידוע:', en: '* General Rule:' },
  'rule_label_text': { he: 'אם אינך יודע מה לברך ואין אפשרות לברר, ברכת "שהכל נהיה בדברו" פוטרת את הכל בדיעבד.', en: 'If in doubt and unable to verify, the blessing "Shehakol" covers everything post-facto.' },
  'not_found_error': { he: 'מצטערים, המאכל הזה לא נמצא במאגר שלנו כרגע. נסו לחפש מאכל אחר.', en: 'Sorry, this item is not in our database. Try searching for something else.' },
  'back_to_search': { he: 'חזרה לחיפוש', en: 'Back to Search' },
  'search_again': { he: 'חפש מאכל אחר', en: 'Search Another Item' },
  'try_searching_else': { he: 'נסה לחפש משהו אחר', en: 'Try searching for something else' },
  'no_result_title': { he: 'לא נמצאה תוצאה', en: 'No Result Found' },
  'quick_shortcuts': { he: 'קיצורי דרך', en: 'Shortcuts' },
  'tefilat_haderech': { he: 'תפילת הדרך', en: 'Traveler\'s Prayer' },
  'tefilat_haderech_sub': { he: 'לשמירה בדרכים', en: 'For safety on the road' },
  'random_psalm': { he: 'פרק תהילים', en: 'Psalm (Tehillim)' },
  'random_psalm_sub': { he: 'אקראי לחיזוק', en: 'Random chapter' },
  'daily_chizuk': { he: '✨ חיזוק יומי', en: '✨ Daily Inspiration' },
  'daily_halacha': { he: 'הלכה יומית', en: 'Daily Halacha' },
  'click_for_answer': { he: 'לחץ להצגת התשובה', en: 'Click to show answer' },
  'another_halacha': { he: 'הלכה אחרת', en: 'Next Halacha' },
  'another_quote': { he: 'ציטוט אחר ↻', en: 'New Quote ↻' },
  'source': { he: 'מקור', en: 'Source' },
  
  // Result Card
  'blessing_first': { he: 'ברכה ראשונה', en: 'First Blessing' },
  'blessing_last': { he: 'ברכה אחרונה', en: 'After Blessing' },
  'halachic_tip': { he: 'טיפ / הערה הלכתית:', en: 'Halachic Tip / Note:' },
  'category_grain': { he: 'מאפה / דגן', en: 'Grain / Pastry' },
  'category_fruit': { he: 'פרי', en: 'Fruit' },
  'category_vegetable': { he: 'ירק', en: 'Vegetable' },
  'category_drink': { he: 'משקה', en: 'Drink' },
  'category_general': { he: 'כללי', en: 'General' },

  // Footer
  'mission_title': { he: 'המשימה שלנו:', en: 'Our Mission:' },
  'mission_text': { he: 'להנגיש את ארון הספרים היהודי והמסורת העתיקה לכל יהודי באשר הוא, באמצעות טכנולוגיה מתקדמת ועיצוב מרהיב, ולחבר בין לבבות.', en: 'To make Jewish wisdom and tradition accessible to every Jew, through advanced technology and beautiful design.' },
  'quick_nav': { he: 'ניווט מהיר', en: 'Quick Nav' },
  'new_tools': { he: 'כלים חדשים', en: 'New Tools' },
  'rights_reserved': { he: 'כל הזכויות שמורות.', en: 'All rights reserved.' },
  'copy_permitted': { he: 'ניתן להעתיק ולהשתמש בתוכן לזיכוי הרבים.', en: 'Content may be copied and used for public merit.' },
  'built_with_love': { he: 'נבנה באהבה לעם ישראל ולזיכוי הרבים.', en: 'Built with love for Am Yisrael.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  useEffect(() => {
    // Force Hebrew settings
    localStorage.setItem('language', 'he');
    document.documentElement.lang = 'he';
    document.documentElement.dir = 'rtl';
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction: 'rtl', 
      setLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
