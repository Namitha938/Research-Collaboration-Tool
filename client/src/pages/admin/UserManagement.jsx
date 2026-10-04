import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, LayoutDashboard, ShieldCheck, LogOut, Search, Filter, FolderKanban, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUsers } from '../../api/adminService';
import toast from 'react-hot-toast';
import AdminNotificationDropdown from '../../components/AdminNotificationDropdown';

const UserManagement = () => {
  const { user, logout } = useAuth();
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter]);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const res = await getUsers({ page, limit: pagination.limit, search: searchTerm, role: roleFilter });
      if (res.success) {
        setUsersList(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
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
              <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Users size={18} /> User Directory
              </Link>
              <Link to="/admin/projects" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
                <FolderKanban size={18} /> Research Projects
              </Link>
            </div>
          </div>
        </nav>
        
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[75px] items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500 text-white shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 border-slate-200 dark:border-slate-800 md:border-l md:pl-5">
              <AdminNotificationDropdown />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-[1300px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform users, roles, and access.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-transparent text-slate-900 dark:text-white"
                />
              </form>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={16} className="text-slate-500 dark:text-slate-400" />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="All">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">Loading users...</td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  ) : (
                    usersList.map((usr) => (
                      <tr key={usr._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-slate-900 dark:text-white">{usr.name}</div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{usr.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            usr.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(usr.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
                <span>Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users</span>
                <div className="flex gap-1">
                  <button 
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-50 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-50 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
