
import React, { useState } from 'react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  return (
    <div className="animate-fade-in-up pb-10 min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-teal-50 dark:bg-slate-800 text-center py-10 px-4 rounded-b-[2.5rem] border-b border-teal-100 dark:border-slate-700 transition-colors duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-teal-900 dark:text-teal-300 mb-3">
          המגזין היהודי
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          דברי תורה, חיזוק יומי, סיפורים ומחשבה יהודית.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        
        {selectedPost ? (
          // Single Post View
          <article className="max-w-4xl mx-auto glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in bg-white dark:bg-slate-800">
             <div className="h-64 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-9xl shadow-inner relative overflow-hidden">
                {/* Subtle pattern for detail view */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <span className="relative z-10 filter drop-shadow-xl">{selectedPost.imageEmoji}</span>
             </div>
             
             <div className="p-8 md:p-12">
                {/* Consistent Back Button Style */}
                <button 
                  onClick={closePost}
                  className="mb-8 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full glass-btn flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <span>חזרה למאמרים</span>
                </button>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-bold border border-teal-100 dark:border-teal-800">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 dark:text-gray-400 mb-10 pb-10 border-b border-gray-100 dark:border-slate-700 font-medium">
                   <span className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">✍️ {selectedPost.author}</span>
                   <span className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">📅 {selectedPost.date}</span>
                   <span className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">⏱️ {selectedPost.readTime}</span>
                </div>

                <div 
                  className="font-sans text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed space-y-6 [&_p]:mb-6 [&_h3]:text-2xl [&_h3]:font-black [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-teal-800 [&_h3]:dark:text-teal-300"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                <div className="mt-16 pt-10 border-t border-gray-100 dark:border-slate-700 text-center">
                   <p className="font-bold text-lg mb-6 text-gray-800 dark:text-white">אהבתם? שתפו את החיזוק!</p>
                   <div className="flex justify-center gap-4">
                      <button className="bg-[#25D366] hover:brightness-110 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 glass-btn border-none" aria-label="שתף בווצאפ">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.466c-.74-.37-4.313-2.13-4.313-2.13-.37-.184-.563-.279-.819.094-.255.373-1.018 1.28-1.248 1.554-.229.274-.462.306-.837.118-2.677-1.345-4.425-3.691-5.077-4.811-.274-.47-.029-.724.206-.959.186-.186.417-.486.625-.729.208-.242.278-.415.417-.692.14-.277.07-.518-.035-.729-.104-.212-.933-2.247-1.278-3.078-.335-.808-.679-.697-.933-.71-.242-.012-.518-.015-.795-.015-.277 0-.729.104-1.111.518-.382.414-1.461 1.428-1.461 3.485 0 2.057 1.498 4.045 1.708 4.322.21.277 2.948 4.504 7.142 6.316 2.84 1.228 3.96 1.027 4.708.959.954-.087 2.664-1.092 3.039-2.146.375-1.054.375-1.958.263-2.146-.113-.188-.416-.299-.79-.486z"/></svg>
                      </button>
                      <button className="bg-[#1877F2] hover:brightness-110 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 glass-btn border-none" aria-label="שתף בפייסבוק">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                   </div>
                </div>
             </div>
          </article>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map(post => (
              <div 
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="flex flex-col glass-btn p-0 rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] h-full text-right"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePostClick(post)}
                aria-label={`קרא את המאמר: ${post.title}`}
              >
                {/* Image Area with Enhanced Pattern */}
                <div className="h-64 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden group-hover:from-teal-100 group-hover:to-teal-200 dark:group-hover:from-slate-600 dark:group-hover:to-slate-700 transition-colors duration-500">
                  {/* Pattern Background */}
                  <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Floating Emoji */}
                  <span className="text-9xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 filter drop-shadow-lg select-none relative z-10">
                    {post.imageEmoji}
                  </span>
                  
                  {/* Glass Reflection Effect */}
                  <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-all duration-300 group-hover:underline decoration-2 underline-offset-4 group-hover:scale-[1.02] origin-top-right">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  
                  {/* Footer */}
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between mt-auto">
                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500">
                      <span>{post.date}</span> • <span>{post.readTime}</span>
                    </div>
                    
                    <span className="text-teal-600 dark:text-teal-400 font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span className="group-hover:underline">קרא עוד</span>
                      <span className="text-xl rtl:rotate-180 group-hover:animate-pulse">←</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
