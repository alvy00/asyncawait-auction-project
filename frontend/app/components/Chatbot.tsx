'use client';

import { useState, useRef, useEffect } from 'react';

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are an assistant for an auction website.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // https://asyncawait-auction-project.onrender.com/api/admin/chatbot
      // http://localhost:8000/api/admin/chatbot
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.971 9.971 0 01-4-1l-5 1 1-5a9.971 9.971 0 01-1-4c0-4.97 3.582-9 8-9s9 4.03 9 9z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-[500px] bg-white rounded-lg shadow-lg flex flex-col">
          <header className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold flex justify-between items-center">
            Auction Assistant
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white hover:text-gray-300">
              ✕
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages
              .filter(m => m.role !== 'system')
              .map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`inline-block px-3 py-1.5 rounded max-w-[75%] whitespace-pre-wrap ${
                      msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            <div ref={messagesEndRef} />
            {loading && <div className="text-gray-500 italic">Typing...</div>}
          </main>

          <form
            onSubmit={e => {
              e.preventDefault();
              if (!loading) handleSend();
            }}
            className="flex border-t border-gray-300 p-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about auctions..."
              className="flex-1 p-2 border rounded disabled:bg-gray-100"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
