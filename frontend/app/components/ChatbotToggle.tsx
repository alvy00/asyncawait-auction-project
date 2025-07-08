"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMessage } from "react-icons/fa6";
import { BsRobot } from "react-icons/bs";
import Chatbot from "./Chatbot";

export default function ChatbotToggle() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleBotMessage = () => {
    if (!open) setUnread(true);
    setTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleChatOpen = () => {
    setOpen(true);
    setUnread(false);
  };

  const handleChatClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-20 right-4 w-[95vw] max-w-[390px] h-[560px] flex flex-col rounded-3xl shadow-2xl z-[9999] overflow-hidden"
            style={{
              boxShadow: "0 8px 40px 0 rgba(0, 255, 255, 0.10), 0 2px 16px 0 rgba(0,0,0,0.25)",
            }}
          >
            {/* Animated glassy gradient background */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,193,195,0.13) 0%, rgba(63,94,251,0.10) 100%)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            />
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/10 pointer-events-none z-10" style={{boxShadow: "0 0 32px 0 rgba(34,211,238,0.10)"}} />
            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#0a192f] via-[#1e293b] to-[#232946] border-b border-cyan-400/10 shadow-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/80 to-blue-600/80 flex items-center justify-center shadow-lg border-2 border-cyan-300/40"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <BsRobot className="text-white text-xl" />
                </motion.div>
                <span className="font-bold text-lg text-cyan-100 tracking-wide drop-shadow">AuctAsync Chat</span>
              </div>
              <button
                onClick={handleChatClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan-900/30 text-cyan-100 text-2xl font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Close chat"
                title="Close chat"
              >
                ×
              </button>
            </div>
            {/* Chatbot body: flex-1 ensures input stays at the bottom */}
            <div className="relative flex-1 flex flex-col z-10 h-0 min-h-0">
              {/* Soft inner shadow */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_8px_32px_0_rgba(34,211,238,0.08)] z-10" />
              <Chatbot
                messages={messages}
                setMessages={setMessages}
                onBotReply={handleBotMessage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <>
            {typing && (
              <motion.div
                key="typingIndicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-24 right-8 bg-cyan-900/80 text-cyan-100 px-4 py-2 rounded-xl text-sm z-[9999] shadow-lg pointer-events-none select-none border border-cyan-700/40 backdrop-blur-md"
              >
                <strong>Typing...</strong>
              </motion.div>
            )}
            <motion.button
              key="chatToggleBtn"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              onClick={handleChatOpen}
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-700 border-4 border-cyan-300/30 shadow-2xl flex items-center justify-center z-[9999] hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 animate-pulse"
              aria-label="Open chat"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl text-white drop-shadow-lg"
              >
                <FaMessage />
              </motion.span>
              {unread && (
                <motion.div
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 w-3.5 h-3.5 bg-pink-500 border-2 border-white rounded-full shadow"
                />
              )}
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
