import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, Clock, ListChecks, TrendingUp, Plus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/ProjectCard";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}><Icon size={18} /></div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then(async (r) => {
      const projs = r.data.projects || [];
      setProjects(projs);
      
      try {
        // Fetch tasks and activities for all projects
        const tasksPromises = projs.map(p => api.get(`/projects/${p._id}/tasks`).catch(() => ({ data: { tasks: [] } })));
        const actPromises = projs.map(p => api.get(`/projects/${p._id}/activities?limit=5`).catch(() => ({ data: { activities: [] } })));
        
        const tasksRes = await Promise.all(tasksPromises);
        const actRes = await Promise.all(actPromises);
        
        let allTasks = [];
        tasksRes.forEach(res => {
          if (res.data && res.data.tasks) {
            allTasks = [...allTasks, ...res.data.tasks];
          }
        });
        
        let allActivities = [];
        actRes.forEach(res => {
          if (res.data && res.data.activities) {
            allActivities = [...allActivities, ...res.data.activities];
          }
        });
        
        setTasks(allTasks);
        
        const sortedActivity = allActivities
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
          
        setActivities(sortedActivity);
      } catch (err) {
        console.error("Error loading dashboard details", err);
      } finally {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
    : 0;

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1300px] animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{greeting()}, {user?.name} 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your research today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">
            <Plus size={16} /> New Project
          </button>
          <button onClick={() => navigate("/documents")} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
            Upload
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={FolderKanban} label="Projects" value={projects.length} tone="bg-blue-50 text-blue-600" />
        <Stat icon={Clock} label="Active Tasks" value={activeTasksCount} tone="bg-orange-50 text-orange-500" />
        <Stat icon={ListChecks} label="Completed" value={completedTasksCount} tone="bg-emerald-50 text-emerald-600" />
        <Stat icon={TrendingUp} label="Avg Progress" value={`${avgProgress}%`} tone="bg-purple-50 text-purple-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Research Projects</h2>
              <Link to="/projects" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FolderKanban size={26} /></div>
                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">No research projects yet</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">Get started by creating your first project to organize tasks, documents, and team members.</p>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {loading ? (
                <div className="p-6 text-center text-sm text-slate-500">Loading tasks...</div>
              ) : upcomingTasks.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No upcoming tasks scheduled.</div>
              ) : (
                upcomingTasks.map((t) => (
                  <div key={t._id} className="flex items-center justify-between px-5 py-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="font-medium text-slate-800 dark:text-slate-100">{t.title}</span>
                    <span className="text-slate-500 dark:text-slate-400">{new Date(t.dueDate).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <li className="py-4 text-center text-sm text-slate-500">Loading activity...</li>
            ) : activities.length === 0 ? (
              <li className="py-4 text-sm text-slate-500">No recent activity found.</li>
            ) : (
              activities.map((a) => {
                const actorName = a.actor?.name || 'Someone';
                const letter = actorName.charAt(0).toUpperCase();
                const isYou = a.actor?._id === (user?.id || user?._id);
                const displayName = isYou ? 'You' : actorName;
                const date = new Date(a.createdAt).toLocaleDateString();
                
                return (
                  <li key={a._id} className="flex gap-3 py-4 first:pt-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 dark:text-slate-400">{letter}</div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-white">{displayName}</span> {a.message}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{date}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
          <Link to="/projects" className="mt-2 block text-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600">View All Projects</Link>
        </aside>
      </div>
      </div>

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreated={(p) => setProjects([p, ...projects])} />
      )}
    </>
  );
}