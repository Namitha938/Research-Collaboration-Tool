import React from 'react';

const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-800">
        {activity.userInitials}
      </div>
      <div className="flex-1 min-w-0 pb-4 border-b border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-900 dark:text-white leading-snug">
          <span className="font-semibold">{activity.userName}</span> {activity.action}{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">{activity.target}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
