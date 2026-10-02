import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FolderKanban, Activity, Settings, LogOut, LayoutDashboard, 
  ShieldCheck, TrendingUp, Plus, Search, Filter, ArrowUpRight, 
  FileText, CheckCircle2, Clock, AlertTriangle, Menu, X, Bell, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { 
      label: "Total Registered Researchers", 
      value: "2,543", 
      trend: "+14.2% vs last month", 
      icon: Users, 
      gradient: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      badge: "Active Growth"
    },
    { 
      label: "Active Research Projects", 
      value: "432", 
      trend: "+8.5% new submissions", 
      icon: FolderKanban, 
      gradient: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
      badge: "+12 This Week"
    },
    { 
      label: "Live Collaboration Sessions", 
      value: "1,892", 
      trend: "99.9% Uptime", 
      icon: Activity, 
      gradient: "from-emerald-500 to-teal-700",
      accent: "text-emerald-400",
      badge: "Real-time"
    },
    { 
      label: "IRB Approvals Pending", 
      value: "14", 
      trend: "Action Required", 
      icon: ShieldCheck, 
      gradient: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      badge: "Urgent"
    }
  ];

  const recentRegistrations = [
    { name: "Dr. Sarah Connor", role: "Principal Investigator", dept: "Neuroscience Lab", email: "sarah.c@mit.edu", status: "Verified", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120" },
    { name: "Prof. Michael Chang", role: "Quantum Physicist", dept: "CERN Research", email: "m.chang@cern.ch", status: "Verified", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" },
    { name: "Elena Rostova", role: "Data Scientist", dept: "AI BioTech", email: "elena@biotech.io", status: "Pending", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120" },
    { name: "David Miller", role: "Postdoc Fellow", dept: "Genomics Inst.", email: "d.miller@harvard.edu", status: "Verified", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
  ];

  const exportAuditLog = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,User,Action,IP_Address,Status\n"
      + `${new Date().toISOString()},Admin,Exported Audit Log,192.168.1.1,Success\n`
      + `${new Date().toISOString()},sarah.c@mit.edu,Created Project BioGen-9,10.0.0.4,Success\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ResearchHub_Audit_Trail_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ControlCenter
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-extrabold text-indigo-400">Admin Portal v2.4</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 space-y-6 overflow-y-auto">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Main Navigation</div>
            <nav className="space-y-1.5">
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-600/20">
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all font-medium">
                <Users size={18} /> User Directory
              </Link>
              <Link to="/projects" className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all font-medium">
                <FolderKanban size={18} /> Research Projects
              </Link>
              <Link to="/dashboard" className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all font-medium">
                <Activity size={18} /> User Dashboard
              </Link>
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Security & Compliance</div>
            <nav className="space-y-1.5">
              <button onClick={exportAuditLog} className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all font-medium text-left">
                <span className="flex items-center gap-3"><FileText size={18} className="text-emerald-400" /> Export Audit CSV</span>
                <Download size={14} className="text-slate-500" />
              </button>
              <Link to="/settings" className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all font-medium">
                <Settings size={18} /> Platform Config
              </Link>
            </nav>
          </div>
        </div>
        
        {/* User Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-800/40">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "System Admin"}</p>
              <p className="text-xs text-indigo-400 truncate">{user?.email || "admin@researchhub.edu"}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 transition-all text-sm font-medium border border-slate-700/50"
          >
            <LogOut size={16} /> End Session
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md md:hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={24} />
              <span className="font-bold text-white text-lg">Admin Control</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold">Overview</Link>
            <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-800">User Management</Link>
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-800">Projects</Link>
            <button onClick={() => { exportAuditLog(); setMobileMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-xl text-emerald-400 hover:bg-slate-800">Export Audit Log CSV</button>
            <button onClick={logout} className="w-full text-left py-3 px-4 rounded-xl text-rose-400 hover:bg-rose-900/30">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">System Operations Center</h1>
              <p className="text-xs md:text-sm text-slate-400">Monitoring lab metrics, system security, and researchers.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportAuditLog} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all">
              <Download size={14} /> Export Audit Log
            </button>
            <div className="relative">
              <button className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-900"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Banner Hero */}
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
          
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-purple-900/70 to-slate-900 p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-950">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Platform Operational
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome to Executive Admin Panel
                </h2>
                <p className="text-slate-300 text-sm max-w-xl">
                  Manage enterprise researchers, verify institutional credentials, and oversee live collaborative research workflows across global teams.
                </p>
              </div>

              <div className="flex gap-3">
                <Link to="/admin/users" className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all">
                  Manage Users & Roles
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="relative group rounded-3xl bg-slate-900/80 p-6 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${stat.gradient} text-white shadow-lg`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {stat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className={`text-xs font-bold ${stat.accent} flex items-center gap-1`}>
                      <TrendingUp size={12} /> {stat.trend}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Analytics Mock Graphic */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="text-indigo-400" size={20} /> System Performance & Bandwidth
                  </h3>
                  <p className="text-xs text-slate-400">Real-time server throughput and paper sync operations</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Live Traffic
                </span>
              </div>

              {/* Graphical Visualization Bar Mock */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">API Endpoint Load (Express.js)</span>
                    <span className="text-indigo-400">42% Capacity</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[42%] animate-pulse"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Database Connections (MongoDB Atlas)</span>
                    <span className="text-emerald-400">89 Active Sockets</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[68%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Storage Usage (Manuscripts & Uploads)</span>
                    <span className="text-purple-400">142.8 GB / 1 TB</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[28%]"></div>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-center">
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Latency</p>
                  <p className="text-base font-extrabold text-emerald-400">18ms</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">LaTeX Compiler</p>
                  <p className="text-base font-extrabold text-indigo-400">Ready</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Socket.IO</p>
                  <p className="text-base font-extrabold text-teal-400">Connected</p>
                </div>
              </div>
            </div>

            {/* Recent Registrations Side Panel */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="text-purple-400" size={20} /> New Researchers
                  </h3>
                  <Link to="/admin/users" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</Link>
                </div>

                <div className="space-y-4">
                  {recentRegistrations.map((userItem, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
                      <img src={userItem.avatar} alt={userItem.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40" />
                      <div className="flex-1 truncate">
                        <p className="text-sm font-bold text-white truncate">{userItem.name}</p>
                        <p className="text-xs text-slate-400 truncate">{userItem.dept}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        userItem.status === 'Verified' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {userItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link to="/admin/users" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all">
                  Manage Access Permissions <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
