"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";

export default function Chatbot({ messages, setMessages, onBotReply }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    const userMessage = input;
    setInput("");
    try {
      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/admin/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );
      const data = await res.json();
      const reply = data.reply || "Sorry, I don't have an answer.";
      if (onBotReply) onBotReply();
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { from: "bot", text: reply }]);
      }, 800);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, there was an error." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-900/40 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-base font-medium shadow-md whitespace-pre-wrap break-words
                  ${msg.from === "user"
                    ? "bg-gradient-to-br from-cyan-700/80 to-cyan-900/80 text-cyan-100"
                    : "bg-gradient-to-br from-[#232946]/80 to-[#101928]/80 text-white/90 border border-cyan-900/20"}
                `}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="px-4 py-3 border-t border-white/10 bg-white/5 backdrop-blur-md flex gap-2 items-center"
      >
        <motion.textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-cyan-900/30 bg-[#101928]/70 text-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder:text-cyan-100/50 transition shadow-sm"
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.03, boxShadow: "0 0 0 2px #22d3ee55" }}
        />
        <Button
          type="submit"
          size="sm"
          className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-5 py-2 text-base font-semibold shadow-md"
        >
          Send
        </Button>
      </form>
    </>
  );
}
