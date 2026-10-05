import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Database, Link as LinkIcon, FileText, BookOpen } from 'lucide-react';

const ResourcesInfo = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Research Resources</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Centralize your research materials. The Resources module helps you organize the datasets, links, and files that power your work.
        </p>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-12 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">What you can store</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="mt-1 text-primary-600 dark:text-primary-400">
                <Database size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Datasets</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Keep track of the datasets utilized in your project. Ensure all team members have access to the exact data sources needed for analysis.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-primary-600 dark:text-primary-400">
                <LinkIcon size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Repositories & Links</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Store important URLs, external code repositories, and web references in an organized, searchable list.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-primary-600 dark:text-primary-400">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">General Files</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Upload applicable files that support your research context, making them easily accessible to the entire project team.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-primary-600 dark:text-primary-400">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">References</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Manage your research references and citations seamlessly within the workspace context.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <h3>Why use the Resources module?</h3>
          <p>
            When conducting research, materials often get scattered across local hard drives, browser bookmarks, and disconnected cloud folders. The ResearchHub Resources module solves this by acting as a definitive index for your project's materials.
          </p>
          <p>
            By keeping datasets and references attached directly to the project workspace, onboarding new team members becomes trivial, and you eliminate the risk of losing critical research assets when team compositions change.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResourcesInfo;
