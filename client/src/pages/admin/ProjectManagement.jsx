import React, { useEffect, useState } from "react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { getProjects, exportAuditLogs, describeAuditExport } from "../../api/adminService";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchProjects = async (page) => {
    try {
      setLoading(true);
      const res = await getProjects({ page, limit: pagination.limit, search: searchTerm, status: statusFilter });
      if (res.success) {
        setProjects(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchProjects(newPage);
    }
  };

  const exportAuditLog = async () => {
    try {
      setExporting(true);
      const result = await exportAuditLogs();
      toast[result.truncated ? "error" : "success"](describeAuditExport(result));
    } catch (error) {
      toast.error(error.message || "Audit log export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportProjectLog = async () => {
    try {
      setExporting(true);
      const result = await exportAuditLogs({ category: "project" });
      toast[result.truncated ? "error" : "success"](describeAuditExport(result));
    } catch (error) {
      toast.error(error.message || "Audit log export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout
      title="Project Management"
      subtitle="Manage and view platform projects"
      onExport={exportAuditLog}
    >
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
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </form>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={exportProjectLog}
              disabled={exporting}
              title="Download project lifecycle history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} Project Log
            </button>
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
                  <tr key={project._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{project.title}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                      {project.owner?.name} ({project.owner?.email})
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{project.researchArea}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          project.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : project.status === "completed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
            <span>
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} projects
            </span>
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
    </AdminLayout>
  );
};

export default ProjectManagement;