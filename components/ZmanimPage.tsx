
import React, { useState, useEffect } from 'react';
import { ISRAEL_CITIES } from '../constants';
import { City, ZmanimData } from '../types';
import { Spinner } from './Spinner';
import { formatDate } from '../utils/dateUtils';

export const ZmanimPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(ISRAEL_CITIES[0]); // Default to Jerusalem
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zmanim, setZmanim] = useState<ZmanimData | null>(null);
  const [dateDisplay, setDateDisplay] = useState<{ hebrew: string, gregorian: string } | null>(null);

  useEffect(() => {
    const fetchZmanim = async () => {
      setLoading(true);
      setError(null);
      try {
        const todayObj = new Date();
        // Construct local date string manually to avoid UTC shifts
        const year = todayObj.getFullYear();
        const month = String(todayObj.getMonth() + 1).padStart(2, '0');
        const day = String(todayObj.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        // Update display date
        const formattedDate = formatDate(todayObj);
        setDateDisplay({
            hebrew: `${formattedDate.dayName}, ${formattedDate.hebrewDate}`,
            gregorian: formattedDate.gregorianDate
        });

        const response = await fetch(`https://www.hebcal.com/zmanim?cfg=json&geonameid=${selectedCity.geonameid}&date=${todayStr}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Helper to format ISO string to HH:MM
        const formatTime = (isoString: string) => {
            if (!isoString) return "--:--";
            const date = new Date(isoString);
            return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        };

        setZmanim({
            alotHaShachar: formatTime(data.times.alotHaShachar),
            sunrise: formatTime(data.times.sunrise),
            sofZmanShma: formatTime(data.times.sofZmanShma), // Default is Gra usually
            sofZmanTfila: formatTime(data.times.sofZmanTfila),
            chatzot: formatTime(data.times.chatzot),
            minchaGedola: formatTime(data.times.minchaGedola),
            plagHaMincha: formatTime(data.times.plagHaMincha),
            sunset: formatTime(data.times.sunset),
            tzeit7083deg: formatTime(data.times.tzeit7083deg) // Standard Tzeit
        });

      } catch (err) {
        setError('לא ניתן לטעון זמנים כרגע. אנא נסה שוב.');
      } finally {
        setLoading(false);
      }
    };

    fetchZmanim();
  }, [selectedCity]);

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-orange-50 dark:bg-slate-800 text-center py-10 px-4 rounded-b-[2.5rem] border-b border-orange-100 dark:border-slate-700 transition-colors duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-orange-900 dark:text-orange-300 mb-3">
          זמני היום בהלכה
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          מחשבון זמני הלכה מדויק לכל עיר בארץ.
        </p>

        {/* City Selector */}
        <div className="max-w-xs mx-auto relative mb-6">
           <select 
             value={selectedCity.name}
             onChange={(e) => {
               // Fix: Find city by unique name instead of geonameid
               const city = ISRAEL_CITIES.find(c => c.name === e.target.value);
               if (city) setSelectedCity(city);
             }}
             className="w-full appearance-none bg-white dark:bg-slate-700 border-2 border-orange-200 dark:border-slate-600 text-gray-900 dark:text-white py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-bold text-lg text-center cursor-pointer shadow-sm hover:border-orange-400 transition-colors"
           >
             {ISRAEL_CITIES.map(city => (
               <option key={city.name} value={city.name}>{city.name}</option>
             ))}
           </select>
           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
           </div>
        </div>

        {/* Date Display */}
        {dateDisplay && (
            <div className="flex flex-col items-center gap-1 animate-fade-in">
                <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-4 py-1 rounded-full text-sm font-bold shadow-sm border border-orange-200 dark:border-orange-700">
                    🗓️ {dateDisplay.gregorian}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {dateDisplay.hebrew}
                </div>
            </div>
        )}
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-xl text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        ) : zmanim && (
          <div className="space-y-8 animate-fade-in">
             
             {/* Morning Section */}
             <div>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌅</span> זמני הבוקר
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ZmanCard title="עלות השחר" time={zmanim.alotHaShachar} icon="✨" desc="תחילת היום" />
                    <ZmanCard title="הנץ החמה" time={zmanim.sunrise} icon="☀️" desc="זריחה" highlight />
                    <ZmanCard title="סוף זמן ק&quot;ש" time={zmanim.sofZmanShma} icon="📖" desc="מגן אברהם/גר&quot;א" />
                    <ZmanCard title="סוף זמן תפילה" time={zmanim.sofZmanTfila} icon="🙏" desc="זמן תפילת שחרית" />
                </div>
             </div>

             {/* Noon Section */}
             <div>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-2xl">☀️</span> זמני הצהריים
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ZmanCard title="חצות היום" time={zmanim.chatzot} icon="🕛" desc="אמצע היום" />
                    <ZmanCard title="מנחה גדולה" time={zmanim.minchaGedola} icon="🕐" desc="זמן מנחה מוקדם" />
                    <ZmanCard title="פלג המנחה" time={zmanim.plagHaMincha} icon="🕓" desc="זמן מנחה אחרון" />
                </div>
             </div>

             {/* Night Section */}
             <div>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌙</span> זמני הערב
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <ZmanCard title="שקיעה" time={zmanim.sunset} icon="🌇" desc="סוף היום" highlight />
                    <ZmanCard title="צאת הכוכבים" time={zmanim.tzeit7083deg} icon="✨" desc="תחילת הלילה" />
                </div>
             </div>

             <div className="text-center text-xs text-gray-400 mt-8 border-t border-gray-100 dark:border-slate-700 pt-4">
                * הזמנים מחושבים לפי שיטות מקובלות (חב"ד/גר"א). יש לעיין בלוחות שנה מקומיים לפסיקה מדויקת. המידע נלקח מ-Hebcal.
             </div>

          </div>
        )}

      </div>
    </div>
  );
};

const ZmanCard: React.FC<{ title: string; time: string; icon: string; desc: string; highlight?: boolean }> = ({ title, time, icon, desc, highlight }) => (
    <div className={`p-4 rounded-xl shadow-sm border transition-all hover:scale-105 ${highlight ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="font-bold text-gray-500 dark:text-gray-400 text-xs mb-1">{desc}</div>
        <div className="font-black text-lg text-gray-900 dark:text-gray-100 mb-1">{title}</div>
        <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-orange-600 dark:text-orange-400' : 'text-brand-blue dark:text-blue-400'}`}>
            {time}
        </div>
    </div>
);