import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  UserPlus,
  Plus,
  Shield,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import NewTaskModal from "../components/NewTaskModal";
import UploadDocumentModal from "../components/UploadDocumentModal";
import AddResourceModal from "../components/resources/AddResourceModal";
import EditResourceModal from "../components/resources/EditResourceModal";
import ResourceCard from "../components/resources/ResourceCard";
import { FileText, Download } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceFilter, setResourceFilter] = useState("all");
  const [resourceSearch, setResourceSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes, docsRes, resRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`), // Corrected route based on standard setup
        api.get(`/projects/${id}/documents`).catch(() => ({ data: { documents: [] } })),
        api.get(`/projects/${id}/resources`).catch(() => ({ data: { resources: [] } }))
      ]);
      setProject(projRes?.data?.project);
      setTasks(tasksRes?.data?.tasks || []);
      setDocuments(docsRes?.data?.documents || []);
      setResources(resRes?.data?.resources || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load project");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const isOwner =
    project?.owner?._id?.toString() === user?.id?.toString() ||
    project?.owner?._id?.toString() === user?._id?.toString();

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await api.post(`/projects/${id}/members`, {
        email: inviteEmail.trim(),
      });
      toast.success(res.data.message || "Member added successfully");
      setProject(res.data.project);
      setInviteEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      const res = await api.delete(`/projects/${id}/members/${memberId}`);
      toast.success(res.data.message || "Member removed");
      setProject(res.data.project);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this entire project? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      toast.success("Task updated");
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task removed");
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${docId}`);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      toast.success("Document removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/resources/${resourceId}`);
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
      toast.success("Resource removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 dark:text-slate-400">Loading project workspace...</div>;
  }

  if (!project) return null;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="mx-auto max-w-[1300px] animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        {isOwner && (
          <button
            onClick={handleDeleteProject}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete Project
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{project.title}</h1>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                {project.status}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary-600">
              <Tag size={15} /> {project.researchArea}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>Overall Research Progress</span>
            <span className="font-bold text-primary-600">{project.progress || 0}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-3.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Owner</span>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{project.owner?.name}</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-3.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Collaborators</span>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{project.members?.length || 1} researchers</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-3.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Tasks</span>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {completedTasks}/{tasks.length} completed
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-3.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Deadline</span>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Flexible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "overview"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "tasks"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
            }`}
          >
            Tasks
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
              {tasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "team"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
            }`}
          >
            Team Members
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
              {project.members?.length || 1}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "documents"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
            }`}
          >
            Documents
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
              {documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "resources"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
            }`}
          >
            Resources
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
              {resources.length}
            </span>
          </button>
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {project.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Tasks</h2>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  View All Tasks
                </button>
              </div>
              {tasks.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No tasks created for this project yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tasks.slice(0, 4).map((t) => (
                    <div key={t._id} className="flex items-center justify-between py-3 text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-100">{t.title}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                          t.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Invite Collaborator</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Add an existing researcher to collaborate on this workspace.
              </p>
              {isOwner ? (
                <form onSubmit={handleAddMember} className="mt-4 space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="researcher@university.edu"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:bg-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60"
                  >
                    <UserPlus size={16} /> {inviting ? "Adding..." : "Add to Project"}
                  </button>
                </form>
              ) : (
                <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-500 dark:text-slate-400">
                  Only the project owner can invite new members.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Tasks</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700"
            >
              <Plus size={15} /> Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No tasks in this project yet.</p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Create First Task
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Task</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Assigned To</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tasks.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950/70">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div>{t.title}</div>
                        {t.description && (
                          <div className="line-clamp-1 text-xs text-slate-400">
                            {t.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleTaskStatusChange(t._id, e.target.value)}
                          className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-medium capitalize text-slate-700 dark:text-slate-300 outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded border px-2 py-0.5 text-xs font-medium uppercase bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {t.assignedTo?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteTask(t._id)}
                          className="text-slate-400 hover:text-red-600"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Members</h2>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                    {project.owner?.name?.charAt(0) || "O"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.owner?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{project.owner?.email}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                  <Shield size={12} /> Owner
                </span>
              </div>

              {project.members
                ?.filter((m) => m._id?.toString() !== project.owner?._id?.toString())
                .map((m) => (
                  <div key={m._id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 dark:text-slate-400">
                        {m.name?.charAt(0) || "M"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Collaborator
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => handleRemoveMember(m._id)}
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Documents</h2>
            <button
              onClick={() => setShowDocumentModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700"
            >
              <Plus size={15} /> Upload Document
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No documents in this project yet.</p>
              <button
                onClick={() => setShowDocumentModal(true)}
                className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Document</th>
                    <th className="px-6 py-3.5">Uploaded By</th>
                    <th className="px-6 py-3.5">Size</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {documents.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950/70">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-primary-500" />
                          <div>
                            <div>{d.name}</div>
                            {d.description && (
                              <div className="line-clamp-1 text-xs font-normal text-slate-400">
                                {d.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {d.uploadedBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(d.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-primary-600"
                          title="Download/View"
                        >
                          <Download size={16} />
                        </a>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteDocument(d._id)}
                            className="text-slate-400 hover:text-red-600"
                            title="Delete Document"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resources</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage datasets, repositories, links and other research materials.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
              <select 
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="link">Links</option>
                <option value="dataset">Datasets</option>
                <option value="repository">Repositories</option>
                <option value="file">Files</option>
                <option value="reference">References</option>
              </select>
              {(isOwner || project.members?.some((m) => {
                  const mUserId = m.user?._id || m.user;
                  const currentUserId = user?.id || user?._id;
                  return mUserId && currentUserId && mUserId.toString() === currentUserId.toString() && m.role === 'researcher';
              })) && (
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700 whitespace-nowrap"
                >
                  <Plus size={15} /> Add Resource
                </button>
              )}
            </div>
          </div>

          {resources.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-semibold">No resources yet.</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add datasets, repositories, links and other research materials to help your team work together.</p>
              {(isOwner || project.members?.some((m) => {
                  const mUserId = m.user?._id || m.user;
                  const currentUserId = user?.id || user?._id;
                  return mUserId && currentUserId && mUserId.toString() === currentUserId.toString() && m.role === 'researcher';
              })) && (
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  Add Resource
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources
                .filter(r => resourceFilter === "all" || r.type === resourceFilter)
                .filter(r => !resourceSearch || 
                    r.name.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                    (r.description && r.description.toLowerCase().includes(resourceSearch.toLowerCase())) ||
                    (r.tags && r.tags.some(t => t.toLowerCase().includes(resourceSearch.toLowerCase())))
                )
                .map((r) => (
                <ResourceCard 
                  key={r._id} 
                  resource={r} 
                  isOwner={isOwner}
                  isCreator={r.createdBy && (r.createdBy._id || r.createdBy).toString() === (user?.id || user?._id)?.toString()}
                  onDelete={handleDeleteResource}
                  onEdit={(resource) => setEditingResource(resource)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showTaskModal && (
        <NewTaskModal
          defaultProjectId={id}
          onClose={() => setShowTaskModal(false)}
          onCreated={(newTask) => {
            setTasks((prev) => [newTask, ...prev]);
            api.get(`/projects/${id}`).then((res) => setProject(res.data.project));
          }}
        />
      )}
      {showDocumentModal && (
        <UploadDocumentModal
          defaultProjectId={id}
          onClose={() => setShowDocumentModal(false)}
          onUploaded={(newDoc) => {
            setDocuments((prev) => [newDoc, ...prev]);
          }}
        />
      )}
      {showResourceModal && (
        <AddResourceModal
          defaultProjectId={id}
          onClose={() => setShowResourceModal(false)}
          onAdded={(newResource) => {
            setResources((prev) => [newResource, ...prev]);
          }}
        />
      )}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onUpdated={(updatedResource) => {
            setResources((prev) =>
              prev.map((r) => (r._id === updatedResource._id ? updatedResource : r))
            );
          }}
        />
      )}
    </div>
  );
}

