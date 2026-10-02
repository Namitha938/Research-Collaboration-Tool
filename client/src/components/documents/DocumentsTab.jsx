import React, { useState, useEffect } from "react";
import { Plus, FileText, Download, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import UploadDocumentModal from "../UploadDocumentModal";
import { useAuth } from "../../context/AuthContext";

export default function DocumentsTab({ projectId, project }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;
  
  // Also check if researcher (any member is considered researcher here based on task setup)
  const isMember = project?.members?.some(m => m.user?._id === user?._id || m.user === user?._id || m._id === user?._id);
  const canUpload = isOwner || isMember;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${projectId}/documents`);
      setDocuments(res.data.documents || []);
    } catch (err) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchDocuments();
  }, [projectId]);

  const handleDelete = async (docId, docName) => {
    if (!window.confirm(`Delete document "${docName}"?`)) return;
    try {
      await api.delete(`/documents/${docId}`);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      toast.success("Document deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDownload = async (docId) => {
    try {
      const toastId = toast.loading("Preparing download...");
      const res = await api.get(`/documents/${docId}/download`);
      if (res.data.downloadUrl) {
        toast.dismiss(toastId);
        window.location.href = res.data.downloadUrl;
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to prepare download");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading documents...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Project Documents</h2>
          <p className="text-xs text-slate-500">Manage research papers, datasets, and files</p>
        </div>
        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
          >
            <Plus size={16} /> Upload Document
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No documents in this project yet.</p>
          {canUpload && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 rounded-lg bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition"
            >
              Upload First Document
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Document</th>
                <th className="px-6 py-3.5">Uploaded By</th>
                <th className="px-6 py-3.5">Size</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{d.name}</div>
                        {d.description && (
                          <div className="line-clamp-1 text-xs text-slate-400 mt-0.5">
                            {d.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {d.uploadedBy?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {formatFileSize(d.fileSize)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition"
                        title="View Document"
                      >
                        <Eye size={16} />
                      </a>
                      <button
                        onClick={() => handleDownload(d._id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                        title="Download Document"
                      >
                        <Download size={16} />
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(d._id, d.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Delete Document"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUploadModal && (
        <UploadDocumentModal
          defaultProjectId={projectId}
          onClose={() => setShowUploadModal(false)}
          onUploaded={(newDoc) => setDocuments((prev) => [newDoc, ...prev])}
        />
      )}
    </div>
  );
}
