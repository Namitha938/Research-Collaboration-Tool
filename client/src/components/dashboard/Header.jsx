import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ setMobileMenuOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects, tasks..." 
            className="w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-slate-300 focus:bg-white dark:bg-slate-900 rounded-lg text-sm outline-none transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/notifications" className="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>
        <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
