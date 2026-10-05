import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Help Center</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
          Frequently asked questions about using ResearchHub.
        </p>

        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How do I create a research project?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Once logged in, go to the Projects page and click "Create Project". You'll need to provide a title, description, and status for your new workspace.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How do I invite a team member?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Inside a project, navigate to the "Team" tab. Click the invite button and enter the email address of the person you wish to invite, assigning them an appropriate role.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">What are project roles?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              ResearchHub uses three main roles: <strong>Owner</strong> (full access including deletion), <strong>Researcher</strong> (can contribute documents and tasks), and <strong>Viewer</strong> (read-only access).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How do tasks work?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Tasks allow you to break down project goals. You can assign tasks to specific team members, set priorities (Low, Medium, High), set deadlines, and track them by status (To Do, In Progress, Review, Completed).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How are documents managed?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Documents are uploaded to the project via the Documents tab. They are stored securely and can be viewed or downloaded by authorized team members.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">What is the difference between Resources and Research Papers?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Resources</strong> are generally links, datasets, or external repositories needed to execute your research. <strong>Research Papers</strong> are specifically academic publications (PDFs or references) organized often by DOI and authors.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How does project chat work?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              The project chat is a real-time messaging interface built into your project workspace. It allows team members to communicate without leaving the platform.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">How is project progress calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Progress is typically calculated based on the completion of tasks and milestones within the project. As you move tasks to the "Completed" status, the project's overall progress metric updates accordingly.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
