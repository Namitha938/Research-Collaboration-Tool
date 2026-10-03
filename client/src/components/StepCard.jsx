import React from 'react';

const StepCard = ({ number, title, description }) => {
  return (
    <div className="relative flex flex-col md:flex-row gap-6 md:items-start group">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-700 flex items-center justify-center shadow-sm text-primary-600 dark:text-primary-400 font-bold group-hover:border-primary-200 dark:group-hover:border-primary-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors z-10 relative">
          {number}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;
