import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Atom, ArrowRight, Sun, Moon } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
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
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'}`}>Home</Link>
            <a href="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How It Works</a>
            <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'}`}>About</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/admin/login" className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-2">
              Admin Portal <ArrowRight size={14} />
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
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
          <Link to="/" className={`text-base font-medium py-2 border-b border-slate-100 dark:border-slate-800 ${location.pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>Home</Link>
          <a href="/#features" className="text-base font-medium text-slate-700 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-slate-800">Features</a>
          <a href="/#how-it-works" className="text-base font-medium text-slate-700 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-slate-800">How It Works</a>
          <Link to="/about" className={`text-base font-medium py-2 border-b border-slate-100 dark:border-slate-800 ${location.pathname === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>About</Link>
          <div className="flex flex-col gap-3 mt-2">
            <Link to="/admin/login" className="flex items-center justify-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors py-1">
              Admin Portal <ArrowRight size={14} />
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
