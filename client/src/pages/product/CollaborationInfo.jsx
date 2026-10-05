import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, UserPlus, MessageSquare, Bell } from 'lucide-react';

const CollaborationInfo = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Collaboration</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Research is better together. Discover how ResearchHub empowers collaborative research workflows.
        </p>

        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 shrink-0">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Project Teams & Roles</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Build your research team by assigning specific roles within each project. ResearchHub supports distinct permissions for:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
                <li><strong>Owners</strong>: Full control over project settings, team membership, and critical deletions.</li>
                <li><strong>Researchers</strong>: Can create tasks, upload documents, manage resources, and participate fully in the research process.</li>
                <li><strong>Viewers</strong>: Read-only access to project materials, perfect for external advisors or stakeholders.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 shrink-0">
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Real-Time Project Chat</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keep project discussions contextual. Each project includes a dedicated, real-time chat workspace. Stop relying on external messaging apps that fragment your research history; keep your collaborative discussions right next to your tasks and documents.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 shrink-0">
              <Bell size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Notifications & Activity</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Stay updated on what your team is doing. ResearchHub provides notifications for important events like task assignments and project invitations. The activity history log provides a clear audit trail of how the research project has evolved over time.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 shrink-0">
              <UserPlus size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Member Invitations</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamlessly invite new collaborators via email. Invited members can join your secure project workspace in seconds, ensuring your collaborative research workflow scales effortlessly as your team grows.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollaborationInfo;
