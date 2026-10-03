import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, FileText, Users, CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, illustration }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Left side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Subtle gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-600/30 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]"></div>
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2 group w-fit hover:opacity-80 transition-opacity">
          <div className="bg-primary-600 dark:bg-primary-500 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <Atom size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            ResearchHub
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-300">
            {subtitle}
          </p>
        </div>

        {illustration || (
          <div className="relative z-10 mt-12 w-full max-w-md rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="border-b border-white/10 p-4 bg-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                <Atom size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Quantum Computing Research</div>
                <div className="text-xs text-slate-400">Project Workspace</div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <FileText size={18} className="text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">New draft uploaded</div>
                  <div className="text-xs text-slate-400">2 hours ago</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Users size={18} className="text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">Team sync scheduled</div>
                  <div className="text-xs text-slate-400">Tomorrow at 10:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">Data analysis completed</div>
                  <div className="text-xs text-slate-400">By Dr. Smith</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} ResearchHub. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex justify-center items-center gap-2 mb-10 group hover:opacity-80 transition-opacity">
            <div className="bg-primary-600 dark:bg-primary-500 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Atom size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ResearchHub
            </span>
          </Link>

          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
