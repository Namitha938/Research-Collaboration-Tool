import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Settings,
  LayoutGrid,
  FolderKanban,
  Bell,
  LogOut,
  ChevronDown,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileDropdown({ showName = true, align = "right" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);

  const photo = user?.profilePicture || user?.avatar;

  // Reset imgError when photo URL changes
  useEffect(() => {
    setImgError(false);
  }, [photo]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  const alignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-full sm:rounded-xl p-1 sm:px-2.5 sm:py-1.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500/30 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        {photo && !imgError ? (
          <img
            src={photo}
            alt={user.name || "User profile"}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-500/20 shadow-sm"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 font-bold text-white text-sm shadow-sm ring-2 ring-primary-500/20">
            {initial}
          </div>
        )}

        {showName && (
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {user.name}
            </p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {user.role || "Researcher"}
            </p>
          </div>
        )}

        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 hidden sm:block ${
            isOpen ? "rotate-180 text-primary-600" : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-150 animate-in fade-in slide-in-from-top-2 ${alignClass}`}
          role="menu"
        >
          {/* User Details Header */}
          <div className="p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              {photo && !imgError ? (
                <img
                  src={photo}
                  alt={user.name || "User profile"}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-500/30 shadow-md shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 font-bold text-white text-lg shadow-md shrink-0 ring-2 ring-primary-500/30">
                  {initial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </h4>
                  {user.authProvider === "google" && (
                    <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-medium rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Google
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 capitalize border border-primary-200/60 dark:border-primary-800/50">
                    <CheckCircle2 size={11} className="text-primary-500" />
                    {user.role || "Researcher"}
                  </span>
                  {user.designation && (
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[130px]">
                      • {user.designation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.institution && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg truncate">
                <Building2 size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">{user.institution}</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-0.5">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <LayoutGrid size={16} className="text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <UserIcon size={16} className="text-slate-400" />
              <span>My Profile & Settings</span>
            </Link>

            <Link
              to="/projects"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <FolderKanban size={16} className="text-slate-400" />
              <span>My Projects</span>
            </Link>

            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <Bell size={16} className="text-slate-400" />
              <span>Notifications</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
