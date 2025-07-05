"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMessage } from "react-icons/fa6";
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
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 80,
              right: 20,
              width: 380,
              height: 540,
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              borderRadius: 12,
              backgroundColor: "#1e293b",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                backgroundColor: "#334155",
                fontWeight: "600",
                fontSize: 20,
                borderBottom: "1px solid #475569",
                color: "#f1f5f9",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>AuctAsync Chat</span>
              <button
                onClick={handleChatClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#cbd5e1",
                  fontSize: 24,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-label="Close chat"
                title="Close chat"
              >
                ×
              </button>
            </div>

            <Chatbot
              messages={messages}
              setMessages={setMessages}
              onBotReply={handleBotMessage}
            />
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
                style={{
                  position: "fixed",
                  bottom: 80,
                  right: 30,
                  backgroundColor: "#334155",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  zIndex: 9999,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
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
              style={{
                position: "fixed",
                bottom: 30,
                right: 30,
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "rgba(218, 155, 20, 0.16)",
                color: "white",
                fontSize: 28,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                userSelect: "none",
              }}
              aria-label="Open chat"
            >
              <FaMessage />
              {unread && (
                <motion.div
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 12,
                    height: 12,
                    backgroundColor: "#f87171",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 2px white",
                  }}
                />
              )}
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
