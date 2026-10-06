import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare, FolderKanban, Sparkles, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react";
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

  // Edit/Delete state
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

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

    socket.on("message_edited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    });

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === messageId) {
            return { ...m, deleted: true, content: "Message deleted" };
          }
          return m;
        })
      );
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

  const handleEditClick = (message) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const saveEdit = () => {
    if (!editContent.trim() || !socketRef.current) return;
    
    socketRef.current.emit("edit_message", {
      messageId: editingMessageId,
      content: editContent.trim(),
    });
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleDeleteClick = (messageId) => {
    setMenuOpenId(null);
    if (window.confirm("Delete this message?")) {
      socketRef.current?.emit("delete_message", { messageId });
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
                const isEditing = editingMessageId === m._id;
                
                return (
                  <div
                    key={m._id || idx}
                    className={`flex flex-col group ${isSelf ? "items-end" : "items-start"}`}
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
                      {m.edited && !m.deleted && (
                        <span className="text-[10px] text-slate-400 italic">(edited)</span>
                      )}
                    </div>

                    <div className="relative flex items-start gap-2 max-w-full sm:max-w-[75%] md:max-w-md">
                      {isSelf && !m.deleted && !isEditing && (
                        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center mr-1">
                          <button
                            onClick={() => setMenuOpenId(menuOpenId === m._id ? null : m._id)}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {menuOpenId === m._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)}></div>
                              <div className="absolute right-6 top-0 z-20 w-32 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 py-1 flex flex-col overflow-hidden">
                                <button
                                  onClick={() => handleEditClick(m)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                                >
                                  <Edit2 size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(m._id)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {isEditing ? (
                        <div className="flex flex-col w-full max-w-md bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-3 shadow-sm min-w-[250px]">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full resize-none text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                            >
                              <X size={12} /> Cancel
                            </button>
                            <button
                              onClick={saveEdit}
                              disabled={!editContent.trim()}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                            >
                              <Check size={12} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                            m.deleted
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 italic"
                              : isSelf
                              ? "bg-indigo-600 text-white rounded-tr-xs"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                      )}
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
