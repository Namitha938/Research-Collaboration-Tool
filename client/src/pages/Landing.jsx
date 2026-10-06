import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Users, 
  CheckSquare, 
  FileText, 
  Database, 
  MessageSquare,
  BookOpen,
  LineChart,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
import StatsSection from '../components/StatsSection';
import DashboardPreview from '../components/DashboardPreview';
import RevealOnScroll from '../components/RevealOnScroll';

import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogleFirebase } from '../config/firebase';

const Landing = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

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

  const features = [
    {
      icon: <FolderKanban size={24} />,
      title: "Research Projects",
      description: "Create and manage research projects from one centralized workspace with customizable workflows."
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Invite researchers, assign roles, and collaborate efficiently securely."
    },
    {
      icon: <CheckSquare size={24} />,
      title: "Task Management",
      description: "Create, assign, prioritize, and track research tasks and experimental procedures."
    },
    {
      icon: <FileText size={24} />,
      title: "Document Sharing",
      description: "Upload, organize, and collaborate on research papers, drafts, and related documents."
    },
    {
      icon: <Database size={24} />,
      title: "Dataset Management",
      description: "Store and organize datasets and research resources with version control capabilities."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Real-Time Discussions",
      description: "Communicate with your research team through contextual, real-time discussions."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Citation Management",
      description: "Organize references and citations for your research papers automatically With our Website."
    },
    {
      icon: <LineChart size={24} />,
      title: "Progress Tracking",
      description: "Track milestones, deadlines, and overall research progress with visual analytics."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white dark:text-slate-100 selection:bg-primary-100 dark:selection:bg-indigo-500 selection:text-primary-900 dark:selection:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-100 dark:from-indigo-600/30 to-blue-50 dark:to-purple-600/20 blur-[100px] opacity-70"
          />
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4 pointer-events-none">
          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100 dark:from-purple-600/25 to-primary-50 dark:to-pink-500/20 blur-[100px] opacity-60"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-300 mb-8 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Built for modern research teams
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Collaborate. Research. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 dark:from-indigo-400 to-blue-600 dark:to-pink-400">Discover.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            One workspace for researchers and students to collaborate, manage research projects, organize resources, and turn ideas into meaningful discoveries.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link to="/dashboard" className="block w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:border-0">
                    Enter Workspace <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link to="/register" className="block w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:border-0">
                      Start Researching
                    </Button>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 h-[52px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-semibold text-[15px] transition-all shadow-sm hover:border-slate-400 dark:hover:border-slate-600 disabled:opacity-60"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </motion.button>
              </>
            )}
            {!user && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <a href="#features" className="block w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">Explore Features</Button>
                </a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview Section (Visually part of Hero) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20 relative z-10 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <DashboardPreview />
        </motion.div>
      </section>

      <RevealOnScroll delay={200}>
        <StatsSection />
      </RevealOnScroll>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading 
              title="Everything your research team needs" 
              subtitle="A complete suite of tools designed specifically for the unique workflows of academic and professional research teams."
            />
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <RevealOnScroll>
                <SectionHeading 
                  title="Your entire research workflow, in one place." 
                  subtitle="Stop switching between ten different apps. ResearchHub brings your documents, data, tasks, and team communication into a single unified platform."
                  centered={false}
                />
              </RevealOnScroll>
              
              <div className="space-y-10 mt-12">
                <RevealOnScroll delay={100}>
                  <StepCard 
                    number="01" 
                    title="Create a Project" 
                    description="Start your research project, define its goals, structure, and required resources." 
                  />
                </RevealOnScroll>
                <RevealOnScroll delay={200}>
                  <StepCard 
                    number="02" 
                    title="Build Your Team" 
                    description="Invite collaborators, assign roles, and set up permissions for secure teamwork." 
                  />
                </RevealOnScroll>
                <RevealOnScroll delay={300}>
                  <StepCard 
                    number="03" 
                    title="Collaborate & Research" 
                    description="Share documents, upload datasets, assign tasks, and exchange ideas in real-time." 
                  />
                </RevealOnScroll>
                <RevealOnScroll delay={400}>
                  <StepCard 
                    number="04" 
                    title="Track Progress" 
                    description="Monitor milestones, manage deadlines, and move your research forward seamlessly." 
                  />
                </RevealOnScroll>
              </div>
            </div>

            <RevealOnScroll delay={200} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 dark:from-indigo-900/30 to-blue-50 dark:to-purple-900/30 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Research team collaborating" 
                className="rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800/50 object-cover w-full aspect-[4/3]"
              />
            </RevealOnScroll>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[400px] bg-primary-600/20 blur-[120px] rounded-full"></div>
        </div>
        
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to build better research together?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Bring your research team, resources, and ideas together in one powerful workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="light" size="lg">
                    Enter Workspace <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="light" size="lg">
                    Start Your Research <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
