import React, { useState, useEffect } from "react";
import { X, Send, Edit2, Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DocumentComments({ document, projectId, onClose }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [document._id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/documents/${document._id}/comments`);
      setComments(res.data.comments || []);
      setCurrentUserRole(res.data.currentUserRole);
    } catch (err) {
      if (err.response?.status !== 403) {
        toast.error("Failed to load comments");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post(`/projects/${projectId}/documents/${document._id}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const res = await api.put(`/comments/${commentId}`, { content: editContent });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.comment : c))
      );
      setEditingId(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={18} />
              Comments
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-[300px]">{document.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
              <p>No comments yet.</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isAuthor = user?._id === comment.author?._id;
              const isEditing = editingId === comment._id;

              return (
                <div key={comment._id} className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                        {comment.author?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {comment.author?.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleString()}
                          {comment.isEdited && <span className="ml-1 italic">(edited)</span>}
                        </p>
                      </div>
                    </div>
                    {isAuthor && !isEditing && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(comment)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={(e) => handleUpdateComment(e, comment._id)} className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 resize-none dark:text-white"
                        rows="2"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!editContent.trim()}
                          className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment */}
        {currentUserRole !== "viewer" ? (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <form onSubmit={handleAddComment} className="flex flex-col gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition dark:text-white"
                rows="3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  <Send size={16} />
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Viewers can read comments but cannot post.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
