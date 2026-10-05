import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Contact Us</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
          Have a question about ResearchHub or need support with your projects? We're here to help.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">General Inquiries</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              For general questions regarding the platform, technical issues, or account assistance.
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              Use the feedback tools available within your authenticated dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Support</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              ResearchHub is an evolving platform. We welcome suggestions, feature requests, and bug reports.
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              Reach out to the project maintainers via our repository or direct channels.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
