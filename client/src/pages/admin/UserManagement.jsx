import React from 'react';
import { Link } from 'react-router-dom';
import { Users, LayoutDashboard, ShieldCheck, LogOut, Search, Filter, MoreVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user, logout } = useAuth();

  // Mock data - replace with real API call later
  const mockUsers = [
    { id: 1, name: "Dr. Sarah Connor", email: "sarah@university.edu", role: "researcher", status: "Active", joined: "Oct 1, 2026" },
    { id: 2, name: "John Smith", email: "john@institute.org", role: "admin", status: "Active", joined: "Sep 28, 2026" },
    { id: 3, name: "Elena Rostova", email: "elena@lab.net", role: "researcher", status: "Inactive", joined: "Sep 25, 2026" },
    { id: 4, name: "Michael Chang", email: "m.chang@university.edu", role: "researcher", status: "Active", joined: "Sep 15, 2026" },
    { id: 5, name: "Hero Test", email: "hero@gmail.com", role: "researcher", status: "Active", joined: "Oct 1, 2026" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
          <ShieldCheck size={24} className="text-primary-400" />
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">Management</div>
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-600/10 text-primary-400 font-medium">
              <Users size={18} /> Users
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform users, roles, and access.</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Invite User
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <div className="relative w-full sm:w-72">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-colors w-full sm:w-auto justify-center">
                <Filter size={16} /> Filter
              </button>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 ${
                          user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                        } text-sm font-medium`}>
                          <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{user.joined}</td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-md hover:bg-slate-100 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
              <span>Showing 1 to 5 of 2,543 users</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">Next</button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
