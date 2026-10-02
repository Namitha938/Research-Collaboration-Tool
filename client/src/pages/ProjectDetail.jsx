import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  UserPlus,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowLeft,
  FileText,
  Bookmark,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import NewTaskModal from "../components/NewTaskModal";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [references, setReferences] = useState([]);

  const [activeTab, setActiveTab] = useState("overview"); // overview, tasks, team, discussions, milestones, citations
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // New Comment state
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // New Milestone state
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

  // New Citation state
  const [refTitle, setRefTitle] = useState("");
  const [refAuthors, setRefAuthors] = useState("");
  const [refYear, setRefYear] = useState("");
  const [refVenue, setRefVenue] = useState("");
  const [refDoi, setRefDoi] = useState("");
  const [submittingRef, setSubmittingRef] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes, commentsRes, milesRes, refsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get(`/comments?project=${id}`).catch(() => ({ data: { comments: [] } })),
        api.get(`/milestones?project=${id}`).catch(() => ({ data: { milestones: [] } })),
        api.get(`/references?project=${id}`).catch(() => ({ data: { references: [] } })),
      ]);

      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks || []);
      setComments(commentsRes.data.comments || []);
      setMilestones(milesRes.data.milestones || []);
      setReferences(refsRes.data.references || []);
    } catch (err) {
      console.error("Error fetching project:", err);
      toast.error("Could not load project details");
    } finally {
      setLoading(false);
    }
  };

  // Member invitation
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await api.post(`/projects/${id}/members`, {
        email: inviteEmail.trim(),
      });
      toast.success(res.data.message || "Collaborator added!");
      setProject(res.data.project);
      setInviteEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setInviting(false);
    }
  };

  // Remove member
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

  // Task status update
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data.task : t)));
      toast.success("Task status updated");
      const updatedProj = await api.get(`/projects/${id}`);
      setProject(updatedProj.data.project);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  // Task delete
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
      const updatedProj = await api.get(`/projects/${id}`);
      setProject(updatedProj.data.project);
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Add Comment / Discussion
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post("/comments", {
        project: id,
        content: newComment.trim(),
      });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
      toast.success("Comment posted");
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Add Milestone
  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;
    setSubmittingMilestone(true);
    try {
      const res = await api.post("/milestones", {
        project: id,
        title: milestoneTitle.trim(),
        dueDate: milestoneDate || null,
      });
      setMilestones((prev) => [...prev, res.data.milestone]);
      setMilestoneTitle("");
      setMilestoneDate("");
      toast.success("Milestone added");
    } catch (err) {
      toast.error("Failed to add milestone");
    } finally {
      setSubmittingMilestone(false);
    }
  };

  // Toggle Milestone status
  const handleToggleMilestone = async (mId, currentStatus) => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const res = await api.put(`/milestones/${mId}`, { status: nextStatus });
      setMilestones((prev) => prev.map((m) => (m._id === mId ? res.data.milestone : m)));
      toast.success(`Milestone marked as ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update milestone");
    }
  };

  // Add Citation / Reference
  const handleAddReference = async (e) => {
    e.preventDefault();
    if (!refTitle.trim()) return;
    setSubmittingRef(true);
    try {
      const res = await api.post("/references", {
        project: id,
        title: refTitle.trim(),
        authors: refAuthors ? refAuthors.split(",").map((a) => a.trim()) : [],
        year: refYear ? parseInt(refYear) : null,
        venue: refVenue.trim(),
        doi: refDoi.trim(),
      });
      setReferences((prev) => [res.data.reference, ...prev]);
      setRefTitle("");
      setRefAuthors("");
      setRefYear("");
      setRefVenue("");
      setRefDoi("");
      toast.success("Citation added");
    } catch (err) {
      toast.error("Failed to add citation");
    } finally {
      setSubmittingRef(false);
    }
  };

  const copyCitation = (ref) => {
    const authorsText = ref.authors?.length > 0 ? ref.authors.join(", ") : "Unknown Author";
    const text = `${authorsText} (${ref.year || "n.d."}). "${ref.title}". ${ref.venue || ""}. ${
      ref.doi ? `DOI: ${ref.doi}` : ""
    }`;
    navigator.clipboard.writeText(text);
    toast.success("Citation copied to clipboard!");
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 font-medium">Loading research workspace...</div>;
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <Link to="/projects" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      {/* Back Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              {project.researchArea}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 capitalize">
              {project.status || "active"}
            </span>
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">{project.title}</h1>
          <p className="mt-1 text-xs text-slate-400">
            Lead: {project.owner?.name || project.owner?.email} · Created {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500">Progress</span>
          <p className="mt-1 text-xl font-bold text-slate-900">{project.progress || 0}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500">Tasks Completed</span>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {tasks.filter((t) => t.status === "completed").length} / {tasks.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500">Collaborators</span>
          <p className="mt-1 text-xl font-bold text-slate-900">{project.members?.length || 1}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500">Milestones</span>
          <p className="mt-1 text-xl font-bold text-slate-900">{milestones.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "tasks", label: "Tasks", count: tasks.length },
            { id: "discussions", label: "Discussions", count: comments.length },
            { id: "milestones", label: "Milestones", count: milestones.length },
            { id: "citations", label: "Citations & References", count: references.length },
            { id: "team", label: "Team Members", count: project.members?.length || 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Project Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Invite Researcher</h2>
              <form onSubmit={handleInvite} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full rounded-xl bg-primary-600 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition shadow-xs"
                >
                  {inviting ? "Sending..." : "Add Collaborator"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TASKS */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm text-slate-500">No tasks created yet.</p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Task</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Assigned To</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div>{t.title}</div>
                        {t.description && <div className="text-xs text-slate-400">{t.description}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleTaskStatusChange(t._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded px-2 py-0.5 text-xs font-medium uppercase bg-slate-100 text-slate-700">
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {t.assignedTo?.name || t.assignedTo?.email || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteTask(t._id)} className="text-slate-400 hover:text-red-600">
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

      {/* TAB: DISCUSSIONS */}
      {activeTab === "discussions" && (
        <div className="space-y-6">
          <form onSubmit={handleAddComment} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Post Feedback or Research Note</h3>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share thoughts, paper reviews, or feedback with team members..."
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-primary-500 focus:bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No discussions started yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{c.author?.name || c.author?.email}</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          <form onSubmit={handleAddMilestone} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Research Milestone</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                placeholder="e.g. Complete Literature Review"
                required
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
              <input
                type="date"
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={submittingMilestone}
              className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition"
            >
              Add Milestone
            </button>
          </form>

          <div className="space-y-3">
            {milestones.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No milestones set for this project.</p>
            ) : (
              milestones.map((m) => (
                <div key={m._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleMilestone(m._id, m.status)}
                      className={`h-6 w-6 rounded-full border flex items-center justify-center transition ${
                        m.status === "completed"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-emerald-500"
                      }`}
                    >
                      {m.status === "completed" && <Check size={14} />}
                    </button>
                    <div>
                      <p className={`text-sm font-semibold ${m.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                        {m.title}
                      </p>
                      {m.dueDate && (
                        <p className="text-xs text-slate-400">Target: {new Date(m.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    m.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: CITATIONS */}
      {activeTab === "citations" && (
        <div className="space-y-6">
          <form onSubmit={handleAddReference} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Paper Citation / Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={refTitle}
                onChange={(e) => setRefTitle(e.target.value)}
                placeholder="Paper Title *"
                required
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
              <input
                type="text"
                value={refAuthors}
                onChange={(e) => setRefAuthors(e.target.value)}
                placeholder="Authors (comma separated, e.g. A. Vaswani, N. Shazeer)"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
              <input
                type="number"
                value={refYear}
                onChange={(e) => setRefYear(e.target.value)}
                placeholder="Publication Year (e.g. 2024)"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
              <input
                type="text"
                value={refVenue}
                onChange={(e) => setRefVenue(e.target.value)}
                placeholder="Journal / Conference (e.g. NeurIPS 2024)"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={submittingRef}
              className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition"
            >
              Save Reference
            </button>
          </form>

          <div className="space-y-3">
            {references.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No references saved for this project.</p>
            ) : (
              references.map((r) => (
                <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{r.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.authors?.join(", ") || "Unknown"} ({r.year || "n.d."}) · {r.venue || "Research Library"}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCitation(r)}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:underline font-medium"
                  >
                    <Copy size={13} /> Copy Citation
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: TEAM */}
      {activeTab === "team" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Project Members</h2>
          <div className="mt-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 text-sm">
                  {project.owner?.name?.charAt(0) || "O"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{project.owner?.name}</p>
                  <p className="text-xs text-slate-500">{project.owner?.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                Project Lead
              </span>
            </div>

            {project.members
              ?.filter((m) => m._id?.toString() !== project.owner?._id?.toString())
              .map((m) => (
                <div key={m._id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-sm">
                      {m.name?.charAt(0) || "M"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(m._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
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
    </div>
  );
}
