import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

export default function Features() {
  const features = [
    {
      category: "Patient Management",
      color: "#ecfdf5", accent: "#059669",
      items: [
        { icon: "🔍", title: "SHA Number Search", desc: "Instantly locate any patient using their Social Health Authority number across all registered facilities." },
        { icon: "📋", title: "Digital Health Records", desc: "Comprehensive medical history including diagnoses, medications, vaccines, allergies, and clinical notes." },
        { icon: "📷", title: "QR Code Identity", desc: "Each patient receives a unique QR code for rapid, accurate identification at any point of care." },
        { icon: "👥", title: "CHV Assignment", desc: "Patients are linked to Community Health Volunteers for ongoing care coordination and follow-up." },
      ],
    },
    {
      category: "Pharmacy Tools",
      color: "#e0f2fe", accent: "#0284c7",
      items: [
        { icon: "💊", title: "Inventory Management", desc: "Real-time stock tracking with low-stock alerts so you never run out of critical medicines." },
        { icon: "🔬", title: "QR Prescription Scan", desc: "Scan patient QR codes to instantly verify prescriptions and record dispenses accurately." },
        { icon: "📊", title: "Dispense History", desc: "Complete audit trail of all dispensed medications per patient and per pharmacist." },
        { icon: "💰", title: "Medicine Pricing", desc: "Manage pricing per unit and track the value of stock dispensed over any time period." },
      ],
    },
    {
      category: "Community Health",
      color: "#fef3c7", accent: "#d97706",
      items: [
        { icon: "🏘️", title: "Patient Assignment", desc: "CHVs manage their roster of assigned community members with full profile visibility." },
        { icon: "📝", title: "Visit Reports", desc: "Submit structured household visit reports and health observations from the field." },
        { icon: "🔔", title: "SMS Reminders", desc: "Send automated SMS alerts for medication schedules, appointments, and follow-ups via Africa's Talking." },
        { icon: "📍", title: "Location Tracking", desc: "CHVs can register their service area to enable community-level health mapping." },
      ],
    },
    {
      category: "Mental Wellness",
      color: "#ede9fe", accent: "#7c3aed",
      items: [
        { icon: "🧠", title: "AI Wellness Chat", desc: "Conversational AI providing mental health support, coping strategies, and wellness guidance." },
        { icon: "📓", title: "Mood Journalling", desc: "Daily emotional check-ins with trend tracking to help identify patterns over time." },
        { icon: "💡", title: "Health Tips", desc: "Curated daily mental and physical health tips relevant to the Kenyan healthcare context." },
        { icon: "🆘", title: "Crisis Resources", desc: "Immediate access to mental health hotlines and emergency contacts when needed." },
      ],
    },
    {
      category: "Security and Compliance",
      color: "#f0fdf4", accent: "#16a34a",
      items: [
        { icon: "🔐", title: "OTP Authentication", desc: "Phone-based one-time password login with no passwords to remember or forget." },
        { icon: "🛡️", title: "Role-Based Access", desc: "Strict permissions ensure patients, CHVs, and chemists see only what they need to see." },
        { icon: "📜", title: "Kenya Data Protection", desc: "Full compliance with the Kenya Data Protection Act 2019 and healthcare data regulations." },
        { icon: "📱", title: "Secure Sessions", desc: "JWT tokens with 30-day expiry and automatic logout to keep accounts protected." },
      ],
    },
  ];

  return (
    <PublicLayout>
      <div style={{ background: "linear-gradient(135deg,#022c22,#064e3b)", padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: "#34d399", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Platform Features</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Everything your clinic needs
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.75 }}>
            A complete digital health ecosystem built for Kenya's patients, pharmacists, and community health volunteers.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        {features.map(({ category, color, accent, items }) => (
          <div key={category} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 4, height: 28, background: accent, borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.5rem", fontWeight: 400, color: "#0f172a" }}>{category}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {items.map(({ icon, title, desc }) => (
                <div key={title} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
                  padding: "24px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                  transition: "all .2s",
                }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.09)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 14 }}>
                    {icon}
                  </div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: ".82rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          background: "linear-gradient(135deg,#022c22,#064e3b)",
          borderRadius: 20, padding: "48px 40px", textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.8rem", fontWeight: 300, color: "#fff", marginBottom: 14 }}>
            Ready to transform your practice?
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 28, fontSize: ".925rem" }}>
            Join healthcare workers across Kenya who use AfyaDiary every day.
          </p>
          <Link to="/register" style={{
            background: "#10b981", color: "#fff", padding: "12px 28px", borderRadius: 9,
            fontWeight: 600, fontSize: ".9rem", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(16,185,129,.4)",
          }}>Get Started Free</Link>
        </div>
      </div>
    </PublicLayout>
  );
}