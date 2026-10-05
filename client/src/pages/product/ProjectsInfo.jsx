import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FolderKanban, CheckSquare, LineChart, Users } from 'lucide-react';

const ProjectsInfo = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Research Projects</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          The core of ResearchHub. Organize your research into dedicated project workspaces.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <FolderKanban size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Project Workspaces</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Create dedicated workspaces for each of your research endeavors. Keep all related documents, resources, and team communication in one centralized location.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Project-Level Collaboration</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Invite team members specifically to the projects they need access to. Manage roles and permissions on a per-project basis to ensure data security.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <LineChart size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Project Progress</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Track the overall progress of your research. Monitor project status, view activity history, and ensure milestones are being met on time.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Deadlines & Status</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Keep your research on track by setting clear project deadlines. Update project status as you move from ideation to data collection and publication.
            </p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <h2>Managing Your Research</h2>
          <p>
            ResearchHub is designed with the understanding that research doesn't happen in a vacuum. By organizing your work into explicit <strong>Projects</strong>, you create a bounded context where tasks, documents, and discussions inherently make sense. Whether you are conducting a small literature review or a multi-year collaborative study, the project workspace adapts to your needs.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsInfo;
