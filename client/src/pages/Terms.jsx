import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex gap-8 relative">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Terms of Service</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="text-slate-700 dark:text-slate-300 space-y-6">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              Rules and conditions for using ResearchHub.
            </p>

            <h2 id="acceptance-of-terms" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By using ResearchHub, you agree to these Terms of Service. If you do not agree, do not use the platform.
            </p>

            <h2 id="use-of-researchhub" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">2. Use of ResearchHub</h2>
            <p>
              Users must use ResearchHub responsibly. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Use the platform for unlawful activity.</li>
              <li>Upload content you do not have permission to use/share.</li>
              <li>Attempt to bypass authentication or authorization.</li>
              <li>Interfere with the application.</li>
              <li>Attempt to access another user's private project data.</li>
              <li>Upload malicious files.</li>
              <li>Abuse collaboration features.</li>
              <li>Intentionally disrupt other users.</li>
            </ul>

            <h2 id="user-accounts" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">3. User Accounts</h2>
            <p>
              Users are responsible for maintaining access to their account, protecting their credentials, and providing accurate account information where required.
            </p>

            <h2 id="research-projects" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">4. Research Projects</h2>
            <p>
              ResearchHub provides tools for organizing and collaborating on research projects. Project owners are responsible for managing their project settings.
            </p>

            <h2 id="project-roles-and-permissions" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">5. Project Roles and Permissions</h2>
            <p>
              Project owners control project-level membership and permissions according to the application's functionality. Project roles include owner, researcher, and viewer. Users should only access or share project information they are authorized to access.
            </p>

            <h2 id="user-content" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">6. User Content</h2>
            <p>
              Users remain responsible for the content they upload or create, including research documents, datasets, resources, papers, references, task content, and chat messages. Users are responsible for ensuring they have the rights necessary to upload/share the content.
            </p>

            <h2 id="uploaded-files-and-research-materials" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">7. Uploaded Files and Research Materials</h2>
            <p>
              ResearchHub is a collaboration and organization platform. It does not independently verify the accuracy, originality, legality, or scientific validity of research materials uploaded by users.
            </p>

            <h2 id="collaboration-and-communication" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">8. Collaboration and Communication</h2>
            <p>
              You are responsible for your interactions with other users on the platform, including messages sent in project chats.
            </p>

            <h2 id="intellectual-property" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">9. Intellectual Property</h2>
            <p>
              ResearchHub does not claim ownership over your research content. You retain all rights to your original research.
            </p>

            <h2 id="prohibited-use" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">10. Prohibited Use</h2>
            <p>
              ResearchHub may not be used for activities that violate any laws, regulations, or third-party rights.
            </p>

            <h2 id="third-party-services" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">11. Third-Party Services</h2>
            <p>
              ResearchHub utilizes third-party services such as cloud file storage for applicable files and an email delivery provider for project invitations. Your use of these features may be subject to their respective terms.
            </p>

            <h2 id="availability-and-changes" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">12. Availability and Changes</h2>
            <p>
              We strive to keep ResearchHub operational, but features may change or become temporarily unavailable without notice.
            </p>

            <h2 id="disclaimer" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">13. Disclaimer</h2>
            <p>
              ResearchHub is intended to support research collaboration and project organization. It is not a substitute for institutional research governance, ethics review, data protection procedures, or other requirements applicable to a user's research.
            </p>

            <h2 id="limitation-of-liability" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">14. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ResearchHub is provided "as is" without warranties of any kind. We are not liable for lost data, lost research, or other indirect damages.
            </p>

            <h2 id="changes-to-terms" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">15. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of ResearchHub after changes indicates your acceptance of the updated terms.
            </p>

            <h2 id="contact" className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">16. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us using the platform's standard contact channels.
            </p>
          </div>
        </div>

        {/* Table of Contents (Desktop only) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">On this page</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#acceptance-of-terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Acceptance of Terms</a></li>
              <li><a href="#use-of-researchhub" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Use of ResearchHub</a></li>
              <li><a href="#user-accounts" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">User Accounts</a></li>
              <li><a href="#research-projects" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Research Projects</a></li>
              <li><a href="#user-content" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">User Content</a></li>
              <li><a href="#uploaded-files-and-research-materials" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Uploaded Files</a></li>
              <li><a href="#disclaimer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
