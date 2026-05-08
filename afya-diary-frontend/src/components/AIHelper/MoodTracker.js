import React, { useState, useEffect } from "react";
import PatientLayout from "../PatientLayout";
import { FONTS, BASE_STYLES } from "../Shared/UI";

const C = {
  em700: "#047857", em600: "#059669", em500: "#10b981", em100: "#d1fae5", em50: "#ecfdf5",
  sl900: "#0f172a", sl700: "#334155", sl600: "#475569", sl500: "#64748b",
  sl400: "#94a3b8", sl300: "#cbd5e1", sl200: "#e2e8f0", sl100: "#f1f5f9",
  sl50: "#f8fafc", white: "#ffffff",
};

const MOODS = [
  { value: 5, label: "Very good",    color: "#059669", bg: "#ecfdf5" },
  { value: 4, label: "Good",         color: "#0284c7", bg: "#e0f2fe" },
  { value: 3, label: "Neutral",      color: "#d97706", bg: "#fef3c7" },
  { value: 2, label: "Low",          color: "#7c3aed", bg: "#ede9fe" },
  { value: 1, label: "Very low",     color: "#dc2626", bg: "#fee2e2" },
];

const MOOD_BAR_COLORS = {
  5: "#059669", 4: "#0284c7", 3: "#d97706", 2: "#7c3aed", 1: "#dc2626",
};

const STORAGE_KEY = "afya_mood_log";

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

export default function MoodTracker() {
  const [entries, setEntries]       = useState(loadEntries);
  const [selected, setSelected]     = useState(null);
  const [note, setNote]             = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [view, setView]             = useState("log"); // "log" | "history"

  useEffect(() => { saveEntries(entries); }, [entries]);

  const handleSave = () => {
    if (!selected) return;
    setSaving(true);
    setTimeout(() => {
      const entry = {
        id: Date.now(),
        value: selected,
        label: MOODS.find(m => m.value === selected)?.label || "",
        note: note.trim(),
        date: new Date().toISOString(),
      };
      setEntries(prev => [entry, ...prev]);
      setSelected(null);
      setNote("");
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const deleteEntry = id => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const last7 = entries.slice(0, 7).reverse();
  const avgValue = entries.length
    ? (entries.slice(0, 7).reduce((s, e) => s + e.value, 0) / Math.min(entries.length, 7)).toFixed(1)
    : null;

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .mood-btn {
          flex: 1; padding: 14px 8px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: #fff; cursor: pointer; transition: all .18s; text-align: center;
          font-family: 'DM Sans',system-ui,sans-serif; min-width: 0;
        }
        .mood-btn:hover { border-color: #10b981; }
        .mood-btn.selected { border-width: 2px; }
        .tab-btn {
          padding: 8px 20px; border-radius: 8px; border: none;
          font-family: 'DM Sans',system-ui,sans-serif; font-size: .875rem;
          font-weight: 500; cursor: pointer; transition: all .15s;
        }
        .history-item {
          background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
          padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.04);
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 12px; flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .mood-btn { padding: 10px 4px; }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: ".68rem", fontWeight: 700, color: C.em600, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
          Mental Wellness
        </div>
        <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.75rem)", fontWeight: 400, color: C.sl900, marginBottom: 6 }}>
          Mood Tracker
        </h1>
        <p style={{ fontSize: ".855rem", color: C.sl500, lineHeight: 1.65 }}>
          Record how you feel each day to identify patterns and support your wellbeing.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22, background: C.sl100, padding: 4, borderRadius: 10, width: "fit-content" }}>
        {[["log","Log Mood"],["history","History"]].map(([v, label]) => (
          <button key={v} className="tab-btn" onClick={() => setView(v)}
            style={{
              background: view === v ? C.white : "none",
              color: view === v ? C.sl900 : C.sl500,
              boxShadow: view === v ? "0 1px 4px rgba(0,0,0,.07)" : "none",
            }}>
            {label} {v === "history" && entries.length > 0 && `(${entries.length})`}
          </button>
        ))}
      </div>

      {view === "log" && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sl200}`, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", marginBottom: 16 }}>
            <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl700, marginBottom: 16 }}>
              How are you feeling right now?
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {MOODS.map(mood => (
                <button
                  key={mood.value}
                  className={`mood-btn${selected === mood.value ? " selected" : ""}`}
                  onClick={() => setSelected(mood.value)}
                  style={{
                    borderColor: selected === mood.value ? mood.color : C.sl200,
                    background: selected === mood.value ? mood.bg : C.white,
                  }}
                >
                  <div style={{
                    fontSize: ".72rem", fontWeight: 600,
                    color: selected === mood.value ? mood.color : C.sl500,
                    lineHeight: 1.3,
                  }}>
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
              <label style={{ fontSize: ".74rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What is on your mind today?"
                rows={3}
                style={{
                  padding: "10px 13px", borderRadius: 8, border: `1.5px solid ${C.sl200}`,
                  fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem",
                  color: C.sl900, outline: "none", resize: "vertical", lineHeight: 1.6,
                }}
                onFocus={e => { e.target.style.borderColor = C.em500; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,.1)"; }}
                onBlur={e => { e.target.style.borderColor = C.sl200; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button
              disabled={!selected || saving}
              onClick={handleSave}
              style={{
                width: "100%", padding: "12px", borderRadius: 9, border: "none",
                background: (!selected || saving) ? C.sl300 : C.em600, color: "#fff",
                cursor: (!selected || saving) ? "not-allowed" : "pointer",
                fontWeight: 600, fontSize: ".9rem", fontFamily: "'DM Sans',system-ui,sans-serif",
                transition: "all .2s",
                boxShadow: selected && !saving ? "0 2px 8px rgba(5,150,105,.25)" : "none",
              }}
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save Mood Entry"}
            </button>
          </div>

          {/* 7-day average */}
          {entries.length > 0 && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize: ".76rem", fontWeight: 700, color: C.sl500, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
                7-Day Overview
              </div>
              <div style={{ display: "flex", align: "flex-end", gap: 6, height: 80, alignItems: "flex-end", marginBottom: 12 }}>
                {last7.map((entry, i) => {
                  const barH = (entry.value / 5) * 100;
                  const color = MOOD_BAR_COLORS[entry.value] || C.em600;
                  return (
                    <div key={entry.id || i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: "100%", height: `${barH}%`, borderRadius: "4px 4px 0 0",
                        background: color, minHeight: 8, transition: "height .3s ease",
                      }} title={entry.label} />
                      <div style={{ fontSize: ".62rem", color: C.sl400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                        {formatDate(entry.date).split(",")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
              {avgValue && (
                <div style={{ fontSize: ".82rem", color: C.sl500 }}>
                  7-day average: <strong style={{ color: C.sl900 }}>{avgValue} / 5</strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {view === "history" && (
        <div style={{ maxWidth: 600 }}>
          {entries.length === 0 ? (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: ".95rem", fontWeight: 600, color: C.sl700, marginBottom: 6 }}>No entries yet</div>
              <div style={{ fontSize: ".82rem", color: C.sl500 }}>Switch to the Log Mood tab to record your first entry.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {entries.map(entry => {
                const mood = MOODS.find(m => m.value === entry.value);
                return (
                  <div key={entry.id} className="history-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: entry.note ? 8 : 0, flexWrap: "wrap" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 10px", borderRadius: 999,
                          fontSize: ".74rem", fontWeight: 700,
                          background: mood?.bg || C.sl100, color: mood?.color || C.sl600,
                        }}>
                          {entry.label}
                        </span>
                        <span style={{ fontSize: ".76rem", color: C.sl400 }}>
                          {formatDate(entry.date)} at {formatTime(entry.date)}
                        </span>
                      </div>
                      {entry.note && (
                        <p style={{ fontSize: ".855rem", color: C.sl600, lineHeight: 1.65, margin: 0 }}>{entry.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: C.sl400, padding: 4, borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center" }}
                      aria-label="Delete entry"
                      onMouseOver={e => { e.currentTarget.style.color = "#dc2626"; }}
                      onMouseOut={e => { e.currentTarget.style.color = C.sl400; }}
                    >
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PatientLayout>
  );
}