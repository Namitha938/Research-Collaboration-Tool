import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
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

const About = () => {
  const features = [
    {
      icon: <FolderKanban size={24} />,
      title: "Project Management",
      description: "Create and manage research projects from one centralized workspace."
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Invite researchers, assign roles, and collaborate securely."
    },
    {
      icon: <CheckSquare size={24} />,
      title: "Task Management",
      description: "Create, assign, prioritize, and track research tasks."
    },
    {
      icon: <FileText size={24} />,
      title: "Document Management",
      description: "Upload, organize, and collaborate on research documents."
    },
    {
      icon: <Database size={24} />,
      title: "Resources",
      description: "Store and organize datasets and research resources."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Research Papers",
      description: "Organize research papers and reference materials."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Real-Time Chat",
      description: "Communicate with your research team through project chat."
    },
    {
      icon: <LineChart size={24} />,
      title: "Activity & Progress",
      description: "Track milestones, activity history, and overall progress."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="text-center max-w-4xl mx-auto relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            About ResearchHub
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 mb-6 max-w-3xl mx-auto">
            One workspace for collaborative research.
          </p>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ResearchHub brings research projects, teams, tasks, resources, papers, references, and communication together in one centralized workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:border-0">Get Started</Button>
            </Link>
            <a href="#workflow" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">Explore Workflow</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem -> Solution Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">The Problem</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Research work often involves multiple disconnected tools for project planning, task management, documents, datasets, research papers, references, communication, and progress tracking.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                This fragmentation can make collaboration harder and make it difficult for teams to maintain a clear view of their research work.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 dark:from-red-900/20 to-orange-50 dark:to-orange-900/20 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">Disconnected Tasks</div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">Scattered Documents</div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">Lost References</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="my-16 text-center">
            <div className="inline-block p-4 bg-primary-50 dark:bg-indigo-900/30 rounded-full text-primary-600 dark:text-indigo-400">
              <ArrowRight size={32} className="rotate-90 md:rotate-0" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 dark:from-indigo-900/30 to-blue-50 dark:to-purple-900/30 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-white dark:bg-slate-950 border border-primary-200 dark:border-indigo-500/30 rounded-3xl p-8 shadow-md">
                <div className="text-center p-6 bg-primary-50 dark:bg-indigo-900/20 rounded-xl border border-primary-100 dark:border-indigo-500/20">
                  <h3 className="text-xl font-bold text-primary-700 dark:text-indigo-400 mb-2">ResearchHub Project</h3>
                  <p className="text-sm text-primary-600 dark:text-indigo-300">Everything in one centralized workspace</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Our Solution</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                ResearchHub brings these activities together around a research project. We provide a shared workspace where team members can collaborate securely.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Project-level permissions control what different members can access or manage, ensuring your research data remains organized and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Everything You Need" 
            subtitle="Explore the features that power collaborative research in our platform."
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

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="How It Works" 
            subtitle="The typical research workflow, simplified."
            centered={true}
          />
          
          <div className="space-y-8 mt-12">
            <StepCard 
              number="01" 
              title="Create Project" 
              description="Start your research project and define its core objectives." 
            />
            <StepCard 
              number="02" 
              title="Build Team" 
              description="Invite researchers and set up roles (Owner, Researcher, Viewer)." 
            />
            <StepCard 
              number="03" 
              title="Plan Tasks" 
              description="Divide the work into manageable tasks and assign them to team members." 
            />
            <StepCard 
              number="04" 
              title="Collect & Organize" 
              description="Upload documents, datasets, research papers, and references." 
            />
            <StepCard 
              number="05" 
              title="Collaborate & Track" 
              description="Discuss in real-time, complete tasks, and monitor project milestones." 
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[400px] bg-primary-600/20 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Our Vision
          </h2>
          <p className="text-xl md:text-2xl font-medium text-slate-300 italic mb-10 max-w-3xl mx-auto">
            "To make research collaboration more organized, connected, and accessible through a centralized digital workspace."
          </p>
          <Link to="/register">
            <Button variant="light" size="lg">
              Start Your Research <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
