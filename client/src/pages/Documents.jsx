import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  Download,
  FolderKanban,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import UploadDocumentModal from "../components/UploadDocumentModal";

export default function Documents({ defaultCategory }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(defaultCategory || "all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [category]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let url = "/documents";
      const params = [];
      if (category && category !== "all") params.push(`category=${category}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await api.get(url);
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Error loading documents:", err);
      toast.error("Failed to load document repository");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDelete = async (docId, docTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${docTitle}"?`)) return;

    try {
      await api.delete(`/documents/${docId}`);
      toast.success("Document deleted");
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
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

  const categories = [
    { id: "all", name: "All Assets" },
    { id: "paper", name: "Papers & Publications" },
    { id: "dataset", name: "Datasets & Code" },
    { id: "proposal", name: "Proposals & Grants" },
    { id: "report", name: "Reports" },
    { id: "other", name: "Other" },
  ];

  return (
    <>
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Research Documents</h1>
          <p className="mt-1 text-sm text-slate-500">
            Central repository for research papers, datasets, manuscripts, and project assets.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Upload size={18} /> Upload Asset
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                category === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </form>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700">No documents found</p>
            <p className="text-xs text-slate-400 mt-1">Upload research papers or raw datasets to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4">Size</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{doc.name}</p>
                          {doc.description && <p className="text-xs text-slate-400 line-clamp-1">{doc.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {doc.category || "Other"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {doc.project?.title || "General"}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {doc.uploadedBy?.name || doc.uploadedBy?.email || "Unknown"}
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                            title="View document"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDownload(doc._id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                          title="Download document"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id, doc.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Delete document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {showUploadModal && (
      <UploadDocumentModal
        onClose={() => setShowUploadModal(false)}
        onUploaded={() => fetchDocuments()}
      />
    )}
    </>
  );
}
