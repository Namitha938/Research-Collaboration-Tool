import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, Clock, ListChecks, TrendingUp, Plus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/dashboard/ProjectCard";


const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}><Icon size={18} /></div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data.projects)).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1300px] animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{greeting()}, {user?.name} 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening with your research today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">
            <Plus size={16} /> New Project
          </button>
          <button onClick={() => navigate("/documents")} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Upload
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={FolderKanban} label="Projects" value={projects.length} tone="bg-blue-50 text-blue-600" />
        <Stat icon={Clock} label="Active Tasks" value={0} tone="bg-orange-50 text-orange-500" />
        <Stat icon={ListChecks} label="Completed" value={0} tone="bg-emerald-50 text-emerald-600" />
        <Stat icon={TrendingUp} label="Progress" value="—" tone="bg-purple-50 text-purple-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Research Projects</h2>
              <Link to="/projects" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
            </div>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FolderKanban size={26} /></div>
                <h3 className="mt-5 font-semibold text-slate-900">No research projects yet</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">Get started by creating your first project to organize tasks, documents, and team members.</p>
                <button onClick={() => setShowModal(true)} className="mt-6 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.slice(0, 4).map((p) => <ProjectCard key={p._id} project={p} />)}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3"><Clock size={20} /></div>
              <h3 className="font-semibold text-slate-900 mb-1">No upcoming tasks</h3>
              <p className="text-sm text-slate-500 max-w-sm">Tasks assigned to you across all projects will appear here.</p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
          <div className="py-8 text-center flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3"><TrendingUp size={20} /></div>
            <p className="text-sm font-semibold text-slate-900 mb-1">No recent activity</p>
            <p className="text-xs text-slate-500 max-w-[200px]">Team activities and updates will show up here.</p>
          </div>
        </aside>
      </div>

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreated={(p) => setProjects([p, ...projects])} />
      )}
    </div>
  );
}
