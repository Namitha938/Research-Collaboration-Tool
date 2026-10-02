import React, { useEffect, useState } from "react";
import {
  Plus,
  Kanban,
  List,
  Calendar,
  User,
  Trash2,
  FolderKanban,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import NewTaskModal from "../components/NewTaskModal";

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const COLUMNS = [
  { id: "todo", title: "To Do", tone: "bg-slate-100 text-slate-700 border-slate-300" },
  { id: "in_progress", title: "In Progress", tone: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "completed", title: "Completed", tone: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

export default function Tasks({ projectId }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  const [viewMode, setViewMode] = useState("kanban");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const currentProject = projects.find((p) => p._id === selectedProject);
  let userRole = null;
  if (currentProject) {
    const ownerId = currentProject.owner?._id || currentProject.owner;
    if (ownerId === (user?.id || user?._id)) {
      userRole = "owner";
    } else {
      const member = currentProject.members?.find((m) => {
        const uid = m.user?._id || m.user;
        return uid === (user?.id || user?._id);
      });
      userRole = member?.role || null;
    }
  }
  const isOwner = userRole === "owner";

  const fetchTasks = async (projId) => {
    if (!projId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = `/projects/${projId}/tasks`;
      const res = await api.get(url);
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => {
        setProjects(res.data.projects || []);
      })
      .catch(() => {});

    fetchTasks(selectedProject);
  }, [selectedProject]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      toast.success("Task status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAssignTask = async (taskId, newAssigneeId) => {
    try {
      const payload = { assignedTo: newAssigneeId || null };
      const res = await api.patch(`/tasks/${taskId}/assign`, payload);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      toast.success("Task assignee updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update assignee");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] animate-fade-in space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
        {!projectId && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track, assign, and manage collaborative research deliverables.
            </p>
          </div>
        )}

        <div className={`flex flex-wrap items-center gap-3 ${projectId ? "w-full justify-between" : ""}`}>
          {!projectId && (
            <div className="relative">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-primary-500"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "kanban"
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban size={15} /> Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "list"
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List size={15} /> List
            </button>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              <Plus size={16} /> New Task
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <FolderKanban size={28} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">
            {selectedProject ? "No tasks found" : "Select a project"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {selectedProject
              ? "There are no tasks associated with this project yet."
              : "Select a project to view its tasks."}
          </p>
          {isOwner && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              <Plus size={16} /> {selectedProject ? "Add First Task" : "New Task"}
            </button>
          )}
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{col.title}</span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {columnTasks.map((t) => {
                    const dueStr = t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : null;
                    return (
                      <div
                        key={t._id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.medium
                            }`}
                          >
                            {t.priority}
                          </span>
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteTask(t._id)}
                              title="Delete task"
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <h4 className="mt-2.5 font-medium text-slate-900">{t.title}</h4>
                        {t.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {t.description}
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-1.5 text-xs text-primary-600 font-medium">
                          <FolderKanban size={13} />
                          <span className="truncate">{t.project?.title || "Project"}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <User size={13} />
                            {isOwner ? (
                              <select
                                value={t.assignedTo?._id || ""}
                                onChange={(e) => handleAssignTask(t._id, e.target.value)}
                                className="max-w-[100px] truncate rounded border border-slate-200 bg-white px-1 py-0.5 text-xs text-slate-700 outline-none"
                              >
                                <option value="">Unassigned</option>
                                {(() => {
                                  const tProj = projects.find((p) => p._id === (t.project?._id || t.project));
                                  return (tProj?.members || []).map((m) => {
                                    const uid = m.user?._id || m.user;
                                    const name = m.user?.name || m.user?.email || "Unknown";
                                    return (
                                      <option key={uid} value={uid}>
                                        {name}
                                      </option>
                                    );
                                  });
                                })()}
                              </select>
                            ) : (
                              <span>{t.assignedTo?.name || "Unassigned"}</span>
                            )}
                          </div>
                          {dueStr && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Calendar size={13} />
                              <span>{dueStr}</span>
                            </div>
                          )}
                        </div>

                        {(() => {
                          const userId = user?.id || user?._id;
                          const isAssignedToMe = t.assignedTo?._id === userId || t.assignedTo === userId;
                          const canChangeStatus = isAssignedToMe;
                          
                          if (!canChangeStatus) return null;
                          
                          return (
                            <div className="mt-3 flex gap-1.5 pt-2">
                              {t.status === "todo" && (
                                <button
                                  onClick={() => handleStatusChange(t._id, "in_progress")}
                                  className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100"
                                >
                                  ▶ Start Task
                                </button>
                              )}
                              {t.status === "in_progress" && (
                                <button
                                  onClick={() => handleStatusChange(t._id, "completed")}
                                  className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                                >
                                  ✓ Mark Completed
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Task</th>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Assigned To</th>
                <th className="px-6 py-3.5">Due Date</th>
                {isOwner && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div>{t.title}</div>
                    {t.description && (
                      <div className="line-clamp-1 text-xs text-slate-400">
                        {t.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-primary-600">
                    {t.project?.title || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const userId = user?.id || user?._id;
                      const isAssignedToMe = t.assignedTo?._id === userId || t.assignedTo === userId;
                      const canChangeStatus = isAssignedToMe;
                      
                      if (!canChangeStatus) {
                        return (
                          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                            {t.status.replace("_", " ")}
                          </span>
                        );
                      }
                      
                      return (
                        <div className="flex items-center gap-2">
                          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                            {t.status.replace("_", " ")}
                          </span>
                          {t.status === "todo" && (
                            <button
                              onClick={() => handleStatusChange(t._id, "in_progress")}
                              className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100"
                            >
                              ▶ Start
                            </button>
                          )}
                          {t.status === "in_progress" && (
                            <button
                              onClick={() => handleStatusChange(t._id, "completed")}
                              className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              ✓ Finish
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium uppercase ${
                        PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.medium
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {isOwner ? (
                      <select
                        value={t.assignedTo?._id || ""}
                        onChange={(e) => handleAssignTask(t._id, e.target.value)}
                        className="w-full max-w-[150px] rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {(() => {
                          const tProj = projects.find((p) => p._id === (t.project?._id || t.project));
                          return (tProj?.members || []).map((m) => {
                            const uid = m.user?._id || m.user;
                            const name = m.user?.name || m.user?.email || "Unknown";
                            return (
                              <option key={uid} value={uid}>
                                {name}
                              </option>
                            );
                          });
                        })()}
                      </select>
                    ) : (
                      <span>{t.assignedTo?.name || "Unassigned"}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteTask(t._id)}
                        className="text-slate-400 hover:text-red-600"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {showModal && (
        <NewTaskModal
          defaultProjectId={selectedProject}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}

