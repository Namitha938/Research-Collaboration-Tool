import React, { useEffect, useState } from "react";
import { Search, Shield, UserCheck, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Team() {
  const [researchers, setResearchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    api
      .get("/auth/collaborators")
      .then((res) => {
        setResearchers(res.data.researchers || []);
      })
      .catch(() => toast.error("Could not load research community"))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = researchers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1300px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Connect and discover fellow faculty, researchers, and lab collaborators.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search researchers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading researchers...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">No researchers found matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const isCopied = copiedId === r._id;
            return (
              <div
                key={r._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 font-bold text-primary-600 text-lg">
                      {r.name?.charAt(0) || "R"}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        r.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {r.role === "admin" ? <Shield size={12} /> : <UserCheck size={12} />}
                      {r.role}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">{r.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{r.email}</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Joined {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                  </span>

                  <button
                    onClick={() => handleCopyEmail(r.email, r._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Copy email to invite to project"
                  >
                    {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{isCopied ? "Copied" : "Copy Email"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

