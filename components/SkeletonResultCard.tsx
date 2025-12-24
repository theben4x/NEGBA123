import React from 'react';

export const SkeletonResultCard: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 mt-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-brand-blue/10 dark:bg-blue-900/20 p-6 h-48 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-4 w-2/3">
             <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded-full w-24 opacity-50"></div>
             <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded-lg w-48"></div>
          </div>
          <div className="w-24 h-24 bg-gray-300 dark:bg-slate-600 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bracha Rishona Box */}
        <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl border border-gray-100 dark:border-slate-600 flex flex-col items-center h-64">
          <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-slate-500 rounded w-32 mb-6"></div>
          <div className="w-full space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-4/6"></div>
          </div>
        </div>

        {/* Bracha Acharona Box */}
        <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl border border-gray-100 dark:border-slate-600 flex flex-col items-center h-64">
           <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-24 mb-4"></div>
           <div className="h-8 bg-gray-300 dark:bg-slate-500 rounded w-32 mb-6"></div>
           <div className="w-full space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 dark:bg-slate-700/50 border-r-4 border-gray-200 dark:border-slate-600 p-4 rounded-lg h-32">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-slate-500 rounded-full flex-shrink-0"></div>
            <div className="space-y-3 w-full mt-1">
               <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-32"></div>
               <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full"></div>
               <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};