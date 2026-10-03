import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  BookOpen,
  LineChart,
  ArrowRight,
  ShieldCheck,
  Globe,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Building2,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import DashboardPreview from "../components/DashboardPreview";

const THEME_KEY = "researchhub-theme";

// All theme-dependent classes live here, so the toggle works
// regardless of your Tailwind darkMode configuration.
const themes = {
  dark: {
    page: "bg-slate-950 text-slate-100",
    blob1: "from-indigo-600/30 via-purple-600/25 to-pink-500/20",
    blob2: "bg-blue-500/20",
    badge: "from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-indigo-400/30 text-indigo-300 shadow-indigo-500/10",
    badgeIcon: "text-indigo-400",
    heading: "text-white",
    headingGradient: "from-indigo-400 via-purple-400 via-pink-400 to-rose-400",
    lead: "text-slate-300",
    primaryBtn: "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 border-0 font-bold",
    secondaryBtn: "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 backdrop-blur-md",
    previewInner: "bg-slate-900 border-slate-800",
    partnerSection: "border-slate-800 bg-slate-900/60",
    partnerLabel: "text-indigo-400",
    partnerTile: "bg-slate-800/50 border-slate-700/60 text-slate-200",
    statsSection: "bg-slate-950",
    statCard: "bg-slate-900 border-slate-800",
    muted: "text-slate-400",
    featuresSection: "bg-slate-900",
    pillPurple: "text-purple-400 bg-purple-950/80 border-purple-800/60",
    title: "text-white",
    featCard: "bg-slate-950 border-slate-800 hover:border-slate-700",
    securitySection: "bg-slate-950 border-slate-800",
    pillGreen: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60",
    secItem: "bg-slate-900 border-slate-800",
    check: "text-emerald-400",
    statusPanel: "bg-slate-900 text-white border-slate-800",
    statusDivider: "border-slate-800",
    statusRow: "bg-slate-950 border-slate-800 text-slate-300",
    statusOk: "text-emerald-400",
    shield: "text-indigo-400",
    faqSection: "bg-slate-900",
    faqCard: "bg-slate-950 border-slate-800",
    faqBtn: "text-white hover:text-indigo-400",
    faqChevron: "text-indigo-400",
    faqChevronIdle: "text-slate-400",
    faqAnswer: "text-slate-400 border-slate-900",
    cta: "from-indigo-900 via-purple-900 to-slate-900",
    ctaBtn: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white",
    ctaText: "text-slate-300",
    toggle: "bg-slate-800 text-slate-100 border-slate-600 hover:bg-slate-700 shadow-black/40",
  },
  light: {
    page: "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white",
    blob1: "from-indigo-400/30 via-purple-400/25 to-pink-300/25",
    blob2: "bg-blue-300/30",
    badge: "from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-300 text-indigo-700 shadow-indigo-500/10",
    badgeIcon: "text-indigo-600",
    heading: "text-slate-900 dark:text-white",
    headingGradient: "from-indigo-600 via-purple-600 via-pink-600 to-rose-600",
    lead: "text-slate-600 dark:text-slate-400",
    primaryBtn: "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 border-0 font-bold",
    secondaryBtn: "bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-300",
    previewInner: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
    partnerSection: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70",
    partnerLabel: "text-indigo-600",
    partnerTile: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300",
    statsSection: "bg-slate-50 dark:bg-slate-950",
    statCard: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
    muted: "text-slate-500 dark:text-slate-400",
    featuresSection: "bg-white dark:bg-slate-900",
    pillPurple: "text-purple-700 bg-purple-50 border-purple-200",
    title: "text-slate-900 dark:text-white",
    featCard: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300",
    securitySection: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800",
    pillGreen: "text-emerald-700 bg-emerald-50 border-emerald-200",
    secItem: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
    check: "text-emerald-600",
    statusPanel: "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800",
    statusDivider: "border-slate-200 dark:border-slate-800",
    statusRow: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300",
    statusOk: "text-emerald-600",
    shield: "text-indigo-600",
    faqSection: "bg-white dark:bg-slate-900",
    faqCard: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800",
    faqBtn: "text-slate-900 dark:text-white hover:text-indigo-600",
    faqChevron: "text-indigo-600",
    faqChevronIdle: "text-slate-500 dark:text-slate-400",
    faqAnswer: "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
    cta: "from-indigo-600 via-purple-600 to-pink-600",
    ctaBtn: "!bg-white dark:bg-slate-900 hover:!bg-slate-100 !text-black",
    ctaText: "text-indigo-50",
    toggle: "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 hover:bg-slate-100 shadow-slate-400/40",
  },
};

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    /* storage unavailable */
  }
  return "dark";
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === "dark";
  const t = themes[theme];

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* storage unavailable */
    }
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

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
    <div className={`min-h-screen ${t.page} selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden transition-colors duration-300`}>
      <Navbar />

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full border shadow-lg text-sm font-semibold transition duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${t.toggle}`}
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        <span>{isDark ? "Light" : "Dark"}</span>
      </button>

      {/* Colorful Animated Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Vibrant Gradient Background Mesh */}
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[500px] bg-gradient-to-tr ${t.blob1} rounded-full blur-[140px] pointer-events-none`} />
        <div className={`absolute top-40 right-10 -z-10 w-96 h-96 ${t.blob2} rounded-full blur-[120px] pointer-events-none`} />

        <div className="text-center max-w-4xl mx-auto relative z-10 animate-fade-in">
          {/* Neon Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r border text-xs font-bold uppercase tracking-wider mb-8 shadow-lg backdrop-blur-md ${t.badge}`}>
            <Sparkles className={`w-4 h-4 animate-pulse ${t.badgeIcon}`} />
            <span>Next-Gen Corporate & Academic Research OS</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight ${t.heading} mb-6 leading-[1.1]`}>
            Collaborate. Research. <br className="hidden sm:block" />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.headingGradient}`}>
              Discover Breakthroughs.
            </span>
          </h1>

          <p className={`text-base sm:text-lg md:text-xl ${t.lead} mb-10 max-w-2xl mx-auto leading-relaxed font-normal`}>
            A vibrant, centralized operating system for research labs, university departments, and corporate R&D teams to organize datasets, manage Kanban workflows, and publish faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className={`w-full sm:w-auto ${t.primaryBtn}`}>
                Start Research Workspace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className={`w-full sm:w-auto ${t.secondaryBtn}`}>
                Sign In to Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Colorful Interactive Dashboard Preview Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24 relative z-10">
        <div className="p-3 rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 shadow-2xl backdrop-blur-md">
          <div className={`rounded-2xl overflow-hidden border shadow-2xl ${t.previewInner}`}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Vibrant Corporate Partner Badge Carousel */}
      <section className={`py-16 border-y backdrop-blur-md ${t.partnerSection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-xs font-bold uppercase tracking-widest mb-8 ${t.partnerLabel}`}>
            Empowering Principal Investigators & Enterprise R&D Teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm hover:border-indigo-500 transition ${t.partnerTile}`}>
              <Building2 className="w-5 h-5 text-indigo-500" /> BioTech Labs
            </div>
            <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm hover:border-purple-500 transition ${t.partnerTile}`}>
              <Globe className="w-5 h-5 text-purple-500" /> Quantum Institute
            </div>
            <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm hover:border-pink-500 transition ${t.partnerTile}`}>
              <Award className="w-5 h-5 text-pink-500" /> Academic Council
            </div>
            <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm hover:border-emerald-500 transition ${t.partnerTile}`}>
              <Layers className="w-5 h-5 text-emerald-500" /> Neural Systems
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Corporate Metrics Grid */}
      <section className={`py-20 relative ${t.statsSection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {colorfulStats.map((stat, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border shadow-lg space-y-2 ${t.statCard}`}>
                <p className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                  {stat.value}
                </p>
                <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${t.muted}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Features Grid */}
      <section id="features" className={`py-24 relative ${t.featuresSection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className={`text-xs font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${t.pillPurple}`}>
              Full Suite Capabilities
            </span>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 ${t.title}`}>
              Everything Your Research Team Needs
            </h2>
            <p className={`mt-4 text-base leading-relaxed ${t.muted}`}>
              Consolidate datasets, papers, real-time messaging, and task execution into one unified research OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorfulFeatures.map((feat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border shadow-lg hover:-translate-y-1 transition duration-300 group ${t.featCard}`}
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition duration-300`}>
                  {feat.icon}
                </div>
                <h3 className={`text-base font-bold mb-2 ${t.title}`}>{feat.title}</h3>
                <p className={`text-xs leading-relaxed ${t.muted}`}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Security & Data Governance */}
      <section className={`py-24 border-y ${t.securitySection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${t.pillGreen}`}>
                Institutional Data Protection
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mt-4 mb-6 tracking-tight ${t.title}`}>
                Built for Strict Data Governance & Security
              </h2>
              <p className={`text-sm mb-8 leading-relaxed ${t.muted}`}>
                Protect sensitive intellectual property, research paper drafts, and proprietary lab datasets with enterprise-grade infrastructure controls.
              </p>

              <div className="space-y-4">
                {[
                  { title: "JWT & Salted Password Encryption", desc: "Token authentication with salted password hashing." },
                  { title: "Role-Based Access Control (RBAC)", desc: "Enforce Administrator vs. Researcher permission boundaries." },
                  { title: "Isolated Upload Storage", desc: "Server-side file sanitation and safe resource serving." },
                  { title: "Audit Trail & Activity Logs", desc: "Track full history of project changes, uploads, and deletions." },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${t.secItem}`}>
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${t.check}`} />
                    <div>
                      <p className={`text-sm font-semibold ${t.title}`}>{item.title}</p>
                      <p className={`text-xs ${t.muted}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative p-8 rounded-3xl border shadow-2xl space-y-6 ${t.statusPanel}`}>
              <div className={`flex items-center gap-3 border-b pb-4 ${t.statusDivider}`}>
                <ShieldCheck className={`w-8 h-8 ${t.shield}`} />
                <div>
                  <h3 className="font-bold text-lg">Enterprise SLA & Security</h3>
                  <p className={`text-xs ${t.muted}`}>Continuous System Status</p>
                </div>
              </div>
              <div className="space-y-4 text-xs font-mono">
                <div className={`flex justify-between p-3 rounded-xl border ${t.statusRow}`}>
                  <span>Data Access Control</span>
                  <span className={`font-bold ${t.statusOk}`}>ENFORCED</span>
                </div>
                <div className={`flex justify-between p-3 rounded-xl border ${t.statusRow}`}>
                  <span>Socket.IO Encrypted Channel</span>
                  <span className={`font-bold ${t.statusOk}`}>ACTIVE</span>
                </div>
                <div className={`flex justify-between p-3 rounded-xl border ${t.statusRow}`}>
                  <span>MongoDB Atlas Connection</span>
                  <span className={`font-bold ${t.statusOk}`}>CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful FAQ Accordion Section */}
      <section className={`py-24 ${t.faqSection}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-extrabold ${t.title}`}>Frequently Asked Questions</h2>
            <p className={`text-sm mt-2 ${t.muted}`}>Everything you need to know about adopting ResearchHub for your organization.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden ${t.faqCard}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full flex items-center justify-between p-5 text-left font-semibold text-sm transition ${t.faqBtn}`}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className={`w-4 h-4 ${t.faqChevron}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 ${t.faqChevronIdle}`} />
                  )}
                </button>
                {openFaq === idx && (
                  <div className={`px-5 pb-5 text-xs leading-relaxed border-t pt-3 ${t.faqAnswer}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Corporate CTA */}
      <section className={`py-24 bg-gradient-to-r ${t.cta} text-white relative overflow-hidden`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to Build Better Research Together?
          </h2>
          <p className={`text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${t.ctaText}`}>
            Join thousands of scientists, lab leads, and students collaborating seamlessly in one centralized platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className={`w-full sm:w-auto font-bold shadow-xl border-0 ${t.ctaBtn}`}>
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