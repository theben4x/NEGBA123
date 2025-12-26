
import React, { useState } from 'react';
import { HALACHA_DB } from '../constants';
import { HalachaItem } from '../types';

export const HalachaPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<HalachaItem[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const topics = [
    { name: "תשובה", icon: "🔄" }, { name: "שבת", icon: "🕯️" }, { name: "כשרות", icon: "🍽️" },
    { name: "מעמד האישה", icon: "👑" }, { name: "תפילין", icon: "🔳" }, { name: "תפילה", icon: "🙏" },
    { name: "שבועות", icon: "⛰️" }, { name: "פסח", icon: "🍷" }, { name: "ראש השנה", icon: "🍯" },
    { name: "יום כיפור", icon: "⚖️" }, { name: "סוכות", icon: "🍋" }, { name: "חנוכה", icon: "🕎" },
    { name: "פורים", icon: "🎭" }, { name: "כיבוד הורים", icon: "👴" }, { name: "ברכות", icon: "🍎" },
    { name: "לשון הרע", icon: "🤐" }, { name: "אבלות", icon: "🕯️" }, { name: "מזוזה", icon: "📜" }, { name: "צדקה", icon: "💰" }
  ];

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setSelectedTopic(null);
    if (!searchTerm.trim()) { setFilteredResults([]); return; }
    const results = HALACHA_DB.filter(item => item.question.includes(searchTerm) || item.answer.includes(searchTerm) || item.topic.includes(searchTerm));
    setFilteredResults(results);
  };

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    setQuery('');
    setFilteredResults(HALACHA_DB.filter(item => item.topic === topicName));
  };

  const toggleQuestion = (id: string) => setOpenQuestionId(openQuestionId === id ? null : id);
  const showTopics = !query && !selectedTopic;

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Glass Header */}
      <section className="glass-panel text-center py-12 px-4 rounded-[3rem] mb-10 mx-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          מאגר השו"ת <span className="text-brand-gold">MyJew</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg mb-8">שאלות ותשובות הלכתיות בקליק.</p>

        <div className="max-w-xl mx-auto relative group">
           <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="חפש שאלה..."
              className="glass-input w-full px-6 py-4 rounded-[1.5rem] text-lg font-bold placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
           />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {selectedTopic && (
           <div className="mb-8">
             <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-3 font-bold text-gray-500 hover:text-brand-blue transition-colors px-4">
                <span className="text-xl">→</span> חזרה לנושאים <span className="text-gray-300">|</span> <span className="text-brand-dark dark:text-white">{selectedTopic}</span>
             </button>
           </div>
        )}

        {showTopics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
             {topics.map(topic => (
               <button key={topic.name} onClick={() => handleTopicClick(topic.name)} className="glass-btn p-6 rounded-[2rem] flex flex-col items-center gap-3 group">
                 <span className="text-4xl filter drop-shadow-sm">{topic.icon}</span>
                 <span className="font-bold text-gray-800 dark:text-gray-200">{topic.name}</span>
               </button>
             ))}
          </div>
        )}

        {(query || selectedTopic) && (
          <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
            {filteredResults.length === 0 ? (
              <div className="glass-panel p-16 rounded-[3rem] text-center">
                <span className="text-6xl mb-4 block">🤔</span>
                <p className="text-2xl font-black text-gray-800 dark:text-white">לא נמצאו תוצאות</p>
                <button onClick={() => { setQuery(''); setSelectedTopic(null); }} className="mt-4 text-brand-blue font-bold">חזרה לראשי</button>
              </div>
            ) : (
              filteredResults.map((item) => (
                <div key={item.id} className={`glass-btn rounded-[2rem] overflow-hidden p-0 text-right ${openQuestionId === item.id ? 'ring-2 ring-brand-blue shadow-lg' : ''}`}>
                  <button onClick={() => toggleQuestion(item.id)} className="w-full text-right p-6 flex items-start justify-between gap-6 focus:outline-none">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${openQuestionId === item.id ? 'bg-brand-blue text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                         {openQuestionId === item.id ? '−' : '?'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{item.topic}</span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{item.question}</h3>
                      </div>
                    </div>
                  </button>
                  {openQuestionId === item.id && (
                    <div className="px-6 pb-8 pt-2 pl-20 animate-fade-in">
                       <div className="p-6 bg-white/50 dark:bg-black/20 rounded-2xl">
                         <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{item.answer}</p>
                         <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-sm font-bold text-gray-400">מקור: {item.source}</div>
                       </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};