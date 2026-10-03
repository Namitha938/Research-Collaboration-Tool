import React from 'react';
import { Link } from 'react-router-dom';
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

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
import StatsSection from '../components/StatsSection';
import DashboardPreview from '../components/DashboardPreview';

const Landing = () => {
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
      description: "Organize references and citations for your research papers automatically."
    },
    {
      icon: <LineChart size={24} />,
      title: "Progress Tracking",
      description: "Track milestones, deadlines, and overall research progress with visual analytics."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-100 to-blue-50 blur-[100px] opacity-70"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-primary-50 blur-[100px] opacity-60"></div>
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 mb-8 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Built for modern research teams
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Collaborate. Research. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Discover.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            One workspace for researchers and students to collaborate, manage research projects, organize resources, and turn ideas into meaningful discoveries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">Start Researching</Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">Explore Features</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section (Visually part of Hero) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20 relative z-10 -mt-4">
        <DashboardPreview />
      </section>

      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Everything your research team needs" 
            subtitle="A complete suite of tools designed specifically for the unique workflows of academic and professional research teams."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <SectionHeading 
                title="Your entire research workflow, in one place." 
                subtitle="Stop switching between ten different apps. ResearchHub brings your documents, data, tasks, and team communication into a single unified platform."
                centered={false}
              />
              
              <div className="space-y-10 mt-12">
                <StepCard 
                  number="01" 
                  title="Create a Project" 
                  description="Start your research project, define its goals, structure, and required resources." 
                />
                <StepCard 
                  number="02" 
                  title="Build Your Team" 
                  description="Invite collaborators, assign roles, and set up permissions for secure teamwork." 
                />
                <StepCard 
                  number="03" 
                  title="Collaborate & Research" 
                  description="Share documents, upload datasets, assign tasks, and exchange ideas in real-time." 
                />
                <StepCard 
                  number="04" 
                  title="Track Progress" 
                  description="Monitor milestones, manage deadlines, and move your research forward seamlessly." 
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-blue-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Research team collaborating" 
                className="rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800/50 object-cover w-full aspect-[4/3]"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[400px] bg-primary-600/20 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to build better research together?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Bring your research team, resources, and ideas together in one powerful workspace.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 shadow-xl shadow-white/10 hover:shadow-white/20">
              Start Your Research <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
