import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const field =
  "w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500/20";

export default function NewTaskModal({ defaultProjectId = "", onClose, onCreated }) {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [selectedProjectData, setSelectedProjectData] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      const proj = projects.find((p) => p._id === projectId);
      if (proj) {
        setSelectedProjectData(proj);
      } else {
        api.get(`/projects/${projectId}`)
          .then((res) => setSelectedProjectData(res.data.project))
          .catch(() => {});
      }
    } else {
      setSelectedProjectData(null);
    }
  }, [projectId, projects]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
      if (!defaultProjectId && res.data.projects?.length > 0) {
        setProjectId(res.data.projects[0]._id);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        project: projectId,
        priority,
        status,
        assignedTo: assignedTo ? assignedTo : null,
      };

      if (dueDate) payload.dueDate = dueDate;

      const res = await api.post(`/projects/${projectId}/tasks`, payload);
      toast.success("Task created successfully!");
      if (onCreated) onCreated(res.data.task);
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error(err.response?.data?.message || "Unable to create task. Please check the task details.");
    } finally {
      setLoading(false);
    }
  };

  const projectMembers = selectedProjectData?.members || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className={field}
            >
              <option value="" disabled>Select a project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conduct literature review on transformer models"
              required
              className={field}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or research notes..."
              className={field}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={field}
              >
                <option value="">Unassigned</option>
                {projectMembers.map((member) => {
                  const uid = member.user?._id || member.user || member._id;
                  const name = member.user?.name || member.user?.email || member.name || member.email || "Unknown";
                  return (
                    <option key={member._id || uid} value={uid}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={field}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={field}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={field}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
