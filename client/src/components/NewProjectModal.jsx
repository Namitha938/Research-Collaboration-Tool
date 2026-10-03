import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const EMPTY = { title: "", description: "", researchArea: "", startDate: "", deadline: "" };
const field =
  "w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500/20";

export default function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
      const res = await api.post("/projects", payload);
      toast.success("Project created");
      onCreated?.(res.data.project);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Research Project</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <input name="title" value={form.title} onChange={change} required placeholder="Project title" className={field} />
        <input name="researchArea" value={form.researchArea} onChange={change} required placeholder="Research area (e.g. Machine Learning)" className={field} />
        <textarea name="description" value={form.description} onChange={change} required rows={3} placeholder="Short description" className={field} />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-500 dark:text-slate-400">Start date
            <input type="date" name="startDate" value={form.startDate} onChange={change} className={`${field} mt-1`} />
          </label>
          <label className="text-xs text-slate-500 dark:text-slate-400">Deadline
            <input type="date" name="deadline" value={form.deadline} onChange={change} className={`${field} mt-1`} />
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium">Cancel</button>
          <button disabled={saving} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
