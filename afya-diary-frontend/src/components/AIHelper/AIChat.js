import React, { useState, useRef, useEffect } from "react";
import PatientLayout from "../PatientLayout";
import { FONTS, BASE_STYLES } from "../Shared/UI";

const C = {
  em900: "#064e3b", em700: "#047857", em600: "#059669", em500: "#10b981",
  em100: "#d1fae5", em50: "#ecfdf5",
  sl900: "#0f172a", sl700: "#334155", sl600: "#475569", sl500: "#64748b",
  sl400: "#94a3b8", sl300: "#cbd5e1", sl200: "#e2e8f0", sl100: "#f1f5f9",
  sl50: "#f8fafc", white: "#ffffff",
};

const Ic = ({ d, size = 18, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SEND_ICON  = "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z";
const BOT_ICON   = "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z";

const INITIAL_MESSAGES = [
  {
    from: "ai",
    text: "Hello. I am Afya Assistant, your mental wellness support for AfyaDiary Kenya. I am here to listen and to help you think through what you are experiencing. How are you feeling today?",
  },
];

const QUICK_PROMPTS = [
  "I am feeling anxious",
  "I need help managing stress",
  "I have not been sleeping well",
  "I want some wellness tips",
];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "12px 14px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: C.sl400,
          animation: `bounce .9s ease infinite`,
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const updated = [...messages, { from: "user", text: userText }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are Afya Assistant, a warm and supportive mental wellness companion for AfyaDiary Kenya. You help patients and healthcare workers manage stress, anxiety, and emotional wellbeing. You speak in clear, simple English appropriate for Kenyan users. You never diagnose, but you listen, validate, and provide evidence-based coping strategies. Always recommend professional help for serious conditions. Keep responses concise and human.`,
          messages: updated.map(m => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const reply = data?.content?.[0]?.text || "I am sorry, I could not respond right now. Please try again.";
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        from: "ai",
        text: "I am having trouble connecting right now. Please check your connection and try again.",
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .chat-wrap {
          display: flex; flex-direction: column;
          height: calc(100vh - 130px); max-height: 700px; min-height: 400px;
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 12;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: ${C.sl300}; border-radius: 2px; }
        .msg-ai {
          align-self: flex-start; max-width: 76%;
          background: ${C.white}; border: 1px solid ${C.sl200};
          border-radius: 4px 14px 14px 14px;
          padding: 12px 14px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
        }
        .msg-user {
          align-self: flex-end; max-width: 76%;
          background: ${C.em600}; color: #fff;
          border-radius: 14px 14px 4px 14px;
          padding: 12px 14px;
        }
        .chat-input-area {
          border-top: 1px solid ${C.sl200}; padding: 14px 16px;
          background: ${C.white}; flex-shrink: 0;
        }
        .chat-input-row {
          display: flex; gap: 10px; align-items: flex-end;
        }
        .chat-input-box {
          flex: 1; padding: 10px 14px; border-radius: 9px;
          border: 1.5px solid ${C.sl200}; resize: none; outline: none;
          font-family: 'DM Sans',system-ui,sans-serif; font-size: .875rem;
          color: ${C.sl900}; line-height: 1.5; max-height: 120px;
          background: ${C.sl50}; transition: all .15s;
        }
        .chat-input-box:focus {
          border-color: ${C.em500}; background: ${C.white};
          box-shadow: 0 0 0 3px rgba(16,185,129,.1);
        }
        .chat-input-box::placeholder { color: ${C.sl400}; }
        .send-btn {
          width: 40px; height: 40px; border-radius: 9px; border: none;
          background: ${C.em600}; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all .15s;
        }
        .send-btn:hover:not(:disabled) { background: ${C.em700}; }
        .send-btn:disabled { background: ${C.sl300}; cursor: not-allowed; }
        @media (max-width: 640px) {
          .msg-ai, .msg-user { max-width: 90%; }
          .chat-wrap { height: calc(100vh - 110px); }
        }
      `}</style>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: ".68rem", fontWeight: 700, color: C.em600, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
          Mental Wellness
        </div>
        <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.75rem)", fontWeight: 400, color: C.sl900 }}>
          Afya Wellness Assistant
        </h1>
        <p style={{ fontSize: ".855rem", color: C.sl500, marginTop: 4 }}>
          A private space to talk through what you are feeling. Not a substitute for professional care.
        </p>
      </div>

      <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sl200}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
        {/* Header bar */}
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.sl100}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.em50, border: `1px solid ${C.em100}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic d={BOT_ICON} size={16} stroke={C.em600} />
          </div>
          <div>
            <div style={{ fontSize: ".875rem", fontWeight: 600, color: C.sl900 }}>Afya Assistant</div>
            <div style={{ fontSize: ".72rem", color: C.em600 }}>Available now</div>
          </div>
        </div>

        <div className="chat-wrap">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "ai" ? "msg-ai" : "msg-user"}>
                <p style={{ fontSize: ".875rem", lineHeight: 1.7, margin: 0, color: m.from === "ai" ? C.sl700 : "#fff" }}>
                  {m.text}
                </p>
              </div>
            ))}
            {loading && (
              <div className="msg-ai">
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  style={{
                    padding: "7px 13px", borderRadius: 999, border: `1.5px solid ${C.sl200}`,
                    background: C.white, fontSize: ".78rem", color: C.sl600,
                    cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif",
                    transition: "all .15s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = C.em500; e.currentTarget.style.color = C.em600; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.color = C.sl600; }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <div className="chat-input-row">
              <textarea
                ref={inputRef}
                className="chat-input-box"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()} aria-label="Send">
                <Ic d={SEND_ICON} size={16} stroke="#fff" />
              </button>
            </div>
            <div style={{ fontSize: ".72rem", color: C.sl400, marginTop: 8, lineHeight: 1.5 }}>
              This is not a crisis service. If you are in danger, call 999 or visit your nearest health facility.
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}