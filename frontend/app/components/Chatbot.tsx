'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimesCircle } from 'react-icons/fa';

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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-600 text-white shadow-lg flex items-center justify-center
                   hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition cursor-pointer"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <FaTimesCircle className="w-7 h-7 transition-transform duration-150 hover:scale-110" />
        ) : (
          <FaComments className="w-7 h-7 transition-transform duration-150 hover:scale-110" />
        )}
      </button>

      {/* Animated Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-6 z-50 w-80 max-h-[600px] min-h-[500px] bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-700"
          >
            <header className="bg-primary-600 text-white px-5 py-3 rounded-t-lg font-semibold flex justify-between items-center select-none">
              AuctasyncBOT
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-white hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-white rounded transition
                           cursor-pointer transform hover:scale-105 active:scale-95"
              >
                ✕
              </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-gray-700">
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
                      className={`max-w-[75%] px-5 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap break-words
                        ${
                          msg.role === 'user'
                            ? 'bg-primary-700 text-white shadow-md'
                            : 'bg-gray-700 text-gray-200 shadow-sm'
                        }
                      `}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              <div ref={messagesEndRef} />
              {loading && <div className="text-gray-400 italic select-none">Typing...</div>}
            </main>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!loading) handleSend();
              }}
              className="flex border-t border-gray-700 p-3 bg-gray-900"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about auctions..."
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading}
                className="ml-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-2xl
                           disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer transform hover:scale-105 active:scale-95"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
