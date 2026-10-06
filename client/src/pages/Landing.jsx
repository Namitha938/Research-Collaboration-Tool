import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  Globe2,
  FileCheck2,
  TrendingUp,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Button from '../components/Button';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogleFirebase } from '../config/firebase';

const Landing = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const authData = await signInWithGoogleFirebase();
      const res = await api.post('/auth/google', {
        token: authData.idToken,
        idToken: authData.idToken,
        email: authData.email,
        name: authData.name,
        avatar: authData.avatar,
        googleId: authData.googleId,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(res.data.message || 'Welcome to ResearchHub Enterprise!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden lg:overflow-hidden font-sans">
      
      {/* Background Corporate Glow Orbs */}
      <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 -z-10 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 -z-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Corporate Fixed Navigation */}
      <Navbar />

      {/* Main Single-Viewport Hero Section */}
      <main className="flex-1 flex items-center pt-24 pb-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Enterprise Value Proposition & CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center animate-fade-in">
            
            {/* Enterprise Tag */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-5 w-fit shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide uppercase text-[11px] text-indigo-400 font-bold">Enterprise Research Cloud</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">SOC-2 & ISO 27001 Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-4">
              Empowering Scientific Discovery. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400">
                Engineered for Collaboration.
              </span>
            </h1>

            {/* Corporate Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 max-w-2xl leading-relaxed font-normal">
              A unified institutional workspace connecting multi-disciplinary research labs, universities, and enterprise researchers with seamless dataset governance, real-time collaboration, and automated milestone tracking.
            </p>

            {/* Action Buttons Cluster */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 shadow-lg shadow-indigo-600/30 border-0 flex items-center gap-2">
                    Enter Workspace <ArrowRight size={17} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 shadow-lg shadow-indigo-600/30 border-0 flex items-center gap-2">
                      Launch Workspace <ArrowRight size={17} />
                    </Button>
                  </Link>

                  {/* Firebase Google Auth Button on Hero */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-semibold text-sm transition-all shadow-md hover:border-slate-600 active:scale-95 disabled:opacity-60"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

              <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/50">
                <ShieldCheck size={15} className="text-indigo-400" />
                Admin Portal Console
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* Corporate Performance Metric Cards (Single-line row) */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 max-w-xl">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">99.98%</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Reliability SLA</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">500+</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Global Labs</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">100k+</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Citations</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-1">
                  <Lock size={15} /> 256-Bit
                </p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Encryption</p>
              </div>
            </div>

          </div>

          {/* Right Column: Executive Live Research Cockpit Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full animate-fade-in-delay-1">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-800/70 backdrop-blur-xl shadow-2xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-600">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">rct-production-node // us-east</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Stream
                </div>
              </div>

              {/* Lab Selector Bar */}
              <div className="flex items-center justify-between mt-4 bg-slate-900/80 p-3 rounded-xl border border-slate-750">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">Quantum & AI Genomics Lab</h3>
                    <p className="text-[11px] text-slate-400">Institutional Grant #NIH-2026-X84</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                  Tier-1 Core
                </span>
              </div>

              {/* Live Metric Counters */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Active Projects</p>
                  <p className="text-xl font-bold text-white mt-1">12 <span className="text-xs font-semibold text-emerald-400">+2</span></p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Peer Reviews</p>
                  <p className="text-xl font-bold text-white mt-1">6 <span className="text-xs font-semibold text-indigo-400">In Review</span></p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Completion</p>
                  <p className="text-xl font-bold text-white mt-1">94.8%</p>
                </div>
              </div>

              {/* Current Milestone Track */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-4">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">Phase 3: Neural Model Benchmarks</span>
                  <span className="text-indigo-400 font-mono font-bold">82%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full w-[82%]"></div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                  <span>Target: Q4 Peer Review</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <FileCheck2 size={12} /> Dataset Verified
                  </span>
                </div>
              </div>

              {/* Active Researchers Strip */}
              <div className="flex items-center justify-between bg-slate-900/70 px-3.5 py-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Dr. Sarah Chen" />
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Prof. Michael Ross" />
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Elena Rostova" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 ml-1">8 Researchers Online</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Real-time Sync</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Corporate Trust Bar & Footer (Anchored neatly at viewport bottom) */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md py-3.5 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          
          {/* Institutional Trust Logos */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Trusted By:</span>
            <span className="font-semibold text-slate-300 tracking-wider">STANFORD</span>
            <span className="text-slate-700">•</span>
            <span className="font-semibold text-slate-300 tracking-wider">MIT LABS</span>
            <span className="text-slate-700">•</span>
            <span className="font-semibold text-slate-300 tracking-wider">OXFORD</span>
            <span className="text-slate-700">•</span>
            <span className="font-semibold text-slate-300 tracking-wider">CAMBRIDGE</span>
            <span className="text-slate-700">•</span>
            <span className="font-semibold text-slate-300 tracking-wider">MAX PLANCK</span>
          </div>

          {/* Compliance & Copyright */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck size={13} className="text-indigo-400" /> ISO 27001 / SOC-2
            </span>
            <span className="text-slate-700">•</span>
            <span>&copy; {new Date().getFullYear()} ResearchHub Enterprise Inc.</span>
            <span className="text-slate-700">•</span>
            <Link to="/admin/login" className="hover:text-indigo-300 transition-colors">Admin Console</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
