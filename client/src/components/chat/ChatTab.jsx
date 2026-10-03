import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { getProjectMessages } from '../../api/chatService';
import { getSocket, connectSocket, disconnectSocket } from '../../sockets/socket';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button';

const ChatTab = ({ projectId, project }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketStatus, setSocketStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    let socket = null;
    let isMounted = true;

    const initializeChat = async () => {
      try {
        setLoading(true);
        // Load initial history
        const data = await getProjectMessages(projectId, 1, 50);
        if (isMounted) {
          // Messages come sorted descending from API, so reverse for display
          setMessages(data.messages.reverse());
          setLoading(false);
          setTimeout(() => scrollToBottom('auto'), 100);
        }

        // Initialize Socket
        const token = localStorage.getItem('token');
        socket = connectSocket(token);

        socket.on('connect', () => {
          if (isMounted) setSocketStatus('connected');
          socket.emit('join_project', projectId);
        });

        socket.on('disconnect', () => {
          if (isMounted) setSocketStatus('disconnected');
        });

        socket.on('new_message', (message) => {
          if (isMounted && message.project === projectId) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some((m) => m._id === message._id)) return prev;
              return [...prev, message];
            });
            
            // Auto-scroll logic: only scroll to bottom if we're already near the bottom
            const container = chatContainerRef.current;
            if (container) {
              const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
              if (isNearBottom || message.sender._id === user._id) {
                setTimeout(() => scrollToBottom('smooth'), 100);
              }
            }
          }
        });

        socket.on('chat_error', (data) => {
          console.error('Chat error:', data.message);
        });

      } catch (err) {
        console.error('Failed to load chat', err);
        if (isMounted) {
          setError('Unable to load messages');
          setLoading(false);
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (socket) {
        socket.emit('leave_project', projectId);
        socket.off('connect');
        socket.off('disconnect');
        socket.off('new_message');
        socket.off('chat_error');
        // We disconnect socket only if the component unmounts entirely (user leaves project chat)
        disconnectSocket();
      }
    };
  }, [projectId, user._id]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('send_message', {
        projectId,
        content: inputValue.trim()
      });
      setInputValue('');
      setTimeout(() => scrollToBottom('smooth'), 50);
    } else {
      setError('Not connected to chat server');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading messages...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[400px]">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{error}</h3>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] max-h-[70vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            Project Chat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Collaborate with your research team in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`w-2 h-2 rounded-full ${
              socketStatus === 'connected' ? 'bg-green-500' : 
              socketStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {socketStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900 flex flex-col gap-4"
      >
        {messages.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No messages yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Start the conversation with your research team.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender._id === user._id || msg.sender === user._id;
            const showName = !isMe && (index === 0 || messages[index - 1].sender._id !== msg.sender._id);

            return (
              <div key={msg._id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                {showName && (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">
                    {msg.sender.name}
                  </span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl ${
                    isMe 
                      ? 'bg-primary-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 mx-1">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift + Enter for new line)"
            className="flex-grow resize-none overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow min-h-[44px] max-h-[120px]"
            rows={Math.min(5, inputValue.split('\n').length)}
            disabled={socketStatus !== 'connected'}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || socketStatus !== 'connected'}
            className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
