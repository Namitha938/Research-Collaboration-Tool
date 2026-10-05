import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ScrollText,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Download,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminNotificationDropdown from "./AdminNotificationDropdown";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "User Directory", icon: Users },
  { to: "/admin/projects", label: "Research Projects", icon: FolderKanban },
  { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
];

const initial = (name = "") => name.trim().charAt(0).toUpperCase() || "A";

const navLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
  }`;

function AdminAvatar({ user, size = "h-10 w-10" }) {
  const photo = user?.profilePicture || user?.avatar;

  if (photo) {
    return (
      <img
        src={photo}
        alt={user?.name || "Admin"}
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-primary-500/20`}
      />
    );
  }

  return (
    <div
      className={`${size} shrink-0 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 font-semibold text-primary-600 dark:text-primary-400`}
    >
      {initial(user?.name)}
    </div>
  );
}

export default function AdminLayout({
  title,
  subtitle,
  headerActions = null,
  onExport,
  children,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const sidebar = (
    <aside className="flex h-full w-[266px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 shrink-0">
      <div className="flex h-[75px] items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500 text-white shadow-sm">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              AdminPanel
            </span>
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-primary-500">
              v2.4
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <div className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500">
          MAIN NAVIGATION
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <NavLink to="/dashboard" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={18} /> User Dashboard
          </NavLink>
        </div>

        <div className="mt-6">
          <div className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500">
            SECURITY &amp; COMPLIANCE
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={onExport}
              disabled={!onExport}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-60 disabled:hover:bg-transparent"
            >
              <span className="flex items-center gap-3">
                <Download size={18} className="text-emerald-500" /> Export Audit CSV
              </span>
            </button>
            <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
              <Settings size={18} /> Platform Config
            </Link>
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-100 dark:border-slate-800 p-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <AdminAvatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name || "System Admin"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.email || "admin@researchhub.edu"}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col md:flex-row font-sans">
      <div className="hidden md:flex">{sidebar}</div>

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
          <div className="p-6 space-y-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 block py-3 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            {onExport && (
              <button
                onClick={() => {
                  onExport();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Download size={18} /> Export Audit CSV
              </button>
            )}
            <button onClick={handleLogout} className="w-full text-left py-3 px-4 rounded-xl text-rose-500 hover:bg-rose-900/30">
              Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-20 flex h-[75px] items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Open admin menu">
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
              {subtitle && (
                <p className="hidden sm:block truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {headerActions}
            <div className="flex items-center gap-3 border-slate-200 dark:border-slate-800 md:border-l md:pl-5">
              <AdminNotificationDropdown />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-[1300px] mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}