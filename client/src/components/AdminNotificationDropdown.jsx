import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, Mail, FolderKanban, CheckCircle, ShieldAlert } from "lucide-react";
import api from "../api/axios";

export default function AdminNotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      if (res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch admin unread count");
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read");
    }
  };

  const markAsRead = async (id, read) => {
    if (read) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "admin_new_user":
        return <Mail size={16} />;
      case "admin_new_project":
        return <FolderKanban size={16} />;
      case "admin_project_completed":
        return <CheckCircle size={16} />;
      default:
        return <ShieldAlert size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {notifications.some(n => !n.read) && (
              <button 
                onClick={markAllRead}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => markAsRead(n._id, n.read)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    n.read ? "opacity-75" : "bg-primary-50/30 dark:bg-primary-900/10"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mt-0.5">
                    {getIconForType(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{n.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-2">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-primary-500 mt-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
