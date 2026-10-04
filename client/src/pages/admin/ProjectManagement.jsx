import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, ShieldCheck, LogOut, Search, Filter, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../api/adminService';
import toast from 'react-hot-toast';

const ProjectManagement = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchProjects(1);
  }, [statusFilter]);

  const fetchProjects = async (page) => {
    try {
      setLoading(true);
      const res = await getProjects({ page, limit: pagination.limit, search: searchTerm, status: statusFilter });
      if (res.success) {
        setProjects(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchProjects(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
          <ShieldCheck size={24} className="text-primary-400" />
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">Management</div>
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white transition-colors">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white transition-colors">
              <Users size={18} /> Users
            </Link>
            <Link to="/admin/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-600/10 text-primary-400 font-medium">
              <FolderKanban size={18} /> Projects
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-medium">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary-400" />
            <span className="font-bold">AdminPanel</span>
          </div>
          <button onClick={logout} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <LogOut size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Project Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view platform projects.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-transparent text-slate-900 dark:text-white"
                />
              </form>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={16} className="text-slate-500 dark:text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="p-4">Title</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Research Area</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">Loading projects...</td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">No projects found.</td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project._id} className="hover:bg-slate-50 dark:hover:bg-slate-100 dark:bg-slate-800 dark:bg-slate-950/50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-slate-900 dark:text-white">{project.title}</div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{project.owner?.name} ({project.owner?.email})</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{project.researchArea}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            project.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : project.status === 'completed'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(project.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
                <span>Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} projects</span>
                <div className="flex gap-1">
                  <button 
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-50 text-slate-700 dark:text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-100 dark:bg-slate-800 dark:bg-slate-950"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-50 text-slate-700 dark:text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-100 dark:bg-slate-800 dark:bg-slate-950"
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

export default ProjectManagement;
