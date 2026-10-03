import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../../api/projectService';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Users, Activity, Settings, CheckSquare, FileText, Database, BookOpen, MessageSquare, BookMarked, Target } from 'lucide-react';
import TeamTab from '../../components/team/TeamTab';
import Tasks from '../Tasks';
import DocumentsTab from '../../components/documents/DocumentsTab';
import ResearchPapersTab from '../../components/research-papers/ResearchPapersTab';
import ReferencesTab from '../../components/references/ReferencesTab';
import MilestonesTab from '../../components/milestones/MilestonesTab';
import ActivityTab from '../../components/activity/ActivityTab';
import { useAuth } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Activity');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        if (response.success) {
          setProject(response.project);
        }
      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 w-1/4 rounded"></div>
          <div className="h-32 bg-slate-200 w-full rounded-xl"></div>
          <div className="h-64 bg-slate-200 w-full rounded-xl"></div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Not Found</h2>
          <Link to="/projects" className="text-primary-600 hover:underline mt-2 inline-block">Return to Projects</Link>
        </div>
      </>
    );
  }

  const tabs = [
    { name: 'Activity', icon: <Activity size={16} /> },
    { name: 'Tasks', icon: <CheckSquare size={16} /> },
    { name: 'Documents', icon: <FileText size={16} /> },
    { name: 'Resources', icon: <Database size={16} /> },
    { name: 'Team', icon: <Users size={16} /> },
    { name: 'Chat', icon: <MessageSquare size={16} /> },
    { name: 'Research Papers', icon: <BookOpen size={16} /> },
    { name: 'References', icon: <BookMarked size={16} /> },
    { name: 'Milestones', icon: <Target size={16} /> }
  ];

  return (
    <>
      <Link to="/projects" className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white mb-6 transition-colors inline-flex">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Project Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-3">
              {project.researchArea}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors shrink-0">
            <Settings size={16} /> Manage Project
          </button>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-4xl mb-8">
          {project.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              {project.status}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Deadline</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Team Members</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 3).map((member, idx) => {
                  const userName = member.user?.name || member.name || "U";
                  return (
                    <div key={idx} className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 border-2 border-white flex items-center justify-center text-xs font-bold" title={userName}>
                      {userName.charAt(0)}
                    </div>
                  );
                })}
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{project.members?.length} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 overflow-x-auto">
        <div className="flex px-2 min-w-max">
          {tabs.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.name 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Team' ? (
        <TeamTab project={project} />
      ) : activeTab === 'Tasks' ? (
        <Tasks projectId={project._id} />
      ) : activeTab === 'Documents' ? (
        <DocumentsTab projectId={project._id} project={project} />
      ) : activeTab === 'Research Papers' ? (
        <ResearchPapersTab projectId={project._id} project={project} />
      ) : activeTab === 'References' ? (
        <ReferencesTab 
          project={project} 
          currentUserRole={project.members?.find(m => (m.user?._id || m.user)?.toString() === (user?.id || user?._id)?.toString())?.role}
          currentUserId={user?.id || user?._id}
        />
      ) : activeTab === 'Milestones' ? (
        <MilestonesTab 
          project={project} 
          currentUserRole={project.members?.find(m => (m.user?._id || m.user)?.toString() === (user?.id || user?._id)?.toString())?.role}
          currentUserId={user?.id || user?._id}
        />
      ) : activeTab === 'Activity' ? (
        <ActivityTab projectId={project._id} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
              <CheckSquare size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{activeTab} Module (Coming Soon)</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm">This module is currently under development.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Project Progress</h3>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600 dark:text-slate-400">Overall</span>
                <span className="text-slate-900 dark:text-white">{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
              <Activity size={32} className="text-slate-200 mb-3" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">Recent Activity</h3>
              <p className="text-slate-400 text-sm mt-1">No recent activity</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
