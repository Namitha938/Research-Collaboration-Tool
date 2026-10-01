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
    <div className="relative rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in-delay-1">
      {/* Mac-like Window Controls */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>

      <div className="flex h-[400px] md:h-[500px]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-48 border-r border-slate-100 bg-slate-50/50 p-4">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-3 py-2 rounded-lg font-medium text-sm">
              <BarChart3 size={16} /> Dashboard
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <FolderKanban size={16} /> Projects
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <FileText size={16} /> Documents
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer">
              <Users size={16} /> Team
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Recent Projects</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 px-3 py-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Quantum AI
              </div>
              <div className="flex items-center gap-2 text-slate-600 px-3 py-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Bio Dataset
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-white overflow-hidden flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Project Overview</h3>
              <p className="text-xs text-slate-500">Quantum Machine Learning Analysis</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-xs font-bold text-amber-700">+3</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
              <div className="text-slate-500 mb-1"><CheckCircle2 size={16} /></div>
              <div className="text-2xl font-bold text-slate-800">24</div>
              <div className="text-xs text-slate-500">Tasks Completed</div>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
              <div className="text-amber-500 mb-1"><Clock size={16} /></div>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-xs text-slate-500">In Progress</div>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
              <div className="text-red-500 mb-1"><AlertCircle size={16} /></div>
              <div className="text-2xl font-bold text-slate-800">3</div>
              <div className="text-xs text-slate-500">Overdue</div>
            </div>
          </div>

          <div className="flex-1 border border-slate-100 rounded-xl bg-slate-50/30 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-slate-800">Recent Activity</h4>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700"><span className="font-medium text-slate-900">Dr. Sarah</span> uploaded <span className="font-medium text-slate-900">dataset_v2.csv</span></p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700"><span className="font-medium text-slate-900">Michael</span> completed task <span className="font-medium text-slate-900">Literature Review</span></p>
                  <p className="text-xs text-slate-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-700"><span className="font-medium text-slate-900">Elena</span> left a comment on <span className="font-medium text-slate-900">Draft Final</span></p>
                  <p className="text-xs text-slate-400">Yesterday</p>
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
