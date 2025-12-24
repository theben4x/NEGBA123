
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const PremiumPage: React.FC = () => {
  const { t } = useLanguage();

  const plans = [
    {
      id: 'free',
      name: t('plan_free'),
      price: '0 ₪',
      features: [
        { text: 'מנוע חיפוש ברכות', included: true },
        { text: 'סידור ותהילים', included: true },
        { text: 'זמני היום ושבת', included: true },
        { text: 'יצירת וידאו (מוגבל)', included: false },
        { text: 'צ\'אט בוט רב (מוגבל)', included: false },
      ],
      cta: t('current_plan'),
      primary: false
    },
    {
      id: 'pro',
      name: 'צדיק (Pro)',
      price: '18 ₪',
      period: t('per_month'),
      features: [
        { text: 'כל מה שיש בחינם', included: true },
        { text: t('feature_ai_video'), included: true },
        { text: t('feature_ai_chat'), included: true },
        { text: 'גישה מוקדמת לפיצ\'רים', included: true },
        { text: t('feature_ads'), included: true },
      ],
      cta: t('select_plan'),
      primary: true,
      badge: t('most_popular')
    },
    {
      id: 'partner',
      name: t('plan_partner'),
      price: '50 ₪',
      period: t('per_month'),
      features: [
        { text: 'כל יתרונות ה-Pro', included: true },
        { text: 'תרומה לאחזקת השרתים', included: true },
        { text: 'הקדשת לימוד יומית', included: true },
        { text: 'תמיכה אישית בוואטסאפ', included: true },
      ],
      cta: 'הפוך לשותף',
      primary: false
    }
  ];

  return (
    <div className="animate-fade-in-up pb-20 min-h-[calc(100vh-140px)]">
      {/* Hero Header */}
      <section className="relative text-center py-16 px-4 mb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
          {t('premium_title')}
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t('premium_subtitle')}
        </p>
      </section>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative glass-panel rounded-[2.5rem] p-8 transition-all duration-300 ${plan.primary ? 'scale-105 border-brand-blue shadow-glow z-10' : 'border-white/40 dark:border-white/10 hover:scale-105'}`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1 text-gray-900 dark:text-white">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 font-bold mb-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 text-sm font-bold ${feature.included ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 line-through'}`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${feature.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {feature.included ? '✓' : '✕'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-black transition-all shadow-md ${
                  plan.primary 
                    ? 'glass-btn-primary hover:shadow-lg hover:-translate-y-1' 
                    : 'glass-btn hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-20 text-center glass-panel p-10 rounded-[3rem] max-w-4xl mx-auto">
          <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-6">למה לשדרג?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">🚀</div>
              <h5 className="font-bold text-lg">טכנולוגיה מתקדמת</h5>
              <p className="text-gray-500 text-sm">שימוש במודלים היקרים והחכמים ביותר של Google (Gemini 2.0 & Veo).</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl bg-purple-50 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">🔒</div>
              <h5 className="font-bold text-lg">ללא פרסומות</h5>
              <p className="text-gray-500 text-sm">חווית שימוש נקייה, מהירה וממוקדת בתוכן היהודי נטו.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl bg-green-50 dark:bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">❤️</div>
              <h5 className="font-bold text-lg">זיכוי הרבים</h5>
              <p className="text-gray-500 text-sm">התרומה שלך מאפשרת לנו להחזיק את השרתים ולפתח כלים חדשים.</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-8">
          * החיוב מתבצע בצורה מאובטחת. ניתן לבטל בכל עת.
        </p>
      </div>
    </div>
  );
};
