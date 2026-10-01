import React from 'react';

const StepCard = ({ number, title, description }) => {
  return (
    <div className="relative flex flex-col md:flex-row gap-6 md:items-start group">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm text-primary-600 font-bold group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors z-10 relative">
          {number}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;
