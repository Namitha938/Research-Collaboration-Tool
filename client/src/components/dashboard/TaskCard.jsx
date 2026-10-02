import React from 'react';
import { Calendar } from 'lucide-react';

const TaskCard = ({ task }) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-900">{task.title}</h4>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${
          task.priority === 'High' ? 'text-red-600 bg-red-50' :
          task.priority === 'Medium' ? 'text-amber-600 bg-amber-50' :
          'text-emerald-600 bg-emerald-50'
        }`}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">{task.project}</p>
      
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar size={14} />
          Due {task.deadline}
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 border border-white shadow-sm">
          {task.assigneeInitials || 'U'}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
