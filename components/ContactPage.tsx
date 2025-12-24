
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'consultation',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');

    // SIMULATION: In a real app, you would use EmailJS or fetch() to your backend here.
    // Example for real implementation:
    // await emailjs.send('service_id', 'template_id', formData, 'public_key');
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', topic: 'consultation', message: '' });
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="glass-panel p-10 rounded-[2.5rem] text-center max-w-lg w-full border border-green-100 dark:border-green-900">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm animate-bounce">
            📬
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">ההודעה נשלחה!</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            תודה שפנית אלינו. קיבלנו את פנייתך והרב או הצוות ישתדלו לחזור אליך בהקדם האפשרי.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="glass-btn px-8 py-3 rounded-xl font-bold text-green-700 dark:text-green-400"
          >
            שלח הודעה נוספת
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-indigo-50 dark:bg-slate-800 text-center py-10 px-4 rounded-b-[2.5rem] border-b border-indigo-100 dark:border-slate-700 transition-colors duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-indigo-900 dark:text-indigo-300 mb-3">
          צור קשר / התייעצות
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          יש לך שאלה לרב? רוצה להתייעץ או לדווח על תקלה? אנחנו כאן בשבילך.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 mt-12">
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/60 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 pr-2">שם מלא</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ישראל ישראלי"
                  className="glass-input w-full p-4 rounded-xl font-medium focus:ring-4 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 pr-2">כתובת אימייל</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="glass-input w-full p-4 rounded-xl font-medium focus:ring-4 focus:ring-indigo-500/20 text-gray-900 dark:text-white text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 pr-2">נושא הפנייה</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="glass-input w-full p-4 rounded-xl font-bold cursor-pointer focus:ring-4 focus:ring-indigo-500/20 text-gray-900 dark:text-white appearance-none"
              >
                <option value="consultation">התייעצות אישית / שאלה לרב</option>
                <option value="technical">דיווח על תקלה טכנית</option>
                <option value="feedback">משוב והצעות לייעול</option>
                <option value="business">שיתופי פעולה / עסקי</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 pr-2">תוכן ההודעה</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="כתוב כאן את שאלתך או פנייתך בפירוט..."
                rows={5}
                className="glass-input w-full p-4 rounded-xl font-medium resize-none focus:ring-4 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-lg transition-all flex items-center justify-center gap-3
                ${status === 'sending' ? 'bg-gray-400 cursor-not-allowed' : 'glass-btn-primary hover:scale-[1.02]'}`}
            >
              {status === 'sending' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  שולח...
                </>
              ) : (
                <>
                  <span>✉️</span> שלח פנייה
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 font-medium">
              * הפניות נשמרות בדיסקרטיות מלאה.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};
