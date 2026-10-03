import React from 'react';

const StatsSection = () => {
  const stats = [
    { label: "Research Projects", value: "10k+" },
    { label: "Active Researchers", value: "50k+" },
    { label: "Shared Resources", value: "2M+" },
    { label: "Team Collaborations", value: "500k+" },
  ];

  return (
    <section className="py-16 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
