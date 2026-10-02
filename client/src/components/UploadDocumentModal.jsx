import React, { useState, useEffect } from "react";
import { X, UploadCloud, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function UploadDocumentModal({ onClose, onUploaded, defaultProjectId }) {
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState(defaultProjectId || "");
  const [category, setCategory] = useState("paper");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => {
        const projs = res.data.projects || [];
        setProjects(projs);
        if (!project && projs.length > 0) {
          setProject(defaultProjectId || projs[0]._id);
        }
      })
      .catch(() => {});
  }, [defaultProjectId]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (!title) {
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!project) {
      toast.error("Please select a project");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name);
    formData.append("project", project);
    formData.append("category", category);

    try {
      const res = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded successfully!");
      if (onUploaded) onUploaded(res.data.document);
      onClose();
    } catch (err) {
      console.error("Upload document error:", err);
      toast.error(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Research Asset</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              File <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center hover:border-indigo-500 transition">
              <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, CSV, ZIP up to 30MB</p>
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Learning Transformer Paper Draft"
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                <option value="paper">Paper / Manuscript</option>
                <option value="dataset">Dataset / Raw Data</option>
                <option value="proposal">Grant / Proposal</option>
                <option value="report">Progress Report</option>
                <option value="other">Other Asset</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                <option value="" disabled>Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
