import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResearchGuide = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Research Guide</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Best practices for utilizing ResearchHub to streamline your academic or professional research workflows.
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Starting a Research Project</h2>
            <p>Begin by defining the scope of your research. Create a project in ResearchHub and provide a clear description and research area. This sets the foundation for your workspace.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Building a Research Team</h2>
            <p>Once the project exists, invite your collaborators. Assign roles based on responsibility: use the <strong>Researcher</strong> role for active contributors and the <strong>Viewer</strong> role for stakeholders who only need to monitor progress.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Planning Research Tasks</h2>
            <p>Break your methodology into discrete tasks. Assign tasks to specific team members and establish deadlines to maintain momentum. Regularly update task statuses to keep everyone aligned.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Organizing Research Documents & Resources</h2>
            <p>Upload raw data, ethical approval forms, and drafts to the <strong>Documents</strong> module. Use the <strong>Resources</strong> module to save links to external datasets or code repositories used in your methodology.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Managing Literature (Papers & References)</h2>
            <p>A strong literature review requires organization. Catalog the academic papers you are reading in the <strong>Research Papers</strong> tab. Store citation formats in the <strong>References</strong> tab so they are readily available when writing your manuscript.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Collaborating with Team Members</h2>
            <p>Use the <strong>Project Chat</strong> for quick questions and brainstorming. For actionable items, create tasks. This prevents important decisions from getting lost in a chat timeline.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">7. Tracking Progress via Milestones</h2>
            <p>Set <strong>Milestones</strong> for major phases of your research (e.g., "Data Collection Complete", "First Draft Submitted"). This provides a high-level overview of whether the project is on track.</p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResearchGuide;
