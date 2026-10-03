import React, { useState, useEffect } from "react";
import {
  Database,
  Code,
  Link as LinkIcon,
  FileText,
  BookOpen,
  Search,
  Trash2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AddResourceModal from "../components/resources/AddResourceModal";
import EditResourceModal from "../components/resources/EditResourceModal";
import ResourceCard from "../components/resources/ResourceCard";
import { useAuth } from "../context/AuthContext";

export default function Resources({ defaultType }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(defaultType || "all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
  }, [type]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = "/resources";
      const params = [];
      if (type && type !== "all") params.push(`type=${type}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await api.get(url);
      setResources(res.data.resources || []);
    } catch (err) {
      console.error("Error loading resources:", err);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      await api.delete(`/resources/${resourceId}`);
      toast.success("Resource deleted");
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const types = [
    { id: "all", name: "All Resources" },
    { id: "link", name: "Links" },
    { id: "dataset", name: "Datasets" },
    { id: "repository", name: "Repositories" },
    { id: "file", name: "Files" },
    { id: "reference", name: "References" },
  ];

  return (
    <>
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Research Resources</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Central toolbox for datasets, repositories, links, and other materials across all your projects.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors"
        >
          <Database size={18} /> Add Resource
        </button>
      </div>

      {/* Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                type === t.id
                  ? "bg-primary-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-primary-500 focus:bg-white dark:bg-slate-900 transition"
          />
        </form>
      </div>

      {/* Resources Grid */}
      <div className="bg-transparent rounded-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No resources found</p>
            <p className="text-xs text-slate-400 mt-1">Add links, repositories, and datasets to your projects.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard 
                key={r._id} 
                resource={r} 
                isOwner={true} // In global view, we might allow deletion if they are creator or owner. 
                // We'll rely on backend permissions for the actual block, but let's show the menu for now.
                isCreator={r.createdBy && (r.createdBy._id || r.createdBy).toString() === (user?.id || user?._id)?.toString()}
                onDelete={handleDelete}
                onEdit={(resource) => setEditingResource(resource)}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {showAddModal && (
      <AddResourceModal
        onClose={() => setShowAddModal(false)}
        onAdded={() => fetchResources()}
      />
    )}

    {editingResource && (
      <EditResourceModal
        resource={editingResource}
        onClose={() => setEditingResource(null)}
        onUpdated={() => fetchResources()}
      />
    )}
    </>
  );
}
