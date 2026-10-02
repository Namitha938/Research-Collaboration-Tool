import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProjectCard from '../components/dashboard/ProjectCard';
import TaskCard from '../components/dashboard/TaskCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { FolderKanban, CheckSquare, ListChecks, TrendingUp, Plus, Atom } from 'lucide-react';
import { getProjects } from '../api/projectService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getProjects();
        if (response.success) {
          setProjects(response.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
            {greeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-slate-500">Here's what's happening with your research today.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/projects/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus size={18} /> New Project
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Upload
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FolderKanban size={18} /></div>
            <span className="text-sm font-medium text-slate-600">Total Projects</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{isLoading ? '-' : projects.length}</h3>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CheckSquare size={18} /></div>
            <span className="text-sm font-medium text-slate-600">Active Tasks</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">0</h3>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ListChecks size={18} /></div>
            <span className="text-sm font-medium text-slate-600">Completed Tasks</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">0</h3>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={18} /></div>
            <span className="text-sm font-medium text-slate-600">Overall Progress</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">—</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area - 2 Columns wide on XL */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">My Research Projects</h2>
              {projects.length > 0 && (
                <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FolderKanban size={24} className="text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">No research projects yet</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">Start your first research project and begin collaborating with your team.</p>
                <Link to="/projects/new" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  + Create Research Project
                </Link>
              </div>
            )}
          </section>

          {/* Tasks Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Tasks</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckSquare size={24} className="text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">No upcoming tasks</h3>
              <p className="text-sm text-slate-500 max-w-sm">Tasks assigned to you across all projects will appear here.</p>
            </div>
          </section>
        </div>

        {/* Sidebar Activity - 1 Column wide on XL */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-900 mb-5">Recent Activity</h2>
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">No recent activity</p>
              <p className="text-xs text-slate-500 text-center max-w-[200px]">Team activities and updates will show up here.</p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-primary-100 text-sm mb-6 max-w-[200px]">Get access to advanced analytics, unlimited projects, and 500GB storage.</p>
              <button className="bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                View Plans
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Atom size={120} />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
