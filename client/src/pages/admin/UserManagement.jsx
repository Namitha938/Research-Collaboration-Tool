import React, { useEffect, useState } from "react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { getUsers, exportAuditLogs, describeAuditExport } from "../../api/adminService";

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const res = await getUsers({ page, limit: pagination.limit, search: searchTerm, role: roleFilter });
      if (res.success) {
        setUsersList(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
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

  const exportAuthLog = async () => {
    try {
      setExporting(true);
      const result = await exportAuditLogs({ category: "auth" });
      toast[result.truncated ? "error" : "success"](describeAuditExport(result));
    } catch (error) {
      toast.error(error.message || "Audit log export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const initial = (name = "") => name.trim().charAt(0).toUpperCase() || "U";

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage platform users, roles, and access"
      onExport={exportAuditLog}
    >
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
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </form>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-500 dark:text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="researcher">Researcher</option>
            </select>
            <button
              onClick={exportAuthLog}
              disabled={exporting}
              title="Download sign-in and sign-out history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} Sign-in Log
            </button>
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
                      <div className="flex items-center gap-3">
                        {usr.avatar || usr.profilePicture ? (
                          <img
                            src={usr.avatar || usr.profilePicture}
                            alt={usr.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/20 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm shrink-0">
                            {initial(usr.name)}
                          </div>
                        )}
                        <div className="font-medium text-slate-900 dark:text-white truncate">{usr.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{usr.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          usr.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
            <span>
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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

export default UserManagement;