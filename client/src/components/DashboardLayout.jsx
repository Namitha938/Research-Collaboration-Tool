import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  Atom, LayoutGrid, FolderKanban, SquareCheckBig, FileText, Database,
  BookOpen, Users, MessageSquare, Bell, Settings, LogOut, Search, Menu, Loader2, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
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

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ projects: [], tasks: [] });
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSearchResults({
            projects: res.data.projects || [],
            tasks: res.data.tasks || []
          });
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    <aside className="flex h-full w-[266px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex h-[75px] items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500 text-white">
          <Atom size={20} />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">ResearchHub</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400">MAIN MENU</p>
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 hover:text-slate-900 dark:text-white dark:hover:text-white"
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

      <div className="border-t border-slate-100 dark:border-slate-800 p-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
        >
          {(user?.profilePicture || user?.avatar) ? (
            <img
              src={user?.profilePicture || user?.avatar}
              alt={user?.name || "User"}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500/20 shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 font-bold text-white text-sm shrink-0">
              {initial(user?.name).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {user?.name}
            </p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {user?.role || "Researcher"}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[266px]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[266px]">
        <header className="sticky top-0 z-20 flex h-[75px] items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 px-4 sm:px-8 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 dark:text-slate-400 dark:text-slate-300" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowDropdown(true);
                }}
                placeholder="Search projects, tasks..."
                className="w-72 rounded-lg bg-slate-50 dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X size={14} />
                </button>
              )}

              {/* Search Dropdown */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                  <div className="absolute left-0 top-full mt-2 w-[400px] max-h-[80vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-2">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-primary-500" size={24} />
                      </div>
                    ) : (
                      <>
                        {searchResults.projects.length === 0 && searchResults.tasks.length === 0 ? (
                          <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
                            No results found for "{searchQuery}"
                          </div>
                        ) : (
                          <>
                            {searchResults.projects.length > 0 && (
                              <div className="mb-2">
                                <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</h3>
                                {searchResults.projects.map((p) => (
                                  <div
                                    key={p._id}
                                    onClick={() => {
                                      navigate(`/projects/${p._id}`);
                                      setShowDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                      <FolderKanban size={14} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.title}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-64">{p.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {searchResults.tasks.length > 0 && (
                              <div>
                                <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Tasks</h3>
                                {searchResults.tasks.map((t) => (
                                  <div
                                    key={t._id}
                                    onClick={() => {
                                      navigate(`/projects/${t.project?._id || t.project}`);
                                      setShowDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                      <SquareCheckBig size={14} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900 dark:text-white">{t.title}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">In project {t.project?.title || "..."}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <NavLink to="/notifications" className="relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 dark:hover:text-white transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3 sm:pl-5">
              <ProfileDropdown showName={true} align="right" />
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
