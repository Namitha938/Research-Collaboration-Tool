import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, Shield, UserCheck, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Team() {
  const [researchers, setResearchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debounceTimeout = useRef(null);

  const fetchResearchers = useCallback(async (currentPage, currentSearch) => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/collaborators`, {
        params: {
          page: currentPage,
          limit: 12,
          search: currentSearch
        }
      });
      setResearchers(res.data.researchers || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      toast.error("Unable to load researchers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchers(page, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Re-fetch only when page changes

  // Handle search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      fetchResearchers(1, value);
    }, 500);
  };

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-[1300px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research Directory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Connect and discover fellow faculty, researchers, and lab collaborators.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search researchers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading researchers...</div>
      ) : researchers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchTerm ? `No researchers found matching "${searchTerm}".` : "No researchers found."}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchResearchers(1, "");
              }}
              className="mt-4 text-primary-600 hover:underline text-sm font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researchers.map((r) => {
            const isCopied = copiedId === r._id;
            return (
              <div
                key={r._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:shadow-md"
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

                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{r.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{r.email}</p>
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Joined {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                  </span>

                  <button
                    onClick={() => handleCopyEmail(r.email, r._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-medium text-slate-900 dark:text-white">{(page - 1) * 12 + 1}</span> to{" "}
                <span className="font-medium text-slate-900 dark:text-white">{Math.min(page * 12, total)}</span> of{" "}
                <span className="font-medium text-slate-900 dark:text-white">{total}</span> researchers
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

