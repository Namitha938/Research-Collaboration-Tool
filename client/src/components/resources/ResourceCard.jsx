import React, { useState } from "react";
import { Database, Code, Link as LinkIcon, FileText, BookOpen, Trash2, Edit2, MoreVertical, ExternalLink } from "lucide-react";

export default function ResourceCard({ resource, isOwner, isCreator, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (resource.type) {
      case "dataset": return <Database size={18} className="text-blue-500" />;
      case "repository": return <Code size={18} className="text-slate-700 dark:text-slate-300" />;
      case "file": return <FileText size={18} className="text-rose-500" />;
      case "reference": return <BookOpen size={18} className="text-emerald-500" />;
      default: return <LinkIcon size={18} className="text-indigo-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (resource.type) {
      case "dataset": return "Dataset";
      case "repository": return "Repository";
      case "file": return "File";
      case "reference": return "Reference";
      default: return "Link";
    }
  };

  const handleOpen = () => {
    if (resource.type === "file") {
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return " • " + parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const canEditOrDelete = isOwner || isCreator;

  return (
    <div className="relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-950">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1" title={resource.name}>
              {resource.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {getTypeLabel()}
              {resource.type === "file" && formatFileSize(resource.fileSize)}
            </p>
          </div>
        </div>

        <div className="relative">
          {canEditOrDelete && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-600 dark:text-slate-400"
            >
              <MoreVertical size={16} />
            </button>
          )}

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-1 shadow-lg">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(resource);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(resource._id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex-grow">
        {resource.description && (
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{resource.description}</p>
        )}
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {resource.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Added by <span className="font-medium text-slate-700 dark:text-slate-300">{resource.createdBy?.name || "Unknown"}</span> •{" "}
          {new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>

        <button
          onClick={handleOpen}
          className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
        >
          Open <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
