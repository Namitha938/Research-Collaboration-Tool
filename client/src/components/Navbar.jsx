import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Atom, ArrowRight } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
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
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Atom size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ResearchHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary-600 transition-colors mr-2">
              Admin Portal <ArrowRight size={14} />
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" className="text-base font-medium text-slate-700 py-2 border-b border-slate-100">Home</Link>
          <a href="#features" className="text-base font-medium text-slate-700 py-2 border-b border-slate-100">Features</a>
          <a href="#how-it-works" className="text-base font-medium text-slate-700 py-2 border-b border-slate-100">How It Works</a>
          <div className="flex flex-col gap-3 mt-2">
            <Link to="/admin/login" className="flex items-center justify-center gap-1 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors py-1">
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
