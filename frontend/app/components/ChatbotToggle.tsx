"use client"
import React, { useState } from "react";
import Chatbot from "./Chatbot";

export default function ChatbotToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 360,
            height: 520,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            borderRadius: 12,
            backgroundColor: "#1a202c", // dark blue-gray (AuctAsync style)
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 15px",
              backgroundColor: "#2d3748", // slightly lighter header
              color: "#edf2f7",
              fontWeight: "600",
              fontSize: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            AuctAsync Chat
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#edf2f7",
                fontSize: "22px",
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <Chatbot />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#3182ce", // AuctAsync blue
          color: "white",
          fontSize: 28,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
          zIndex: 9999,
          display: open ? "none" : "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        aria-label="Open chat"
      >
        💬
      </button>
    </>
  );
}
