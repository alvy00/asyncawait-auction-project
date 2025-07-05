"use client";

import React, { useEffect, useRef, useState } from "react";

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
    <div
      style={{
        width: 380,
        height: 540,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        backgroundColor: "#1e293b",
        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
        color: "#f1f5f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b transparent",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                backgroundColor: msg.from === "user" ? "#3b82f6" : "#475569",
                color: msg.from === "user" ? "#e0e7ff" : "#cbd5e1",
                padding: "10px 16px",
                borderRadius: 20,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 15,
                boxShadow:
                  msg.from === "user"
                    ? "0 2px 6px rgba(59, 130, 246, 0.5)"
                    : "0 2px 6px rgba(71, 85, 105, 0.5)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #475569",
          backgroundColor: "#334155",
          display: "flex",
          gap: 12,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            borderRadius: 20,
            border: "none",
            padding: "10px 16px",
            fontSize: 15,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#475569",
            color: "#f1f5f9",
            outline: "none",
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: 20,
            padding: "0 18px",
            color: "#e0e7ff",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(30, 44, 66, 0.7)",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
