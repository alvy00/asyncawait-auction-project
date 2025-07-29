'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsChatDots } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { IoMdChatboxes } from "react-icons/io";
import { useUser } from './../../lib/user-context';

export default function FloatingChatbot() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // initial message if user is available
  useEffect(() => {
    if (!user) return;

    const initialMessages = [
      {
        role: 'system',
        content: `
          You are AuctaSyncBot, the friendly assistant for AuctaSync – a fast-paced, real-time auction platform.

          Your job is to help users understand how the platform works. Keep answers short, helpful, and user-friendly. Use bullet points if helpful. Avoid making up information.

          Platform Overview:
          - Users start with $1000 balance.
          - They can join 5 auction types: Classic, Reverse, Dutch, Blitz, and Phantom.
          - Users can view stats, bid history, and manage funds.
          - Admins have moderation tools.

          Respond in a helpful, non-robotic tone. Always assume the user is logged in unless otherwise specified.
        `.trim(),
      },
      {
        role: 'system',
        content: `
          User Context:
          - Username: ${user.name}
          - Email: ${user.email}
          - Wallet Balance: $${user.money}
          - Auctions Won: ${user.auctions_won}
          - Win Rate: ${user.win_rate}%
          - Role: ${user.is_admin ? 'admin' : 'user'}
          - Suspended: ${user.is_suspended ? 'Yes' : 'No'}
        `.trim(),
      },
      {
        role: 'assistant',
        content: `Hi ${user.name} \n` +
          `I'm AuctaSyncBot.\n` +
          `I can help you:\n` +
          `- Understand different auction types\n` +
          `- Track your bidding performance\n` +
          `- Explain your balance or history\n` +
          `- Or guide you to the right page\n\n` +
          `Ask me anything about AuctaSync! 🚀`
      }
    ];

    setMessages(initialMessages);
  }, [user]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // handle mouse clicks
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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-700 to-fuchsia-600 border-4 border-white/20 shadow-lg flex items-center justify-center hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 animate-pulse"
          aria-label="Open chat"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl sm:text-3xl text-white drop-shadow"
          >
            <IoMdChatboxes />
          </motion.span>
        </button>
      )}

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
            className="fixed bottom-0 right-0 left-0 sm:bottom-20 sm:right-6 sm:left-auto z-50 w-full sm:w-[95vw] sm:max-w-[390px] min-h-[60vh] max-h-[90vh] sm:min-h-[500px] sm:max-h-[600px] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-xl border border-white/10 bg-gradient-to-br from-[#0f0c29]/90 via-[#302b63]/90 to-[#24243e]/90 backdrop-blur-md overflow-hidden"
            style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(255, 0, 150, 0.08)' }}
          >
            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 py-3 bg-gradient-to-r from-[#1f1c2c] via-[#2a1f3d] to-[#302b63] border-b border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center shadow border-2 border-white/20"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <BsChatDots className="text-white text-lg sm:text-xl" />
                </motion.div>
                <span className="font-semibold text-base sm:text-lg text-white tracking-wide">AuctaSync Chat</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white text-xl transition-all backdrop-blur-sm border border-white/10 shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            {/* Chat body */}
            <div className="relative flex-1 flex flex-col z-10 h-0 min-h-0">
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_8px_32px_0_rgba(255,255,255,0.03)] z-10" />
              <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-purple-500/60 scrollbar-track-transparent">
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
                        className={`max-w-[85vw] sm:max-w-[75%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl leading-relaxed whitespace-pre-wrap break-words shadow-sm
                          ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-indigo-700/80 to-fuchsia-700/80 text-white'
                              : 'bg-[#1e1b2e]/80 text-white/90 border border-white/10'
                          }
                        `}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                <div ref={messagesEndRef} />
                {loading && <div className="text-fuchsia-300 italic text-sm pl-2">Typing...</div>}
              </main>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!loading) handleSend();
                }}
                className="flex border-t border-white/10 p-2 sm:p-3 bg-[#1b1833]/90 backdrop-blur"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about auctions..."
                  className="flex-1 p-2 sm:p-3 bg-[#272343] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition disabled:opacity-60 text-sm sm:text-base"
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-2 sm:ml-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white px-4 sm:px-6 py-2 rounded-2xl font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer"
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
