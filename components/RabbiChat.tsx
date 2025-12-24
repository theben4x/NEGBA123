
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Spinner } from './Spinner';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const RabbiChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'שלום עליכם! אני "הרב בוט". אפשר לשאול אותי כל שאלה בהלכה, אמונה, או התייעצות כללית. במה אוכל לעזור היום?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are a wise, empathetic, and knowledgeable Orthodox Rabbi. You answer questions based on Jewish Law (Halacha), Torah wisdom, and Jewish philosophy. You quote sources (like Shulchan Aruch, Rambam, Gemara) when relevant but keep the language accessible and warm. If the question is about medical or legal advice, clarify that you are an AI and they should consult a professional. Always answer in Hebrew.",
        }
      });

      const responseStream = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].text = fullResponse;
            return newMsgs;
          });
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'מחילה, אירעה תקלה בתקשורת. אנא נסו שוב מאוחר יותר.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto bg-gray-50 dark:bg-slate-900 shadow-xl rounded-t-3xl overflow-hidden animate-fade-in-up border-x border-t border-white/50 dark:border-slate-700">
      {/* Chat Header */}
      <div className="bg-brand-blue dark:bg-slate-800 p-4 flex items-center gap-4 border-b border-blue-800 dark:border-slate-700 shadow-md z-10">
        <div className="bg-white/10 p-3 rounded-full border border-white/20">
          <span className="text-3xl">🧔🏻‍♂️</span>
        </div>
        <div>
          <h2 className="text-white font-black text-xl">שו"ת עם הרב</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-blue-100 text-xs font-bold">מחובר כעת</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm border ${
              msg.role === 'user' 
                ? 'bg-brand-blue text-white border-blue-600' 
                : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600'
            }`}>
              {msg.role === 'user' ? 'אני' : 'רב'}
            </div>
            
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm md:text-base whitespace-pre-wrap font-medium ${
              msg.role === 'user'
                ? 'bg-brand-blue text-white rounded-tl-none'
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tr-none border border-gray-100 dark:border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex items-center gap-2 text-gray-400 text-sm mr-12">
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             <span>הרב מקליד...</span>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="כתוב את שאלתך כאן..."
            className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none max-h-32 min-h-[50px] custom-scrollbar border border-gray-200 dark:border-slate-600"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full flex-shrink-0 transition-all ${
              !input.trim() || isLoading
                ? 'bg-gray-200 dark:bg-slate-600 text-gray-400 cursor-not-allowed'
                : 'glass-btn-primary shadow-lg transform hover:scale-105'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          * התשובות מופקות ע"י בינה מלאכותית ועשויות להכיל אי-דיוקים. לפסיקה מעשית יש לפנות לרב בשר ודם.
        </p>
      </div>
    </div>
  );
};
