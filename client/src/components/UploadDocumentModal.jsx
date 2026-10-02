import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const field =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20";

export default function UploadDocumentModal({ onClose, onUploaded, defaultProjectId }) {
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("paper");
  const [project, setProject] = useState(defaultProjectId || "");
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
      if (!name) {
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "");
        setName(nameWithoutExt);
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
    formData.append("document", file); // Must match upload.single("document")
    formData.append("name", name || file.name);
    formData.append("description", description);
    formData.append("category", category);

    try {
      const res = await api.post(`/projects/${project}/documents`, formData, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg max-h-[95vh] overflow-y-auto space-y-4 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Upload Research Asset</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              File <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-primary-500 transition">
              <UploadCloud className="w-8 h-8 text-primary-500 mb-2" />
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, CSV up to 10MB</p>
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Document Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deep Learning Transformer Paper Draft"
              required
              className={field}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe this document"
              className={field}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={field}
              >
                <option value="paper">Paper / Manuscript</option>
                <option value="dataset">Dataset / Raw Data</option>
                <option value="proposal">Grant / Proposal</option>
                <option value="report">Progress Report</option>
                <option value="other">Other Asset</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
                className={field}
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

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
