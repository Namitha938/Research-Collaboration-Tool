import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, Clock, ListChecks, TrendingUp, Plus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/dashboard/ProjectCard";

// DEMO DATA: replace with API calls once the Task / Activity backends are implemented.
const DEMO = { activeTasks: 8, completed: 12, progress: 65 };
const ACTIVITY = [
  { who: "You", text: "uploaded dataset.csv", when: "2 hours ago", letter: "H" },
  { who: "Rahul S.", text: "completed Literature Review", when: "5 hours ago", letter: "R" },
  { who: "Dr. Priya", text: "commented on Research Paper Draft", when: "Yesterday", letter: "P" },
  { who: "New Member", text: "joined AI Research Project", when: "2 days ago", letter: "N" },
];
const UPCOMING = [
  { title: "Submit literature review", due: "Tomorrow" },
  { title: "Review dataset with team", due: "In 3 days" },
  { title: "Draft methodology section", due: "Next week" },
];

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
        <Stat icon={Clock} label="Active Tasks" value={DEMO.activeTasks} tone="bg-orange-50 text-orange-500" />
        <Stat icon={ListChecks} label="Completed" value={DEMO.completed} tone="bg-emerald-50 text-emerald-600" />
        <Stat icon={TrendingUp} label="Progress" value={`${DEMO.progress}%`} tone="bg-purple-50 text-purple-600" />
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
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {UPCOMING.map((t) => (
                <div key={t.title} className="flex items-center justify-between px-5 py-4 text-sm">
                  <span className="font-medium text-slate-800">{t.title}</span>
                  <span className="text-slate-500">{t.due}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
          <ul className="mt-5 divide-y divide-slate-100">
            {ACTIVITY.map((a) => (
              <li key={a.text} className="flex gap-3 py-4 first:pt-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">{a.letter}</div>
                <div>
                  <p className="text-sm text-slate-700"><span className="font-semibold text-slate-900">{a.who}</span> {a.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/notifications" className="mt-2 block text-center text-sm font-medium text-slate-600 hover:text-primary-600">View All Activity</Link>
        </aside>
      </div>

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreated={(p) => setProjects([p, ...projects])} />
      )}
    </div>
  );
}
