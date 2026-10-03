import React from 'react';

const SectionHeading = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 transition-colors duration-300">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
