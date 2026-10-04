import React from 'react';
import { ShieldCheck, Zap, Users, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { label: "Data Protection", value: "Secure", icon: ShieldCheck },
    { label: "Updates", value: "Real-time", icon: Zap },
    { label: "Workflows", value: "Collaborative", icon: Users },
    { label: "Accessibility", value: "Global", icon: Globe },
  ];

  return (
    <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 mb-1">
                  <Icon size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
