import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",
  em100:"#d1fae5",em50:"#ecfdf5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  amber500:"#f59e0b",amber100:"#fef3c7",
  pur600:"#7c3aed",pur100:"#ede9fe",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",
  red600:"#dc2626",red100:"#fee2e2",
  white:"#ffffff",bg:"#f6f8f7",
};

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "20px 20px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .2s" }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem" }}>{icon}</div>
        {sub && <span style={{ fontSize: ".72rem", fontWeight: 500, color: sub.startsWith("+") ? C.em600 : C.red600, background: sub.startsWith("+") ? C.em50 : C.red100, padding: "2px 8px", borderRadius: 999 }}>{sub}</span>}
      </div>
      <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.8rem", fontWeight: 400, color: C.sl900, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: ".78rem", color: C.sl500, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
    </div>
  );
}

function QuickCard({ icon, title, desc, to, color, bg }) {
  return (
    <Link to={to} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .22s", height: "100%" }}
        onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 6px 20px ${color}18`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform = "none"; }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 14 }}>{icon}</div>
        <div style={{ fontSize: ".95rem", fontWeight: 600, color: C.sl900, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: ".8rem", color: C.sl500, lineHeight: 1.65, marginBottom: 16 }}>{desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: ".8rem", fontWeight: 500, color: color }}>
          Open
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      if (data.user) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = (user.name || "P").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <PatientLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp .4s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}.d4{animation-delay:.28s}
        @media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}.quick-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Page header */}
      <div className="fade" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Patient Dashboard</div>
            <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: C.sl900, lineHeight: 1.2 }}>
              {greeting}, {user.name?.split(" ")[0] || "there"} 👋
            </h1>
            {user.shaNumber && (
              <div style={{ fontSize: ".78rem", color: C.sl500, marginTop: 5 }}>
                SHA Number: <span style={{ fontWeight: 600, color: C.sl700, fontFamily: "monospace" }}>{user.shaNumber}</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.em500},${C.em700})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: ".875rem", boxShadow: `0 4px 12px ${C.em500}40` }}>
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="fade d1 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📋" label="Health Records" value="12"  sub="+2 this month" color={C.em600}  bg={C.em50} />
        <StatCard icon="💊" label="Prescriptions"  value="3"   sub="Active"          color={C.sky600} bg={C.sky100} />
        <StatCard icon="📅" label="Appointments"   value="1"   sub="Upcoming"        color={C.amber500} bg={C.amber100} />
        <StatCard icon="🔔" label="Reminders"      value="4"   sub="This week"       color={C.pur600} bg={C.pur100} />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 28 }} className="main-grid">
        {/* Quick actions */}
        <div className="fade d2">
          <div style={{ fontSize: ".8rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Quick Access</div>
          <div className="quick-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            <QuickCard icon="📋" title="My Health Records" desc="View your complete medical history, diagnoses, and treatment records." to="/records" color={C.em600} bg={C.em50} />
            <QuickCard icon="💊" title="Prescriptions" desc="View and manage your active and past medicine prescriptions." to="/prescriptions" color={C.sky600} bg={C.sky100} />
            <QuickCard icon="📅" title="Appointments" desc="Book and manage your upcoming healthcare appointments." to="/appointments" color={C.amber500} bg={C.amber100} />
            <QuickCard icon="🔔" title="Reminders" desc="View medication and appointment reminder alerts sent to your phone." to="/reminders" color={C.pur600} bg={C.pur100} />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile card */}
          <div className="fade d3" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize: ".78rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>My Profile</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Name", user.name || "Not set"],
                ["Phone", user.phone || "Not set"],
                ["SHA", user.shaNumber || "Not set"],
                ["Role", user.role || "patient"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${C.sl100}` }}>
                  <span style={{ fontSize: ".78rem", color: C.sl500 }}>{label}</span>
                  <span style={{ fontSize: ".82rem", fontWeight: 500, color: C.sl800, textTransform: label === "Role" ? "capitalize" : "none", fontFamily: label === "SHA" ? "monospace" : "inherit" }}>{val}</span>
                </div>
              ))}
            </div>
            <Link to="/profile" style={{ display: "block", marginTop: 14, textAlign: "center", background: C.sl100, color: C.sl700, padding: "8px", borderRadius: 8, fontSize: ".8rem", fontWeight: 500, textDecoration: "none", transition: "all .15s" }}>
              Edit Profile
            </Link>
          </div>

          {/* Wellness card */}
          <div className="fade d4" style={{ background: `linear-gradient(135deg,#3b1f5e,#4c1d95)`, borderRadius: 14, padding: "20px" }}>
            <div style={{ fontSize: ".72rem", fontWeight: 600, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Mental Wellness</div>
            <div style={{ fontSize: ".9rem", fontWeight: 500, color: "#fff", marginBottom: 8 }}>How are you feeling today?</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.6)", marginBottom: 16, lineHeight: 1.6 }}>Talk to our AI assistant or track your mood.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/ai-chat" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.15)", color: "#fff", padding: "9px 14px", borderRadius: 8, fontSize: ".8rem", fontWeight: 500, textDecoration: "none", textAlign: "center" }}>
                Chat with AI
              </Link>
              <Link to="/mood-tracker" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.8)", padding: "9px 14px", borderRadius: 8, fontSize: ".8rem", textDecoration: "none", textAlign: "center" }}>
                Track Mood
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Health tips banner */}
      <div className="fade" style={{ background: C.sky100, border: `1px solid ${C.sky600}20`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: "1.5rem" }}>💡</div>
          <div>
            <div style={{ fontSize: ".875rem", fontWeight: 600, color: C.sky600, marginBottom: 2 }}>Daily Health Tip</div>
            <div style={{ fontSize: ".82rem", color: "#0369a1" }}>Drink at least 8 glasses of water daily to keep your kidneys healthy and your energy levels up.</div>
          </div>
        </div>
        <Link to="/mental-health/tips" style={{ background: C.sky600, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: ".8rem", fontWeight: 500, textDecoration: "none", flexShrink: 0 }}>More Tips</Link>
      </div>

      <style>{`@media(max-width:900px){.main-grid{grid-template-columns:1fr!important}}`}</style>
    </PatientLayout>
  );
}