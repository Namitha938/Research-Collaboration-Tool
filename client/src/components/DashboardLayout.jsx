import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Atom, LayoutGrid, FolderKanban, SquareCheckBig, FileText, Database,
  BookOpen, Users, MessageSquare, Bell, Settings, LogOut, Search, Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: SquareCheckBig },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/resources", label: "Resources", icon: Database },
  { to: "/papers", label: "Research Papers", icon: BookOpen },
  { to: "/team", label: "Team", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const initial = (name = "") => name.trim().charAt(0).toLowerCase() || "?";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch unread notifications count");
      }
    };

    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // Poll every 30s
      
      const handleForceFetch = () => fetchUnread();
      window.addEventListener("notificationsRead", handleForceFetch);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener("notificationsRead", handleForceFetch);
      };
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebar = (
    <aside className="flex h-full w-[266px] flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[75px] items-center gap-2.5 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Atom size={20} />
        </div>
        <span className="text-xl font-bold text-slate-900">ResearchHub</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400">MAIN MENU</p>
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
            {initial(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[266px]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[266px]">
        <header className="sticky top-0 z-20 flex h-[75px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search projects, tasks..."
                className="w-72 rounded-lg bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <NavLink to="/notifications" className="relative text-slate-500 hover:text-slate-800">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-slate-900">{user?.name}</p>
                <p className="text-xs capitalize text-slate-500">{user?.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                {initial(user?.name)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
