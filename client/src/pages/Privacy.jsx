import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex gap-8 relative">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="text-slate-700 dark:text-slate-300 space-y-6">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              How ResearchHub collects, uses, and protects information when you use the platform.
            </p>
            
            <h2 id="information-we-collect" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              ResearchHub requires certain information to function. Based on the existing implementation, this includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Account information:</strong> name, email address, authentication-related account information, and user role.</li>
              <li><strong>Project information:</strong> project title, description, research area, project dates, project membership, project roles, and project status.</li>
              <li><strong>Research content:</strong> tasks, documents, resources, research papers, references, milestones, and project activity.</li>
              <li><strong>Communication:</strong> project chat messages and notifications.</li>
            </ul>

            <h2 id="how-we-use-information" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">2. How We Use Information</h2>
            <p>
              Information is used to provide ResearchHub functionality, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Authentication</li>
              <li>Project management and team collaboration</li>
              <li>Task assignment and research document management</li>
              <li>Resource management, research paper organization, and reference management</li>
              <li>Milestones, notifications, and project activity history</li>
              <li>Real-time project communication</li>
            </ul>

            <h2 id="research-projects-and-collaboration-data" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">3. Research Projects and Collaboration Data</h2>
            <p>
              Research project information is associated with the relevant project and is accessible according to project permissions. Project roles include owner, researcher, and viewer, which have different permissions. Project owners and members control project data.
            </p>

            <h2 id="uploaded-files-and-research-content" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">4. Uploaded Files and Research Content</h2>
            <p>
              ResearchHub uses a third-party cloud media/storage service for applicable uploaded files. File metadata is associated with the relevant research project.
            </p>

            <h2 id="team-and-communication-data" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">5. Team and Communication Data</h2>
            <p>
              ResearchHub uses real-time communication for project chat. Project chat messages are part of project collaboration data and may be stored so authorized project members can access conversation history.
            </p>

            <h2 id="authentication-and-account-information" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">6. Authentication and Account Information</h2>
            <p>
              ResearchHub uses user accounts with JWT-based authentication and password hashing to secure access to the platform.
            </p>

            <h2 id="data-storage-and-third-party-services" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">7. Data Storage and Third-Party Services</h2>
            <p>
              ResearchHub architecture uses a secure database for application data, a cloud media service for applicable uploaded files, and an email delivery service for project invitations and related account messages.
            </p>

            <h2 id="data-sharing" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">8. Data Sharing</h2>
            <p>
              Project information is shared with other authorized project members according to project permissions. ResearchHub does not sell personal information to third parties.
            </p>

            <h2 id="data-retention" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">9. Data Retention</h2>
            <p>
              Information may remain stored while the relevant account or research project remains active, subject to the application's functionality and administrative controls.
            </p>

            <h2 id="user-choices-and-rights" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">10. User Choices and Rights</h2>
            <p>
              You can update account information where supported, manage project membership according to permissions, delete projects when you have owner permission, and contact the ResearchHub team regarding privacy questions.
            </p>

            <h2 id="security" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">11. Security</h2>
            <p>
              ResearchHub uses authentication, authorization, password hashing, and access controls to help protect account and project information. We take reasonable measures to protect information within the application.
            </p>

            <h2 id="changes-to-this-privacy-policy" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date.
            </p>

            <h2 id="contact" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">13. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us using the existing contact mechanisms within the platform.
            </p>
          </div>
        </div>

        {/* Table of Contents (Desktop only) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">On this page</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#information-we-collect" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Information We Collect</a></li>
              <li><a href="#how-we-use-information" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How We Use Information</a></li>
              <li><a href="#research-projects-and-collaboration-data" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Project Data</a></li>
              <li><a href="#uploaded-files-and-research-content" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Uploaded Files</a></li>
              <li><a href="#security" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Security</a></li>
              <li><a href="#user-choices-and-rights" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Your Choices</a></li>
              <li><a href="#contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
