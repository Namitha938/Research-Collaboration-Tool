import React, { useEffect, useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  RefreshCw,
  ShieldAlert,
  LogIn,
  User,
  FolderKanban,
  Settings2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { getAuditLogs, exportAuditLogs, describeAuditExport } from "../../api/adminService";

const CATEGORIES = ["All", "auth", "profile", "project", "admin", "security"];

const CATEGORY_STYLES = {
  auth: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  profile: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  project: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  security: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const CATEGORY_ICONS = {
  auth: LogIn,
  profile: User,
  project: FolderKanban,
  admin: Settings2,
  security: ShieldAlert,
};

const ACTION_LABELS = {
  "user.registered": "User registered",
  "user.registration_failed": "Registration blocked",
  "user.login": "Sign in",
  "user.login_failed": "Failed sign in",
  "user.logout": "Sign out",
  "user.google_login": "Google sign in",
  "user.google_registered": "Google sign up",
  "user.profile_updated": "Profile updated",
  "user.avatar_updated": "Profile picture uploaded",
  "user.avatar_removed": "Profile picture removed",
  "user.password_changed": "Password changed",
  "user.password_reset_requested": "Password reset requested",
  "user.password_reset_completed": "Password reset completed",
  "project.created": "Project created",
  "project.updated": "Project updated",
  "project.status_changed": "Project status changed",
  "project.archived": "Project archived",
  "project.deleted": "Project deleted",
  "project.member_removed": "Member removed",
  "project.member_role_changed": "Member role changed",
  "admin.audit_log_exported": "Audit log exported",
};

const humanizeAction = (action) =>
  ACTION_LABELS[action] || action.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All",
    from: "",
    to: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });

  const queryParams = {
    page: pagination.page,
    limit: pagination.limit,
    search: appliedFilters.search || undefined,
    category: appliedFilters.category !== "All" ? appliedFilters.category : undefined,
    status: appliedFilters.status !== "All" ? appliedFilters.status : undefined,
    from: appliedFilters.from || undefined,
    to: appliedFilters.to || undefined,
  };

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAuditLogs({ ...queryParams, page });
      if (res.success) {
        setLogs(res.data);
        setCounts(res.counts || {});
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (e) => {
    e?.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const cleared = { search: "", category: "All", status: "All", from: "", to: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportAuditLogs(appliedFilters);
      toast[result.truncated ? "error" : "success"](describeAuditExport(result));
    } catch (error) {
      toast.error(error.message || "Audit log export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const activeFilterCount = [
    appliedFilters.search,
    appliedFilters.category !== "All" ? appliedFilters.category : "",
    appliedFilters.status !== "All" ? appliedFilters.status : "",
    appliedFilters.from,
    appliedFilters.to,
  ].filter(Boolean).length;

  return (
    <AdminLayout
      title="Audit Log"
      subtitle="Every authentication, profile and project action recorded on the platform"
      onExport={handleExport}
      headerActions={
        <button
          onClick={handleExport}
          disabled={exporting}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {exporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
          {exporting ? "Exporting..." : "Download CSV"}
        </button>
      }
    >
      {/* Category summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.filter((c) => c !== "All").map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const isActive = appliedFilters.category === category;
          return (
            <button
              key={category}
              onClick={() => {
                const next = isActive ? "All" : category;
                setFilters((prev) => ({ ...prev, category: next }));
                setAppliedFilters((prev) => ({ ...prev, category: next }));
              }}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[category]}`}>
                  {category}
                </span>
                <Icon size={15} className="text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {counts[category] || 0}
              </p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={applyFilters} className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search actor, action, description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-slate-500 dark:text-slate-400" />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Outcomes</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>

            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange("from", e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange("to", e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />

            <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors">
              Apply
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={14} /> Clear ({activeFilterCount})
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} CSV
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4">When</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Category</th>
                <th className="p-4">Details</th>
                <th className="p-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <ScrollText className="mx-auto text-slate-300 dark:text-slate-700" size={32} />
                    <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                      No audit entries match these filters.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors align-top">
                    <td className="p-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(log.createdAt).toLocaleDateString()}
                      <span className="block text-slate-400 dark:text-slate-500">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">{log.actorName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{log.actorEmail || "-"}</p>
                      {log.actorRole && (
                        <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {log.actorRole}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white whitespace-nowrap">{humanizeAction(log.action)}</p>
                      <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{log.action}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${CATEGORY_STYLES[log.category] || CATEGORY_STYLES.admin}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-[320px]">
                      {log.description || "-"}
                      {log.ipAddress && (
                        <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                          {log.ipAddress}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        log.status === "failure" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${log.status === "failure" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {log.status === "failure" ? "Failed" : "Success"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pagination.total > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50">
            <span>
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </span>
            <div className="flex gap-1">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() => {
                  const next = pagination.page - 1;
                  setPagination((prev) => ({ ...prev, page: next }));
                  fetchLogs(next);
                }}
                className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-50 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => {
                  const next = pagination.page + 1;
                  setPagination((prev) => ({ ...prev, page: next }));
                  fetchLogs(next);
                }}
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

export default AuditLog;