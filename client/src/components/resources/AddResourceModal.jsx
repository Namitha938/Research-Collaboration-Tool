import React, { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon, Database, Code, FileText, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AddResourceModal({ defaultProjectId, onClose, onAdded }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "link",
    url: "",
    tags: "",
    projectId: defaultProjectId || "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!defaultProjectId) {
      api.get("/projects").then((res) => {
        setProjects(res.data.projects || []);
        if (res.data.projects?.length > 0 && !formData.projectId) {
          setFormData((prev) => ({ ...prev, projectId: res.data.projects[0]._id }));
        }
      });
    }
  }, [defaultProjectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      return toast.error("Please select a project");
    }
    if (formData.type === "file" && !file) {
      return toast.error("Please select a file to upload");
    }
    if (formData.type !== "file" && !formData.url) {
        return toast.error("Please provide a URL");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("type", formData.type);
      
      const tagArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      data.append("tags", JSON.stringify(tagArray));

      if (formData.type === "file") {
        data.append("file", file);
      } else {
        data.append("url", formData.url);
      }

      const res = await api.post(`/projects/${formData.projectId}/resources`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resource added successfully");
      onAdded(res.data.resource);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Resource</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!defaultProjectId && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Project</label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { id: "link", label: "Link", icon: LinkIcon },
                { id: "dataset", label: "Dataset", icon: Database },
                { id: "repository", label: "Repository", icon: Code },
                { id: "file", label: "File", icon: FileText },
                { id: "reference", label: "Reference", icon: BookOpen },
              ].map((type) => (
                <label
                  key={type.id}
                  className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all ${
                    formData.type === type.id
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.id}
                    checked={formData.type === type.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <type.icon size={16} />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Diabetic Retinopathy Dataset"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Brief description of the resource..."
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
            />
          </div>

          {formData.type === "file" ? (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">File</label>
              <div className="flex w-full items-center justify-center">
                <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100">
                  <div className="flex flex-col items-center justify-center pb-4 pt-5">
                    <Upload className="mb-2 h-6 w-6 text-slate-400" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {file ? <span className="font-semibold text-primary-600">{file.name}</span> : "Click to select a file"}
                    </p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.webp" />
                </label>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tags <span className="font-normal text-slate-400">(comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="dataset, fundus, medical"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
