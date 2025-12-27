import React, { useState, useEffect } from 'react';
import { ISRAEL_CITIES } from '../constants';
import { City, HebcalResponse, ShabbatTimes } from '../types';
import { Spinner } from './Spinner';
import { formatDate } from '../utils/dateUtils';

export const ShabbatPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(ISRAEL_CITIES[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shabbatData, setShabbatData] = useState<ShabbatTimes | null>(null);
  const [shabbatDateDisplay, setShabbatDateDisplay] = useState<{ hebrew: string, gregorian: string } | null>(null);

  useEffect(() => {
    const fetchShabbatTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${selectedCity.geonameid}&M=on`);
        if (!response.ok) throw new Error('Failed');
        const data: HebcalResponse = await response.json();
        
        let candles = '', havdalah = '', parasha = '', havdalahDateObj: Date | null = null;

        data.items.forEach(item => {
          if (item.category === 'candles') {
             candles = new Date(item.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
          }
          if (item.category === 'havdalah') { 
             // יצירת אובייקט תאריך יציב כדי ש-TypeScript לא יתלונן
             const dateObj = new Date(item.date);
             havdalahDateObj = dateObj; 
             havdalah = dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }); 
          }
          if (item.category === 'parashat') parasha = item.hebrew;
        });

        // Set Date Display based on Havdalah date (Saturday)
        if (havdalahDateObj) {
            const dateInfo = formatDate(havdalahDateObj);
            setShabbatDateDisplay({
                hebrew: `${dateInfo.dayName}, ${dateInfo.hebrewDate}`,
                gregorian: dateInfo.gregorianDate
            });
        }

        let rabbeinuTam = '';
        if (havdalahDateObj) {
           // שימוש ב-as any כדי למנוע את שגיאת ה-getTime ב-Vercel
           const rtDate = new Date((havdalahDateObj as any).getTime() + 35 * 60000);
           rabbeinuTam = rtDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        }

        setShabbatData({ candles, havdalah, parasha, rabbeinuTam });
      } catch (err) { setError('שגיאה בטעינת נתונים'); } finally { setLoading(false); }
    };
    fetchShabbatTimes();
  }, [selectedCity]);

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      <section className="glass-panel text-center py-12 px-4 rounded-[3rem] mb-10 mx-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">זמני שבת</h1>
        
        <div className="max-w-xs mx-auto relative mb-6">
           <select 
             value={selectedCity.name}
             onChange={(e) => { const city = ISRAEL_CITIES.find(c => c.name === e.target.value); if (city) setSelectedCity(city); }}
             className="glass-input w-full appearance-none py-3 px-8 rounded-2xl font-bold text-lg text-center cursor-pointer"
           >
             {ISRAEL_CITIES.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))}
           </select>
           <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500">▼</div>
        </div>

        {shabbatDateDisplay && (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
                <div className="bg-blue-50 dark:bg-blue-900/30 text-brand-blue dark:text-blue-300 px-4 py-1 rounded-full text-sm font-bold shadow-sm border border-blue-100 dark:border-blue-800">
                    🗓️ {shabbatDateDisplay.gregorian}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {shabbatDateDisplay.hebrew}
                </div>
            </div>
        )}
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {loading ? <Spinner /> : error ? <div className="text-red-500 text-center font-bold p-8 glass-panel rounded-3xl">{error}</div> : shabbatData && (
          <div className="space-y-6 animate-fade-in">
             <div className="glass-panel p-10 rounded-[3rem] text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div>
               <span className="text-brand-gold font-black tracking-widest uppercase text-sm mb-2 block relative z-10">פרשת השבוע</span>
               <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white relative z-10">{shabbatData.parasha}</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-2">
                   <span className="text-5xl mb-2">🕯️</span>
                   <h3 className="text-gray-500 font-bold">כניסת שבת</h3>
                   <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{shabbatData.candles}</span>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-2">
                   <span className="text-5xl mb-2">✨</span>
                   <h3 className="text-gray-500 font-bold">צאת שבת</h3>
                   <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{shabbatData.havdalah}</span>
                </div>
             </div>
             
             <div className="glass-panel p-6 rounded-3xl flex justify-between items-center px-8">
                <span className="font-bold text-gray-600 dark:text-gray-300">יציאה לרבנו תם</span>
                <span className="text-2xl font-black">{shabbatData.rabbeinuTam}</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};