import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../api/axios";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data.projects)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[1300px] animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus size={16} /> New Project
        </button>
      </div>
      {loading ? <p className="text-slate-500">Loading...</p> : projects.length === 0 ? (
        <p className="text-slate-500">No projects yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={(p) => setProjects([p, ...projects])} />}
    </div>
  );
}
