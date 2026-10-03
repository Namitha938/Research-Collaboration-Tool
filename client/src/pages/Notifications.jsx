import React, { useState, useEffect } from "react";
import { CheckCheck, Mail, UserPlus, FolderKanban, ShieldAlert, CheckCircle, FileText, Bell, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new Event("notificationsRead"));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const markAsRead = async (id, read) => {
    if (read) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      window.dispatchEvent(new Event("notificationsRead"));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "project_invitation":
        return <Mail size={18} />;
      case "invitation_accepted":
        return <UserPlus size={18} />;
      case "invitation_rejected":
        return <ShieldAlert size={18} />;
      case "member_added":
        return <Users size={18} />;
      case "role_changed":
        return <ShieldAlert size={18} />;
      case "member_removed":
        return <Trash2 size={18} />;
      case "task_assigned":
      case "task_reassigned":
        return <FileText size={18} />;
      case "task_completed":
        return <CheckCircle size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getLinkForNotification = (n) => {
    if (n.type === "project_invitation") {
      return "/projects"; // Or wherever they accept invites
    }
    if (n.project) {
      return `/projects/${n.project._id || n.project}`;
    }
    return "#";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Platform updates, task assignments, and collaborative activity alerts.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-colors"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Bell size={24} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">No notifications yet</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">When you receive notifications, they will show up here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
          {notifications.map((n) => (
            <Link
              key={n._id}
              to={getLinkForNotification(n)}
              onClick={() => markAsRead(n._id, n.read)}
              className={`flex items-start gap-4 p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 ${
                n.read ? "bg-white dark:bg-slate-900" : "bg-primary-50/30"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                {getIconForType(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{n.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={(e) => deleteNotification(n._id, e)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{n.message}</p>
              </div>
              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 mt-2" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
