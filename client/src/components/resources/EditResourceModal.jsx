import React, { useState, useEffect } from "react";
import { X, Link as LinkIcon, Database, Code, FileText, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function EditResourceModal({ resource, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: resource?.name || "",
    description: resource?.description || "",
    type: resource?.type || "link",
    url: resource?.url || "",
    tags: resource?.tags?.join(", ") || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const tagArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        tags: tagArray,
      };

      if (resource.type !== "file") {
          payload.url = formData.url;
      }

      const res = await api.put(`/resources/${resource._id}`, payload);

      toast.success("Resource updated successfully");
      onUpdated(res.data.resource);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Resource</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  className={`flex ${resource.type === "file" ? "cursor-not-allowed opacity-60" : "cursor-pointer"} flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all ${
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
                    disabled={resource.type === "file"}
                    className="sr-only"
                  />
                  <type.icon size={16} />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
            {resource.type === "file" && (
                <p className="mt-1.5 text-xs text-amber-600">File resources cannot change their type.</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
            />
          </div>

          {resource.type !== "file" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
