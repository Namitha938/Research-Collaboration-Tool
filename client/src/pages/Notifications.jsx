import React, { useState } from "react";
import { CheckCheck, FolderKanban, SquareCheckBig, FileText, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Workspace Created",
      message: "You have active access to your research projects and workspaces.",
      time: "Just now",
      icon: FolderKanban,
      read: false,
    },
    {
      id: 2,
      title: "Task Assigned",
      message: "Check your assigned research milestones in the Tasks dashboard.",
      time: "1 hour ago",
      icon: SquareCheckBig,
      read: false,
    },
    {
      id: 3,
      title: "Document Repository Active",
      message: "Research papers and datasets can now be uploaded and managed.",
      time: "Yesterday",
      icon: FileText,
      read: true,
    },
    {
      id: 4,
      title: "Real-time Collaboration",
      message: "Socket.IO communication channels are live across all projects.",
      time: "2 days ago",
      icon: MessageSquare,
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Platform updates, task assignments, and collaborative activity alerts.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <CheckCheck size={15} /> Mark all as read
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm overflow-hidden">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-5 transition-colors ${
                n.read ? "bg-white" : "bg-primary-50/30"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">{n.title}</h3>
                  <span className="text-xs text-slate-400">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              </div>
              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

