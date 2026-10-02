import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  CheckSquare,
  FileText,
  Database,
  MessageSquare,
  BookOpen,
  LineChart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Building2,
  Layers,
  Star,
  Activity,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import DashboardPreview from "../components/DashboardPreview";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const colorfulFeatures = [
    {
      icon: <FolderKanban className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30",
      title: "Project Workspaces",
      description: "Centralized workspaces to organize multi-disciplinary research initiatives, milestones, and deliverables.",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30",
      title: "Granular Team Control",
      description: "Assign role-based access permissions for principal investigators, researchers, and external collaborators.",
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
      title: "Task Kanban Workflows",
      description: "Track experimental procedures, literature reviews, and task dependencies with visual Kanban boards.",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
      title: "Document Repository",
      description: "Securely upload, organize, and version control research papers, datasets, proposals, and progress reports.",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-violet-500 to-purple-600 shadow-purple-500/30",
      title: "Real-Time Socket Channels",
      description: "Contextual real-time communication channels per research room with typing status and instant messaging.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30",
      title: "Citation & Reference Manager",
      description: "Auto-format references, store DOI metadata, and generate instant IEEE & BibTeX citation strings.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30",
      title: "Research Progress Analytics",
      description: "Real-time task progress recalculation, milestone tracking, and workload distribution metrics.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-cyan-500/30",
      title: "Enterprise Governance",
      description: "Comprehensive audit logging, admin user management, role toggling, and data isolation controls.",
    },
  ];

  const colorfulStats = [
    { label: "Active Researchers", value: "50,000+", color: "from-indigo-600 to-blue-600" },
    { label: "Research Papers Shared", value: "250,000+", color: "from-purple-600 to-pink-600" },
    { label: "Institutional Uptime SLA", value: "99.99%", color: "from-emerald-500 to-teal-600" },
    { label: "Global Universities & Labs", value: "1,200+", color: "from-amber-500 to-orange-600" },
  ];

  const faqs = [
    {
      q: "How does ResearchHub protect institutional data and intellectual property?",
      a: "ResearchHub enforces strict role-based access control (RBAC), token authentication (JWT), and secure server-side file isolation. Only authorized team members assigned to a specific project workspace can view or download research assets.",
    },
    {
      q: "Can enterprise admins manage user roles and permissions?",
      a: "Yes. The built-in Admin Portal allows institutional administrators to monitor live system metrics, toggle user roles between Researcher and Administrator, and audit user accounts in real time.",
    },
    {
      q: "Does the platform support real-time collaboration?",
      a: "Absolutely. ResearchHub integrates Socket.IO for instant room-based team messaging, live typing notifications, and immediate updates across all active research projects.",
    },
    {
      q: "What file formats can be uploaded and stored?",
      a: "ResearchHub supports research papers, manuscripts, raw datasets, code archives, grant proposals, and presentation slides in PDF, DOCX, CSV, TXT, ZIP, PNG, and JPG formats up to 30MB per file.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* Colorful Animated Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Vibrant Gradient Background Mesh */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 -z-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto relative z-10 animate-fade-in">
          {/* Neon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-8 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen Corporate & Academic Research OS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Collaborate. Research. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-rose-400">
              Discover Breakthroughs.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            A vibrant, centralized operating system for research labs, university departments, and corporate R&D teams to organize datasets, manage Kanban workflows, and publish faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 border-0 font-bold">
                Start Research Workspace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 backdrop-blur-md">
                Sign In to Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Colorful Interactive Dashboard Preview Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24 relative z-10">
        <div className="p-3 rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 shadow-2xl backdrop-blur-md">
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Vibrant Corporate Partner Badge Carousel */}
      <section className="py-16 border-y border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-400 mb-8">
            Empowering Principal Investigators & Enterprise R&D Teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center gap-2 font-bold text-slate-200 text-sm hover:border-indigo-500 transition">
              <Building2 className="w-5 h-5 text-indigo-400" /> BioTech Labs
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center gap-2 font-bold text-slate-200 text-sm hover:border-purple-500 transition">
              <Globe className="w-5 h-5 text-purple-400" /> Quantum Institute
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center gap-2 font-bold text-slate-200 text-sm hover:border-pink-500 transition">
              <Award className="w-5 h-5 text-pink-400" /> Academic Council
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center gap-2 font-bold text-slate-200 text-sm hover:border-emerald-500 transition">
              <Layers className="w-5 h-5 text-emerald-400" /> Neural Systems
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Corporate Metrics Grid */}
      <section className="py-20 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {colorfulStats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
                <p className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Features Grid */}
      <section id="features" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-800/60 px-3 py-1 rounded-full">
              Full Suite Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4">
              Everything Your Research Team Needs
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Consolidate datasets, papers, real-time messaging, and task execution into one unified research OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorfulFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg hover:-translate-y-1 transition duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Security & Data Governance */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full">
                Institutional Data Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-6 tracking-tight">
                Built for Strict Data Governance & Security
              </h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Protect sensitive intellectual property, research paper drafts, and proprietary lab datasets with enterprise-grade infrastructure controls.
              </p>

              <div className="space-y-4">
                {[
                  { title: "JWT & Salted Password Encryption", desc: "Token authentication with salted password hashing." },
                  { title: "Role-Based Access Control (RBAC)", desc: "Enforce Administrator vs. Researcher permission boundaries." },
                  { title: "Isolated Upload Storage", desc: "Server-side file sanitation and safe resource serving." },
                  { title: "Audit Trail & Activity Logs", desc: "Track full history of project changes, uploads, and deletions." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-lg">Enterprise SLA & Security</h3>
                  <p className="text-xs text-slate-400">Continuous System Status</p>
                </div>
              </div>
              <div className="space-y-4 text-xs font-mono text-slate-300">
                <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span>Data Access Control</span>
                  <span className="text-emerald-400 font-bold">ENFORCED</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span>Socket.IO Encrypted Channel</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span>MongoDB Atlas Connection</span>
                  <span className="text-emerald-400 font-bold">CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful FAQ Accordion Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400 mt-2">Everything you need to know about adopting ResearchHub for your organization.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-white hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs leading-relaxed text-slate-400 border-t border-slate-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Corporate CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to Build Better Research Together?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of scientists, lab leads, and students collaborating seamlessly in one centralized platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold shadow-xl border-0">
                Create Workspace Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}