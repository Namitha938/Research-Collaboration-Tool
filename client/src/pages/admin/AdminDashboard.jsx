import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, Activity, Settings, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: "Total Users", value: "2,543", trend: "+12%", icon: <Users size={20} className="text-blue-600" />, bg: "bg-blue-100" },
    { label: "Active Researchers", value: "1,892", trend: "+5%", icon: <Activity size={20} className="text-emerald-600" />, bg: "bg-emerald-100" },
    { label: "Research Projects", value: "432", trend: "+18%", icon: <FolderKanban size={20} className="text-purple-600" />, bg: "bg-purple-100" },
    { label: "Pending Approvals", value: "14", trend: "-2%", icon: <ShieldCheck size={20} className="text-amber-600" />, bg: "bg-amber-100" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
          <ShieldCheck size={24} className="text-primary-400" />
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Management</div>
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-600/10 text-primary-400 font-medium">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Users size={18} /> Users
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <FolderKanban size={18} /> Projects
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Activity size={18} /> Activity Logs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Settings size={18} /> Settings
            </a>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary-400" />
            <span className="font-bold">AdminPanel</span>
          </div>
          <button onClick={logout} className="p-2 bg-slate-800 rounded-lg">
            <LogOut size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Platform overview and management metrics.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholders for future content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
              <Activity size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Platform Activity Chart</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">API integration required to display real-time activity metrics and charts.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Registrations</h3>
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">New Researcher {i}</p>
                      <p className="text-xs text-slate-500">Joined {i} hour(s) ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
