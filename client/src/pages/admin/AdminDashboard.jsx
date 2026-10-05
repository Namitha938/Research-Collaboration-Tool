import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  LayoutGrid,
  Activity,
  ShieldCheck,
  FolderKanban,
  TrendingUp,
  CheckCircle2,
  Download,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { getDashboardStats, exportAuditLogs, describeAuditExport } from "../../api/adminService";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStatsData(res);
      } else {
        toast.error(res.message || "Failed to load dashboard statistics");
      }
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = statsData
    ? [
        {
          label: "Total Users",
          value: statsData.stats.users.total,
          trend: `${statsData.stats.users.researchers} Researchers`,
          icon: Users,
        },
        {
          label: "Total Projects",
          value: statsData.stats.projects.total,
          trend: "Across all fields",
          icon: FolderKanban,
        },
        {
          label: "Active Projects",
          value: statsData.stats.projects.active,
          trend: "Currently progressing",
          icon: Activity,
        },
        {
          label: "Completed Projects",
          value: statsData.stats.projects.completed,
          trend: "Successfully finished",
          icon: CheckCircle2,
        },
      ]
    : [];

  const recentRegistrations = statsData?.recentUsers || [];
  const recentProjects = statsData?.recentProjects || [];

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

  const initial = (name = "") => name.trim().charAt(0).toUpperCase() || "U";

  return (
    <AdminLayout
      title="System Operations Center"
      subtitle="Live platform health across users, projects and governance"
      onExport={exportAuditLog}
      headerActions={
        <button
          onClick={exportAuditLog}
          disabled={exporting}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {exporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
          {exporting ? "Exporting..." : "Export Audit Log"}
        </button>
      }
    >
      {/* Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-primary-100/50 dark:bg-primary-900/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Platform Operational
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to Executive Admin Panel
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Manage enterprise researchers, verify institutional credentials, and oversee live
              collaborative research workflows across global teams.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/users"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              Manage Users &amp; Roles
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
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <TrendingUp size={14} className="text-primary-500" /> {stat.trend}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-primary-500" /> New Researchers
            </h3>
            <Link to="/admin/users" className="text-sm font-medium text-primary-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="text-center py-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Loading recent users...</span>
              </div>
            ) : recentRegistrations.length === 0 ? (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">No users found.</div>
            ) : (
              recentRegistrations.map((userItem) => (
                <div key={userItem._id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                  {userItem.avatar || userItem.profilePicture ? (
                    <img
                      src={userItem.avatar || userItem.profilePicture}
                      alt={userItem.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/20 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm shrink-0">
                      {initial(userItem.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userItem.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userItem.email}</p>
                  </div>
                  <span
                    className={`text-xs font-medium capitalize ${
                      userItem.role === "admin"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {userItem.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban size={18} className="text-purple-500" /> Latest Projects
            </h3>
            <Link to="/admin/projects" className="text-sm font-medium text-primary-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="text-center py-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Loading projects...</span>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">No projects found.</div>
            ) : (
              recentProjects.map((project) => (
                <div key={project._id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <LayoutGrid size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{project.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {project.owner?.name} &middot; {project.researchArea}
                    </p>
                  </div>
                  <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400">
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Compliance audit trail</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign-ins, profile changes, project lifecycle events and admin exports are recorded
              with actor, IP and timestamp.
            </p>
          </div>
        </div>
        <Link
          to="/admin/audit-log"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          View Audit Log
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;