'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsChatDots } from 'react-icons/bs';

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are an assistant for an auction website.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/admin/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't get a response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-700 border-4 border-cyan-300/30 shadow-2xl flex items-center justify-center hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 animate-pulse"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl sm:text-3xl text-white drop-shadow-lg"
        >
          {open ? '×' : <BsChatDots />}
        </motion.span>
      </button>

      {/* Animated Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            className="fixed bottom-0 right-0 left-0 sm:bottom-20 sm:right-6 sm:left-auto z-50 w-full sm:w-[95vw] sm:max-w-[390px] min-h-[60vh] max-h-[90vh] sm:min-h-[500px] sm:max-h-[600px] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl border border-cyan-400/10 bg-gradient-to-br from-[#101928]/90 via-[#1e293b]/90 to-[#232946]/90 backdrop-blur-xl overflow-hidden"
            style={{ boxShadow: '0 8px 40px 0 rgba(0, 255, 255, 0.10), 0 2px 16px 0 rgba(0,0,0,0.25)' }}
          >
            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 py-3 bg-gradient-to-r from-[#0a192f] via-[#1e293b] to-[#232946] border-b border-cyan-400/10 shadow-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-cyan-400/80 to-blue-600/80 flex items-center justify-center shadow-lg border-2 border-cyan-300/40"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <BsChatDots className="text-white text-lg sm:text-xl" />
                </motion.div>
                <span className="font-bold text-base sm:text-lg text-cyan-100 tracking-wide drop-shadow">AuctAsync Chat</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan-900/30 text-cyan-100 text-xl sm:text-2xl font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                ×
              </button>
            </div>
            {/* Chat body */}
            <div className="relative flex-1 flex flex-col z-10 h-0 min-h-0">
              {/* Soft inner shadow */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_8px_32px_0_rgba(34,211,238,0.08)] z-10" />
              <main className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-cyan-700/60 scrollbar-track-transparent">
                {messages
                  .filter(m => m.role !== 'system')
                  .map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85vw] sm:max-w-[75%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl leading-relaxed whitespace-pre-wrap break-words shadow-md
                          ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-cyan-700/80 to-cyan-900/80 text-cyan-100'
                              : 'bg-gradient-to-br from-[#232946]/80 to-[#101928]/80 text-white/90 border border-cyan-900/20'
                          }
                        `}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                <div ref={messagesEndRef} />
                {loading && <div className="text-cyan-300 italic select-none">Typing...</div>}
              </main>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!loading) handleSend();
                }}
                className="flex border-t border-cyan-700/30 p-2 sm:p-3 bg-[#101928]/80 backdrop-blur-md"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about auctions..."
                  className="flex-1 p-2 sm:p-3 bg-[#181f2a] border border-cyan-900/30 rounded-2xl text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition disabled:opacity-60 text-sm sm:text-base"
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-2 sm:ml-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-4 sm:px-6 py-2 rounded-2xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
