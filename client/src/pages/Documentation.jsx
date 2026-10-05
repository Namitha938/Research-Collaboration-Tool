import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex gap-8 relative">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Documentation</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
            Learn how to use ResearchHub to organize your research, manage teams, and collaborate effectively.
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
            
            <section id="getting-started">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
              <p>ResearchHub requires an account to access the platform. Once you register and log in, you will be directed to your dashboard where you can view your active projects, recent activity, and tasks.</p>
            </section>

            <section id="projects">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h2>
              <p>Everything in ResearchHub is organized around Projects. You can create a new project by clicking "Create Project" from the dashboard or the Projects page. A project acts as a container for your team, tasks, documents, and resources.</p>
            </section>

            <section id="team">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team & Roles</h2>
              <p>Navigate to the "Team" tab within a project to invite collaborators. Project roles determine access levels: Owners have full control, Researchers can contribute content, and Viewers have read-only access.</p>
            </section>

            <section id="tasks">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h2>
              <p>Tasks allow you to break down your research into actionable steps. You can assign tasks to team members, set priorities, establish deadlines, and update their status (e.g., To Do, In Progress, Review, Completed).</p>
            </section>

            <section id="documents">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h2>
              <p>The Documents section allows you to upload and manage text files, PDFs, or other relevant materials needed for your research project.</p>
            </section>

            <section id="resources">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resources</h2>
              <p>Use the Resources tab to catalog external datasets, web links, repositories, and essential reference materials that your team needs to access quickly.</p>
            </section>

            <section id="research-papers">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Research Papers</h2>
              <p>Organize published papers, preprints, or drafts relevant to your work. You can catalog them by title, authors, and DOI for easy reference.</p>
            </section>

            <section id="references">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">References</h2>
              <p>Maintain a structured bibliography of citations used in your research.</p>
            </section>

            <section id="chat">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Chat</h2>
              <p>Each project has a dedicated real-time chat space. This ensures all project-related communication stays contextualized within the platform.</p>
            </section>

            <section id="milestones">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Milestones</h2>
              <p>Set major goals for your project using Milestones. Tracking milestones helps you monitor the macro-level progress of your research.</p>
            </section>

            <section id="notifications-activity">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications & Activity</h2>
              <p>Stay informed through the Notifications panel for immediate alerts (like task assignments), and view the Activity tab for a comprehensive historical log of project updates.</p>
            </section>

          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">On this page</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#getting-started" className="hover:text-primary-600 dark:hover:text-primary-400">Getting Started</a></li>
              <li><a href="#projects" className="hover:text-primary-600 dark:hover:text-primary-400">Projects</a></li>
              <li><a href="#team" className="hover:text-primary-600 dark:hover:text-primary-400">Team & Roles</a></li>
              <li><a href="#tasks" className="hover:text-primary-600 dark:hover:text-primary-400">Tasks</a></li>
              <li><a href="#documents" className="hover:text-primary-600 dark:hover:text-primary-400">Documents</a></li>
              <li><a href="#resources" className="hover:text-primary-600 dark:hover:text-primary-400">Resources</a></li>
              <li><a href="#research-papers" className="hover:text-primary-600 dark:hover:text-primary-400">Research Papers</a></li>
              <li><a href="#chat" className="hover:text-primary-600 dark:hover:text-primary-400">Chat</a></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
