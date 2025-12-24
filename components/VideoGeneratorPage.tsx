
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Spinner } from './Spinner';

// Fix: Augment the existing AIStudio interface
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

export const VideoGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "הדלקת נרות חנוכה (אנימציה)", value: "A 3D cartoon animation of a Jewish boy lighting a Hanukkah Menorah with colorful candles. Soft lighting, warm atmosphere." },
    { label: "נטילת ידיים (מצויר)", value: "A clean instructional animation showing two hands washing with a cup, pouring water over hands, minimal style." },
    { label: "חלות לשבת", value: "Cinematic close up shot of braided Challah bread for Shabbat on a wooden table, warm lighting." },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;

    if (!window.aistudio) {
        setError("סביבת העבודה אינה תומכת ב-AI Studio API Key selection.");
        return;
    }

    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      try {
        await window.aistudio.openSelectKey();
      } catch (e) {
        setError("יש לבחור מפתח API כדי ליצור וידאו.");
        return;
      }
    }

    setLoading(true);
    setVideoUrl(null);
    setError(null);
    setStatus('מכין את הבקשה...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      setStatus('שולח בקשה למודל Veo (זה עשוי לקחת כדקה)...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cartoon animation style, instructional video: ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus('הוידאו נוצר, אנא המתן...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        setStatus('עדיין מעבד... סבלנות משתלמת!');
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        setStatus('מוריד את הקובץ...');
        
        const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        throw new Error("לא התקבל וידאו מהשרת");
      }

    } catch (err: any) {
      console.error(err);
      if (err.toString().includes("Requested entity was not found") || err.toString().includes("404")) {
         setError("שגיאת הרשאה. אנא נסה לבחור מפתח API מחדש.");
      } else {
         setError('אירעה שגיאה ביצירת הוידאו. נסה שוב מאוחר יותר.');
      }
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-purple-50 dark:bg-slate-800 text-center py-10 px-4 rounded-b-[2.5rem] border-b border-purple-100 dark:border-slate-700 transition-colors duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-purple-900 dark:text-purple-300 mb-3">
          סטודיו וידאו <span className="text-brand-gold">AI</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          צור סרטוני אנימציה קצרים להמחשת מצוות ומנהגים באמצעות בינה מלאכותית.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 mt-8">
        
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-700">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">מה תרצה לראות?</label>
          <div className="flex flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="לדוגמה: אנימציה של ילד מדליק חנוכיה, או יד מוזגת יין לקידוש..."
              className="glass-input w-full p-4 rounded-xl font-medium resize-none h-32 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset.value)}
                  className="whitespace-nowrap px-4 py-2 glass-btn text-purple-700 dark:text-purple-300 text-sm rounded-full font-bold hover:bg-purple-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-md transition-all flex items-center justify-center gap-2
                ${loading || !prompt.trim() ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed' : 'glass-btn-primary'}`}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> {status}
                </>
              ) : (
                <>
                  <span>🎥</span> צור סרטון
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800 text-center font-bold">
              {error}
              {error.includes("מפתח API") && window.aistudio && (
                 <button 
                   onClick={() => window.aistudio.openSelectKey()}
                   className="block mx-auto mt-2 text-sm underline"
                 >
                   לחץ כאן לבחירת מפתח
                 </button>
              )}
            </div>
          )}
        </div>

        {/* Video Result */}
        {videoUrl && (
          <div className="mt-8 animate-fade-in-up">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-200 dark:border-purple-900">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop
                className="w-full aspect-video"
              />
            </div>
            <div className="text-center mt-4">
              <a 
                href={videoUrl} 
                download="myjew-video.mp4"
                className="glass-btn px-6 py-2 rounded-full text-purple-600 dark:text-purple-400 font-bold inline-block"
              >
                הורד סרטון
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 backdrop-blur-sm">
          <h4 className="font-black text-brand-blue dark:text-blue-300 mb-2">💡 שים לב:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>יצירת הוידאו אורכת כדקה.</li>
            <li>הסרטונים נוצרים ע"י בינה מלאכותית (Veo) ועשויים להיות לא מדויקים בפרטים קטנים.</li>
            <li>השירות מחייב שימוש במפתח API של גוגל (בתשלום/Free Tier).</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
