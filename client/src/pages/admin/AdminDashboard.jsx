import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FolderKanban, Activity, Settings, LogOut, LayoutDashboard, 
  ShieldCheck, TrendingUp, Plus, Search, Filter, ArrowUpRight, 
  FileText, CheckCircle2, Clock, AlertTriangle, Menu, X, Bell, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api/adminService';
import toast from 'react-hot-toast';
import AdminNotificationDropdown from '../../components/AdminNotificationDropdown';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setStatsData(res);
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const stats = statsData ? [
    { 
      label: "Total Users", 
      value: statsData.stats.users.total, 
      trend: `${statsData.stats.users.researchers} Researchers`, 
      icon: Users, 
      gradient: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      badge: "Platform Users"
    },
    { 
      label: "Total Projects", 
      value: statsData.stats.projects.total, 
      trend: "Across all fields", 
      icon: FolderKanban, 
      gradient: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
      badge: "Total Work"
    },
    { 
      label: "Active Projects", 
      value: statsData.stats.projects.active, 
      trend: "Currently progressing", 
      icon: Activity, 
      gradient: "from-emerald-500 to-teal-700",
      accent: "text-emerald-400",
      badge: "In Progress"
    },
    { 
      label: "Completed Projects", 
      value: statsData.stats.projects.completed, 
      trend: "Successfully finished", 
      icon: CheckCircle2, 
      gradient: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      badge: "Archived"
    }
  ] : [];

  const recentRegistrations = statsData ? statsData.recentUsers : [];

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="flex h-full w-[266px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 hidden md:flex shrink-0">
        <div className="flex h-[75px] items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500 text-white shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                AdminPanel
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-primary-500">v2.4</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div>
            <div className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500">MAIN NAVIGATION</div>
            <div className="space-y-1">
              <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <Users size={18} /> User Directory
              </Link>
              <Link to="/admin/projects" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <FolderKanban size={18} /> Research Projects
              </Link>
              <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <Activity size={18} /> User Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500">SECURITY & COMPLIANCE</div>
            <div className="space-y-1">
              <button onClick={exportAuditLog} className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-left">
                <span className="flex items-center gap-3"><FileText size={18} className="text-emerald-500" /> Export Audit CSV</span>
                <Download size={14} className="text-slate-400" />
              </button>
              <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <Settings size={18} /> Platform Config
              </Link>
            </div>
          </div>
        </nav>
        
        {/* User Card */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 font-semibold text-primary-600 dark:text-primary-400">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "System Admin"}</p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.email || "admin@researchhub.edu"}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md md:hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={24} />
              <span className="font-bold text-slate-900 dark:text-white text-lg">Admin Control</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold">Overview</Link>
            <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800">User Management</Link>
            <Link to="/admin/projects" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800">Projects</Link>
            <button onClick={() => { exportAuditLog(); setMobileMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-xl text-emerald-400 hover:bg-slate-100 dark:bg-slate-800">Export Audit Log CSV</button>
            <button onClick={logout} className="w-full text-left py-3 px-4 rounded-xl text-rose-400 hover:bg-rose-900/30">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[75px] items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">System Operations Center</h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={exportAuditLog} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold transition-colors">
              <Download size={16} /> Export Audit Log
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-5">
              <AdminNotificationDropdown />
            </div>
          </div>
        </header>

        {/* Banner Hero */}
        <div className="p-6 md:p-8 max-w-[1300px] mx-auto space-y-8">
          
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-primary-100/50 dark:bg-primary-900/10 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Platform Operational
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome to Executive Admin Panel
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                  Manage enterprise researchers, verify institutional credentials, and oversee live collaborative research workflows across global teams.
                </p>
              </div>

              <div className="flex gap-3">
                <Link to="/admin/users" className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">
                  Manage Users & Roles
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-10">
                <span className="text-indigo-400 font-bold animate-pulse">Loading dashboard statistics...</span>
              </div>
            ) : (
              stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={idx} 
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400`}>
                        <Icon size={18} />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                      <p className={`mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1`}>
                        <TrendingUp size={14} className="text-primary-500" /> {stat.trend}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Charts & Activity Grid */}
          <div className="grid grid-cols-1 gap-8">
            
            {/* Recent Registrations Side Panel */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-primary-500" /> New Researchers
                  </h3>
                  <Link to="/admin/users" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <div className="text-center py-4">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">Loading recent users...</span>
                    </div>
                  ) : recentRegistrations.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                      No users found.
                    </div>
                  ) : (
                    recentRegistrations.map((userItem, i) => (
                      <div key={i} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                          {userItem.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userItem.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userItem.email}</p>
                        </div>
                        <span className={`text-xs font-medium capitalize ${
                          userItem.role === 'admin' 
                            ? 'text-purple-600 dark:text-purple-400' 
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {userItem.role}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
