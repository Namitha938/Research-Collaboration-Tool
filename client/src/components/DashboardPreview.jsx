import React from 'react';
import { 
  BarChart3, 
  FolderKanban, 
  Users, 
  FileText, 
  Clock, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const DashboardPreview = () => {
  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in-delay-1 transition-colors duration-300">
      {/* Mac-like Window Controls */}
      <div className="bg-slate-50 dark:bg-slate-950 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>

      <div className="flex h-[400px] md:h-[500px]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-48 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 dark:bg-slate-900/50 p-4">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-2 rounded-lg font-medium text-sm">
              <BarChart3 size={16} /> Dashboard
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <FolderKanban size={16} /> Projects
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <FileText size={16} /> Documents
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <Users size={16} /> Team
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Recent Projects</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 dark:text-slate-300 px-3 py-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Quantum AI
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 dark:text-slate-300 px-3 py-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Bio Dataset
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-white dark:bg-slate-900 dark:bg-slate-950 overflow-hidden flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Project Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quantum Machine Learning Analysis</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-primary-200 dark:bg-primary-900 border-2 border-white dark:border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-500">+3</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 dark:bg-slate-900/50">
              <div className="text-slate-500 dark:text-slate-400 mb-1"><CheckCircle2 size={16} /></div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 dark:text-white">24</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tasks Completed</div>
            </div>
            <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 dark:bg-slate-900/50">
              <div className="text-amber-500 dark:text-amber-400 mb-1"><Clock size={16} /></div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 dark:text-white">12</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">In Progress</div>
            </div>
            <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 dark:bg-slate-900/50">
              <div className="text-red-500 dark:text-red-400 mb-1"><AlertCircle size={16} /></div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 dark:text-white">3</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Overdue</div>
            </div>
          </div>

          <div className="flex-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/30 dark:bg-slate-900/30 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 dark:text-slate-200">Recent Activity</h4>
              <MoreHorizontal size={16} className="text-slate-400 dark:text-slate-500 dark:text-slate-400" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium text-slate-900 dark:text-white">Dr. Sarah</span> uploaded <span className="font-medium text-slate-900 dark:text-white">dataset_v2.csv</span></p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium text-slate-900 dark:text-white">Michael</span> completed task <span className="font-medium text-slate-900 dark:text-white">Literature Review</span></p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium text-slate-900 dark:text-white">Elena</span> left a comment on <span className="font-medium text-slate-900 dark:text-white">Draft Final</span></p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
