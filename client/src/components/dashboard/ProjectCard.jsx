import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ChevronRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  // Use real data if available, fallback to mock fields if project object doesn't have them
  const title = project.title;
  const researchArea = project.researchArea;
  const description = project.description;
  const progress = project.progress || 0;
  const deadline = project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline';
  const members = project.members || [];
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
          {researchArea}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 flex-1">
        {description}
      </p>
      
      <div className="space-y-4 mt-auto">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-slate-900 dark:text-white">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {deadline}
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </div>
          </div>
          
          <Link 
            to={`/projects/${project._id || project.id}`}
            className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
