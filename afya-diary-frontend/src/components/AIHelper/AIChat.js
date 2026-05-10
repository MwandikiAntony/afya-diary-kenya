import React, { useState, useRef, useEffect, useCallback } from "react";
import PatientLayout from "../PatientLayout";
import { FONTS, BASE_STYLES } from "../Shared/UI";
import { AfyaChat } from "../../utils/afya";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",
  em400:"#34d399",em100:"#d1fae5",em50:"#ecfdf5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl300:"#cbd5e1",sl200:"#e2e8f0",sl100:"#f1f5f9",
  sl50:"#f8fafc",white:"#ffffff",
};

const Ic = ({ d, size = 18, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  send:  "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  mic:   "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8",
  micOff:"M1 1l22 22 M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6 M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23 M12 19v4 M8 23h8",
  bot:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3-8.59A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  stop:  "M18 6L6 18 M6 6l12 12",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
};

// Status badge colours
const STATUS_STYLE = {
  idle:         { bg: C.sl100, color: C.sl500, label: "Not connected" },
  connecting:   { bg: "#fef3c7", color: "#b45309", label: "Connecting..." },
  connected:    { bg: "#e0f2fe", color: C.sky600, label: "Connected" },
  ready:        { bg: C.em50, color: C.em600, label: "AFYA ready" },
  disconnected: { bg: C.sl100, color: C.sl500, label: "Disconnected" },
  error:        { bg: "#fee2e2", color: "#b91c1c", label: "Error" },
};

function TypingIndicator() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"12px 14px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%", background:C.sl400,
          animation:"afya-bounce .9s ease infinite",
          animationDelay:`${i*0.18}s`,
        }} />
      ))}
    </div>
  );
}

export default function AIChat() {
  const [status,      setStatus]      = useState("idle");
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMode,   setIsMicMode]   = useState(false); // true = PCM mic, false = text
  const [isTyping,    setIsTyping]    = useState(false);
  const [hint,        setHint]        = useState(null);
  const [metrics,     setMetrics]     = useState(null);

  const afyaRef    = useRef(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isTyping]);

  const addMessage = useCallback((role, text) => {
    setMessages(prev => [...prev, { role, text, ts: Date.now() }]);
  }, []);

  // ── Connect to AFYA backend ──────────────────────────────────────────────

  const startChat = useCallback(() => {
    if (afyaRef.current?.isConnected) return;
    setStatus("connecting");

    const afya = new AfyaChat({
      onConnected: () => {
        setStatus("connected");
      },
      onGreeting: () => {
        setStatus("ready");
        setIsTyping(false);
      },
      onText: (text, role) => {
        setIsTyping(false);
        if (text?.trim()) {
          addMessage(role === "user" ? "user" : "afya", text);
        }
      },
      onAudio: () => {
        setIsTyping(false);
      },
      onCoachHint: (h) => {
        setHint(h);
        setTimeout(() => setHint(null), 6000);
      },
      onCoachMetrics: (m) => {
        setMetrics(m);
      },
      onError: (msg) => {
        setStatus("error");
        addMessage("system", msg);
      },
      onClose: () => {
        setStatus("disconnected");
        setIsRecording(false);
        setIsMicMode(false);
        setIsTyping(false);
      },
    });

    afya.connect();
    afyaRef.current = afya;

    // Show welcome after connect
    setIsTyping(true);
    addMessage("afya", "Hello. I am AFYA Diary, your personal healthcare companion. I can help you find nearby health services, guide you through wellness exercises, answer questions about medications, and more. How can I help you today?");
    setIsTyping(false);
  }, [addMessage]);

  const stopChat = useCallback(() => {
    afyaRef.current?.stopMic();
    afyaRef.current?.stopMediaRecorder();
    afyaRef.current?.disconnect();
    afyaRef.current = null;
    setStatus("disconnected");
    setIsRecording(false);
    setIsMicMode(false);
    setIsTyping(false);
  }, []);

  // ── Text send ─────────────────────────────────────────────────────────────

  const sendText = useCallback(() => {
    const text = input.trim();
    if (!text || !afyaRef.current?.isConnected) return;

    addMessage("user", text);
    setInput("");
    setIsTyping(true);

    // Send as a text control message to the backend
    afyaRef.current.send({
      type:      "control",
      action:    "text_input",
      text,
      timestamp: Date.now() / 1000,
    });
  }, [input, addMessage]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  // ── Voice (MediaRecorder — 250ms webm chunks per PDF spec) ───────────────

  const startVoice = useCallback(async () => {
    if (!afyaRef.current?.isConnected) {
      addMessage("system", "Please start AFYA first before using voice.");
      return;
    }
    const recorder = await afyaRef.current.startMediaRecorder();
    if (recorder) {
      setIsRecording(true);
      setIsMicMode(false);
    }
  }, [addMessage]);

  const stopVoice = useCallback(() => {
    afyaRef.current?.stopMediaRecorder();
    setIsRecording(false);
  }, []);

  // ── PCM Mic (ScriptProcessor — lower latency, for continuous use) ─────────

  const startPCMMic = useCallback(async () => {
    if (!afyaRef.current?.isConnected) {
      addMessage("system", "Please start AFYA first before using the microphone.");
      return;
    }
    await afyaRef.current.startMic();
    setIsMicMode(true);
    setIsRecording(false);
  }, [addMessage]);

  const stopPCMMic = useCallback(() => {
    afyaRef.current?.stopMic();
    setIsMicMode(false);
  }, []);

  // ── Find nearby hospitals ─────────────────────────────────────────────────

  const findHospitals = useCallback(async () => {
    if (!afyaRef.current) return;
    addMessage("system", "Locating nearby health facilities...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          afyaRef.current?.sendGPS(lat, lng, pos.coords.accuracy);
          const result = await afyaRef.current?.findServices(lat, lng, "hospital");
          if (result?.facilities?.length > 0) {
            const names = result.facilities.slice(0, 3).map(f => f.name || f.label).join(", ");
            addMessage("afya", `Nearby health facilities found: ${names}. I have shared your location with AFYA to guide you there.`);
          } else {
            addMessage("afya", "I could not find nearby facilities in the response. Please check the Health Services page for a full map.");
          }
        },
        () => addMessage("system", "Location access denied. Please enable GPS to find nearby facilities.")
      );
    } else {
      addMessage("system", "Geolocation is not supported by your browser.");
    }
  }, [addMessage]);

  const statusStyle = STATUS_STYLE[status] || STATUS_STYLE.idle;
  const canChat = status === "ready" || status === "connected";

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        @keyframes afya-bounce {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-6px)}
        }
        .chat-shell {
          display:flex;flex-direction:column;
          height:calc(100vh - 120px);max-height:720px;min-height:420px;
          background:${C.white};border-radius:16px;
          border:1px solid ${C.sl200};box-shadow:0 1px 4px rgba(0,0,0,.04);
          overflow:hidden;
        }
        .chat-header {
          padding:14px 18px;border-bottom:1px solid ${C.sl100};
          display:flex;align-items:center;justify-content:space-between;
          flex-shrink:0;gap:10px;flex-wrap:wrap;
        }
        .chat-messages {
          flex:1;overflow-y:auto;padding:16px 18px;
          display:flex;flex-direction:column;gap:10px;
          scroll-behavior:smooth;
        }
        .chat-messages::-webkit-scrollbar{width:4px}
        .chat-messages::-webkit-scrollbar-thumb{background:${C.sl300};border-radius:2px}
        .msg-afya {
          align-self:flex-start;max-width:78%;
          background:${C.sl50};border:1px solid ${C.sl200};
          border-radius:4px 14px 14px 14px;
          padding:11px 14px;box-shadow:0 1px 3px rgba(0,0,0,.04);
        }
        .msg-user {
          align-self:flex-end;max-width:78%;
          background:${C.em600};color:#fff;
          border-radius:14px 14px 4px 14px;
          padding:11px 14px;
        }
        .msg-system {
          align-self:center;max-width:90%;
          background:#fef3c7;border:1px solid #f59e0b30;
          border-radius:8px;padding:8px 14px;font-size:.78rem;color:#92400e;
          text-align:center;
        }
        .chat-footer {
          border-top:1px solid ${C.sl200};padding:12px 16px;
          background:${C.white};flex-shrink:0;
        }
        .chat-input-row {
          display:flex;gap:8px;align-items:flex-end;
        }
        .chat-textarea {
          flex:1;padding:10px 13px;border-radius:9px;
          border:1.5px solid ${C.sl200};resize:none;outline:none;
          font-family:'DM Sans',system-ui,sans-serif;font-size:.875rem;
          color:${C.sl900};line-height:1.5;max-height:100px;
          background:${C.sl50};transition:all .15s;
        }
        .chat-textarea:focus{border-color:${C.em500};background:${C.white};box-shadow:0 0 0 3px rgba(16,185,129,.1)}
        .chat-textarea::placeholder{color:${C.sl400}}
        .icon-btn {
          width:38px;height:38px;border-radius:9px;border:none;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;transition:all .15s;
        }
        .hint-bar {
          margin-bottom:10px;padding:10px 14px;border-radius:10px;
          font-size:.82rem;font-weight:500;line-height:1.5;
          animation:fadeUp .3s ease both;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:640px){
          .chat-shell{height:calc(100vh - 100px)}
          .msg-afya,.msg-user{max-width:92%}
          .chat-header{padding:10px 14px}
        }
      `}</style>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:".68rem", fontWeight:700, color:C.em600, textTransform:"uppercase", letterSpacing:".12em", marginBottom:4 }}>
          Mental Wellness
        </div>
        <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(1.3rem,2.5vw,1.75rem)", fontWeight:400, color:C.sl900, marginBottom:4 }}>
          Afya Wellness Assistant
        </h1>
        <p style={{ fontSize:".855rem", color:C.sl500, lineHeight:1.65 }}>
          Real-time AI voice and text support. Not a substitute for professional medical care.
        </p>
      </div>

      {/* Coach hint notification */}
      {hint && (
        <div className="hint-bar" style={{
          background: hint.hint_type === "good" ? C.em50 : hint.hint_type === "warn" ? "#fef3c7" : C.sky100,
          border: `1px solid ${hint.hint_type === "good" ? C.em200 : hint.hint_type === "warn" ? "#f59e0b30" : "#bae6fd"}`,
          color: hint.hint_type === "good" ? C.em700 : hint.hint_type === "warn" ? "#92400e" : C.sky600,
        }}>
          {hint.hint}
        </div>
      )}

      <div className="chat-shell">
        {/* Header */}
        <div className="chat-header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.em50, border:`1px solid ${C.em100}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ic d={ICONS.bot} size={17} stroke={C.em600} />
            </div>
            <div>
              <div style={{ fontSize:".9rem", fontWeight:600, color:C.sl900 }}>AFYA Assistant</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:statusStyle.bg, color:statusStyle.color, fontSize:".68rem", fontWeight:600, padding:"2px 8px", borderRadius:999 }}>
                {status === "connecting" || status === "connected" ? (
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"currentColor", display:"inline-block", animation:"afya-bounce 1.2s infinite" }} />
                ) : null}
                {statusStyle.label}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {status === "idle" || status === "disconnected" || status === "error" ? (
              <button onClick={startChat}
                style={{ padding:"7px 16px", borderRadius:8, border:"none", background:C.em600, color:"#fff", fontSize:".8rem", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',system-ui,sans-serif", boxShadow:`0 2px 8px ${C.em600}30` }}>
                Start AFYA
              </button>
            ) : (
              <button onClick={stopChat}
                style={{ padding:"7px 16px", borderRadius:8, border:`1.5px solid ${C.sl200}`, background:"none", color:C.sl600, fontSize:".8rem", fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Disconnect
              </button>
            )}
            {canChat && (
              <button onClick={findHospitals}
                style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${C.sky600}20`, background:C.sky100, color:C.sky600, fontSize:".78rem", fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Find Hospitals
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:C.sl400, textAlign:"center", padding:"32px 16px", gap:10 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:C.sl100, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic d={ICONS.bot} size={24} stroke={C.sl400} />
              </div>
              <div style={{ fontSize:".9rem", fontWeight:500, color:C.sl600 }}>Click Start AFYA to begin</div>
              <div style={{ fontSize:".8rem", color:C.sl400, lineHeight:1.65, maxWidth:280 }}>
                Voice and text wellness support, powered by Gemini Live AI.
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i}
              className={m.role === "user" ? "msg-user" : m.role === "system" ? "msg-system" : "msg-afya"}>
              <p style={{ fontSize:".875rem", lineHeight:1.72, margin:0, color: m.role === "user" ? "#fff" : m.role === "system" ? undefined : C.sl700 }}>
                {m.text}
              </p>
            </div>
          ))}

          {isTyping && (
            <div className="msg-afya">
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts when ready */}
        {canChat && messages.length <= 1 && (
          <div style={{ padding:"0 16px 10px", display:"flex", flexWrap:"wrap", gap:7 }}>
            {["I feel anxious","Help me sleep better","Find a clinic near me","I need a wellness check"].map(p => (
              <button key={p} onClick={() => { setInput(p); inputRef.current?.focus(); }}
                style={{ padding:"6px 12px", borderRadius:999, border:`1.5px solid ${C.sl200}`, background:C.white, fontSize:".76rem", color:C.sl600, cursor:"pointer", fontFamily:"'DM Sans',system-ui,sans-serif", transition:"all .15s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor=C.em500; e.currentTarget.style.color=C.em600; }}
                onMouseOut={e => { e.currentTarget.style.borderColor=C.sl200; e.currentTarget.style.color=C.sl600; }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Footer — input area */}
        <div className="chat-footer">
          <div className="chat-input-row">
            {/* Mic buttons */}
            {canChat && (
              <>
                {/* MediaRecorder voice (250ms chunks per spec) */}
                <button className="icon-btn"
                  title={isRecording ? "Stop recording" : "Send voice message"}
                  onClick={isRecording ? stopVoice : startVoice}
                  style={{ background: isRecording ? "#fee2e2" : C.sl100, color: isRecording ? "#dc2626" : C.sl600 }}>
                  <Ic d={isRecording ? ICONS.stop : ICONS.mic} size={17} />
                </button>

                {/* PCM mic (continuous live stream) */}
                <button className="icon-btn"
                  title={isMicMode ? "Stop live mic" : "Start live voice stream"}
                  onClick={isMicMode ? stopPCMMic : startPCMMic}
                  style={{ background: isMicMode ? C.em50 : C.sl100, color: isMicMode ? C.em600 : C.sl600, border: isMicMode ? `1.5px solid ${C.em200}` : "none" }}>
                  <Ic d={isMicMode ? ICONS.phone : ICONS.micOff} size={17} />
                </button>
              </>
            )}

            {/* Text input */}
            <textarea
              ref={inputRef}
              className="chat-textarea"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={canChat ? "Type a message..." : "Start AFYA to begin chatting"}
              disabled={!canChat}
            />

            {/* Send */}
            <button className="icon-btn"
              title="Send message"
              disabled={!canChat || !input.trim()}
              onClick={sendText}
              style={{ background: (canChat && input.trim()) ? C.em600 : C.sl200, color: (canChat && input.trim()) ? "#fff" : C.sl400, cursor: (canChat && input.trim()) ? "pointer" : "not-allowed" }}>
              <Ic d={ICONS.send} size={16} stroke="currentColor" />
            </button>
          </div>

          {/* Live indicators */}
          <div style={{ display:"flex", gap:14, marginTop:8, flexWrap:"wrap" }}>
            {isMicMode && (
              <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:".72rem", color:C.em600 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:C.em500, display:"inline-block", animation:"afya-bounce 1.2s infinite" }} />
                Live voice stream active
              </div>
            )}
            {isRecording && (
              <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:".72rem", color:"#dc2626" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#dc2626", display:"inline-block", animation:"afya-bounce 1.2s infinite" }} />
                Recording voice message
              </div>
            )}
            {!isMicMode && !isRecording && canChat && (
              <div style={{ fontSize:".72rem", color:C.sl400 }}>
                Press Enter to send. Use mic buttons for voice.
              </div>
            )}
            <div style={{ marginLeft:"auto", fontSize:".7rem", color:C.sl400 }}>
              Not a medical service. In an emergency call 999.
            </div>
          </div>
        </div>
      </div>

      {/* Coach metrics strip (shown when coaching session active) */}
      {metrics && (
        <div style={{ marginTop:16, background:C.white, borderRadius:14, border:`1px solid ${C.sl200}`, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ fontSize:".72rem", fontWeight:700, color:C.sl500, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>
            Live Coaching Metrics
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12 }}>
            {[
              ["Speaking Rate", `${metrics.speakingRate || 0} wpm`],
              ["Eye Contact",   `${metrics.eyeContactScore || 0}%`],
              ["Posture",       `${metrics.postureScore || 0}%`],
              ["Energy",        `${metrics.energyScore || 0}%`],
              ["Confidence",    `${metrics.confidenceScore || 0}%`],
              ["Filler Words",  metrics.fillerWordCount ?? 0],
            ].map(([label, value]) => (
              <div key={label} style={{ background:C.sl50, borderRadius:9, padding:"10px 12px" }}>
                <div style={{ fontSize:".68rem", fontWeight:700, color:C.sl500, textTransform:"uppercase", letterSpacing:".06em", marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:"1.1rem", fontWeight:600, color:C.sl900, fontFamily:"'Fraunces',Georgia,serif" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PatientLayout>
  );
}