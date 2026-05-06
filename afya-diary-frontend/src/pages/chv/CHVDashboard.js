import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CHVLayout from "../../components/CHVLayout";
import api from "../../utils/api";

const C = {
  pur900:"#4A148C",pur800:"#6A1B9A",pur600:"#8E24AA",pur400:"#CE93D8",pur100:"#F3E5F5",pur50:"#faf5ff",
  em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  amber500:"#f59e0b",amber100:"#fef3c7",amber600:"#d97706",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",
  red600:"#dc2626",red100:"#fee2e2",
  white:"#ffffff",bg:"#f6f8f7",
};

function StatCard({ icon, label, value, bg, warn }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1.5px solid ${warn ? C.amber500 + "50" : C.sl200}`, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .2s" }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.08)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.7rem", fontWeight: 400, color: C.sl900, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: ".72rem", color: C.sl500, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function CHVDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients]   = useState([]);
  const [reminders, setReminders] = useState([]);

  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

  useEffect(() => {
    api.get("/patients/assigned").then(({ data }) => setPatients(data || [])).catch(() => {});
    api.get("/chv/reminders/assigned").then(({ data }) => setReminders(data || [])).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const pendingReminders = reminders.filter(r => !r.sent);
  const overdueReminders = reminders.filter(r => !r.sent && new Date(r.dueDate) < new Date());

  return (
    <CHVLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp .4s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}
        .btn-pur{background:${C.pur600};color:#fff;padding:9px 16px;border-radius:8px;border:none;cursor:pointer;font-weight:500;font-size:.82rem;font-family:'DM Sans',system-ui,sans-serif;transition:all .2s;box-shadow:0 2px 8px rgba(142,36,170,.25);white-space:nowrap}
        .btn-pur:hover{background:${C.pur800};transform:translateY(-1px)}
        .btn-out{background:none;color:${C.sl600};padding:9px 16px;border-radius:8px;border:1.5px solid ${C.sl200};cursor:pointer;font-size:.82rem;font-family:'DM Sans',system-ui,sans-serif;transition:all .15s;white-space:nowrap}
        .btn-out:hover{border-color:${C.pur400};color:${C.pur600}}
        @media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}.chv-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Header */}
      <div className="fade" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.pur600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>CHV Dashboard</div>
        <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: C.sl900 }}>
          {greeting}, {user.name?.split(" ")[0] || "CHV"} 🌿
        </h1>
        <p style={{ color: C.sl500, fontSize: ".855rem", marginTop: 4 }}>
          {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="fade d1 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Assigned Patients"  value={patients.length}          bg={C.pur100} />
        <StatCard icon="⏰" label="Pending Reminders"  value={pendingReminders.length}   bg={C.amber100} warn={pendingReminders.length > 0} />
        <StatCard icon="🚨" label="Overdue"             value={overdueReminders.length}   bg={C.red100}   warn={overdueReminders.length > 0} />
        <StatCard icon="✅" label="Sent Today"           value={reminders.filter(r => r.sent && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length} bg={C.em50} />
      </div>

      {/* Overdue alert */}
      {overdueReminders.length > 0 && (
        <div style={{ background: C.red100, border: `1px solid ${C.red600}30`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.2rem" }}>🚨</span>
          <div>
            <span style={{ fontSize: ".855rem", fontWeight: 600, color: "#7f1d1d" }}>
              {overdueReminders.length} overdue reminder{overdueReminders.length > 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: ".84rem", color: "#991b1b" }}> require your attention.</span>
          </div>
          <button onClick={() => navigate("/chv-reminders")} className="btn-out" style={{ marginLeft: "auto" }}>View All</button>
        </div>
      )}

      {/* Main grid */}
      <div className="chv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Assigned Patients */}
        <div className="fade d2" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.sl100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em" }}>Assigned Patients</div>
            <button className="btn-pur" style={{ padding: "6px 12px", fontSize: ".74rem" }} onClick={() => navigate("/chv-patients")}>View All</button>
          </div>
          {patients.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>👥</div>
              <div style={{ color: C.sl400, fontSize: ".875rem" }}>No patients assigned yet</div>
            </div>
          ) : (
            <div style={{ overflow: "auto", maxHeight: 340 }}>
              {patients.slice(0, 8).map((p, i) => (
                <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: `1px solid ${C.sl100}`, transition: "background .1s", cursor: "pointer" }}
                  onMouseOver={e => { e.currentTarget.style.background = C.sl50; }}
                  onMouseOut={e => { e.currentTarget.style.background = "none"; }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: [C.pur100,C.em50,C.sky100,C.amber100][i % 4], display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 700, color: [C.pur600,C.em600,C.sky600,C.amber600][i % 4], flexShrink: 0 }}>
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".855rem", fontWeight: 500, color: C.sl900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: ".76rem", color: C.sl400 }}>{p.phone}</div>
                  </div>
                  {p.shaNumber && (
                    <div style={{ fontSize: ".7rem", color: C.sl400, fontFamily: "monospace" }}>{p.shaNumber}</div>
                  )}
                </div>
              ))}
              {patients.length > 8 && (
                <div style={{ padding: "12px 18px", textAlign: "center", fontSize: ".8rem", color: C.pur600, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("/chv-patients")}>
                  View {patients.length - 8} more patients
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reminders */}
        <div className="fade d3" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.sl100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em" }}>Upcoming Reminders</div>
            <span style={{ fontSize: ".72rem", color: C.sl400 }}>{reminders.length} total</span>
          </div>
          {reminders.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>⏰</div>
              <div style={{ color: C.sl400, fontSize: ".875rem" }}>No reminders yet</div>
            </div>
          ) : (
            <div style={{ overflow: "auto", maxHeight: 340 }}>
              {reminders.slice(0, 6).map(r => {
                const isOverdue = !r.sent && new Date(r.dueDate) < new Date();
                return (
                  <div key={r._id} style={{ padding: "14px 18px", borderBottom: `1px solid ${C.sl100}`, borderLeft: `3px solid ${r.sent ? C.em500 : isOverdue ? C.red600 : C.amber500}`, transition: "background .1s" }}
                    onMouseOver={e => { e.currentTarget.style.background = C.sl50; }}
                    onMouseOut={e => { e.currentTarget.style.background = "none"; }}>
                    <div style={{ fontSize: ".855rem", fontWeight: 500, color: C.sl900, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: ".76rem", color: C.sl400 }}>{new Date(r.dueDate).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      <span style={{
                        fontSize: ".7rem", fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                        background: r.sent ? C.em50 : isOverdue ? C.red100 : C.amber100,
                        color: r.sent ? C.em600 : isOverdue ? C.red600 : C.amber600,
                      }}>
                        {r.sent ? "Sent" : isOverdue ? "Overdue" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {reminders.length > 6 && (
                <div style={{ padding: "12px 18px", textAlign: "center", fontSize: ".8rem", color: C.pur600, cursor: "pointer", fontWeight: 500 }}>
                  View {reminders.length - 6} more reminders
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        {[
          { icon: "📝", label: "Submit Report", desc: "Record a household visit", to: "/chv-reports", color: C.pur600, bg: C.pur100 },
          { icon: "👥", label: "My Patients",   desc: "View full patient list",  to: "/chv-patients", color: C.em600, bg: C.em50 },
          { icon: "🧠", label: "AI Assistant",  desc: "Wellness support tools",  to: "/ai-chat", color: C.sky600, bg: C.sky100 },
          { icon: "👤", label: "My Profile",    desc: "Update your details",     to: "/chv-profile", color: C.amber600, bg: C.amber100 },
        ].map(({ icon, label, desc, to, color, bg }) => (
          <button key={label} onClick={() => navigate(to)} style={{
            background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 12,
            padding: "18px 16px", cursor: "pointer", textAlign: "left",
            transition: "all .2s", fontFamily: "'DM Sans',system-ui,sans-serif",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${color}18`; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: ".875rem", fontWeight: 600, color: C.sl900, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: ".76rem", color: C.sl500 }}>{desc}</div>
          </button>
        ))}
      </div>
    </CHVLayout>
  );
}