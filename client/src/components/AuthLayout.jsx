import React from 'react';
import { Link } from 'react-router-dom';
import { Atom } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, illustration }) => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Subtle gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-600/30 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg">
            <Atom size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            ResearchHub
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-300">
            {subtitle}
          </p>
        </div>

        {illustration || (
          <div className="relative z-10 mt-12 w-full max-w-md aspect-video rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl p-6 flex flex-col gap-4">
             <div className="w-full h-4 bg-white/10 rounded-full w-1/3"></div>
             <div className="w-full h-24 bg-white/5 rounded-lg border border-white/5 mt-2"></div>
             <div className="flex gap-4 mt-2">
               <div className="flex-1 h-12 bg-white/5 rounded-lg border border-white/5"></div>
               <div className="flex-1 h-12 bg-white/5 rounded-lg border border-white/5"></div>
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
          <div className="lg:hidden flex justify-center items-center gap-2 mb-10">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Atom size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ResearchHub
            </span>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
