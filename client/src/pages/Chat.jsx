import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare, FolderKanban, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function Chat({ projectId, project }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(project || null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      auth: { token: localStorage.getItem("token") }
    });
    socketRef.current = socket;

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_typing", ({ userName }) => {
      setTypingUser(userName);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser(null);
    });

    if (projectId) {
      if (project) {
        setActiveProject(project);
        setLoading(false);
      }
    } else {
      api
        .get("/projects")
        .then((res) => {
          const projs = res.data.projects || [];
          setProjects(projs);
          if (projs.length > 0) {
            setActiveProject(projs[0]);
          }
        })
        .catch(() => toast.error("Could not load research channels"))
        .finally(() => setLoading(false));
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeProject || !socketRef.current) return;

    const projectId = activeProject._id;
    socketRef.current.emit("join_project", projectId);

    api
      .get(`/chat/${projectId}`)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch(() => toast.error("Could not load channel history"));

    return () => {
      socketRef.current?.emit("leave_project", projectId);
    };
  }, [activeProject]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (!activeProject || !socketRef.current) return;

    socketRef.current.emit("typing", {
      projectId: activeProject._id,
      userName: user?.name,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { projectId: activeProject._id });
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeProject || !socketRef.current) return;

    socketRef.current.emit("stop_typing", { projectId: activeProject._id });

    socketRef.current.emit("send_message", {
      projectId: activeProject._id,
      senderId: user?.id || user?._id,
      content: inputMessage.trim(),
    });

    setInputMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400 font-medium">
        Loading research collaboration channels...
      </div>
    );
  }

  if (!projectId && projects.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
          <MessageSquare size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No project channels</h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Join or create a research workspace to enable real-time team messaging.
        </p>
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full animate-fade-in ${!projectId ? 'max-w-[1400px]' : ''}`}>
      <div className={`${!projectId ? 'h-[calc(100vh-160px)] min-h-[550px]' : 'h-[600px]'} overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row`}>
        {/* Project Channels Sidebar */}
        {!projectId && (
        <aside className="w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-4 md:w-80 md:border-b-0 md:border-r flex flex-col">
          <div className="mb-3 flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <FolderKanban size={16} className="text-indigo-600" />
              <span>Research Rooms</span>
            </div>
            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
              {projects.length}
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {projects.map((p) => {
              const isSelected = activeProject?._id === p._id;
              return (
                <button
                  key={p._id}
                  onClick={() => setActiveProject(p)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60"
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="text-sm truncate">{p.title}</p>
                    <p
                      className={`text-xs truncate ${
                        isSelected ? "text-indigo-100" : "text-slate-400"
                      }`}
                    >
                      {p.researchArea || "General Area"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-indigo-500/80 text-white"
                        : "bg-slate-200 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {p.members?.length || 1}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
        )}

        {/* Chat Workspace */}
        <main className="flex flex-1 flex-col bg-white dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-950/40">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <span>#{activeProject?.title}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeProject?.description || activeProject?.researchArea}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <Users size={14} className="text-indigo-600" />
              <span>{activeProject?.members?.length || 1} Members</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/20">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No previous messages in this channel. Send a message to start collaboration.
              </div>
            ) : (
              messages.map((m, idx) => {
                const isSelf =
                  (m.sender?._id || m.sender) === (user?._id || user?.id);
                return (
                  <div
                    key={m._id || idx}
                    className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-slate-400 px-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isSelf ? "You" : m.sender?.name || m.sender?.email || "Collaborator"}
                      </span>
                      <span>
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                        isSelf
                          ? "bg-indigo-600 text-white rounded-tr-xs"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </div>
                );
              })
            )}

            {typingUser && (
              <div className="flex items-center gap-2 text-xs italic text-indigo-600 font-medium px-2 animate-pulse">
                <Sparkles size={13} />
                <span>{typingUser} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeProject?.title || "channel"}...`}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition shadow-xs"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
