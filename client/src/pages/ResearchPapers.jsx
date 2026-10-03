import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ResearchPapersTab from "../components/research-papers/ResearchPapersTab";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function ResearchPapers() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        const fetchedProjects = res.data.projects || [];
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0) {
          setSelectedProjectId(fetchedProjects[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p._id === selectedProjectId);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 w-full rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-primary-600 dark:text-primary-500" />
            Research Papers Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select a project to organize and review its academic literature.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm outline-none focus:border-primary-500 transition-colors"
          >
            {projects.length === 0 && <option value="">No projects available</option>}
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject ? (
        <ResearchPapersTab projectId={selectedProjectId} project={selectedProject} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center flex flex-col items-center">
           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Select a Project</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            You need to select a project to view and manage its associated research papers.
          </p>
        </div>
      )}
    </div>
  );
}
