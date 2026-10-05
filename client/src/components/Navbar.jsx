import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Atom, ArrowRight, Sun, Moon, LayoutGrid, User as UserIcon, LogOut } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 dark:bg-primary-500 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Atom size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              ResearchHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How It Works</a>
            <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <LayoutGrid size={15} /> Dashboard
                  </Button>
                </Link>
                <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
                  <ProfileDropdown showName={true} align="right" />
                </div>
              </>
            ) : (
              <>
                <Link to="/admin/login" className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-2">
                  Admin Portal <ArrowRight size={14} />
                </Link>
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && <ProfileDropdown showName={false} align="right" />}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" className="text-base font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">Home</Link>
          <a href="#features" className="text-base font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">Features</a>
          <a href="#how-it-works" className="text-base font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">How It Works</a>
          <div className="flex flex-col gap-3 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  {user.profilePicture || user.avatar ? (
                    <img
                      src={user.profilePicture || user.avatar}
                      alt={user.name || "User"}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-primary-600 dark:text-primary-400 capitalize">
                      {user.role || "Researcher"}
                    </span>
                  </div>
                </div>
                <Link to="/dashboard">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <LayoutGrid size={16} /> Go to Dashboard
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <UserIcon size={16} /> Profile & Settings
                  </Button>
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/login" className="flex items-center justify-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors py-1">
                  Admin Portal <ArrowRight size={14} />
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
