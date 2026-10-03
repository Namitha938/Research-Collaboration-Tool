import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users } from "lucide-react";

export default function ProjectCard({ project }) {
  const due = project.deadline && new Date(project.deadline).toLocaleDateString();
  return (
    <Link to={`/projects/${project._id}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{project.title}</h3>
          <p className="text-xs text-primary-600">{project.researchArea}</p>
        </div>
        <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium capitalize text-primary-600">
          {project.status}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
      <div className="mt-4 h-1.5 rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${project.progress || 0}%` }} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><Users size={13} /> {project.members?.length || 1}</span>
        {due && <span className="flex items-center gap-1"><Calendar size={13} /> {due}</span>}
        <span className="ml-auto">{project.progress || 0}%</span>
      </div>
    </Link>
  );
}
