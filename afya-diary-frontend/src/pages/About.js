import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const COLORS = {
  emerald900: "#064e3b", emerald800: "#065f46", emerald700: "#047857",
  emerald600: "#059669", emerald500: "#10b981", emerald400: "#34d399",
  emerald100: "#d1fae5", emerald50: "#ecfdf5",
  sky600: "#0284c7", sky100: "#e0f2fe",
  slate900: "#0f172a", slate700: "#334155", slate600: "#475569",
  slate500: "#64748b", slate400: "#94a3b8", slate200: "#e2e8f0",
  slate100: "#f1f5f9", slate50: "#f8fafc",
  bg: "#f6f8f7", white: "#ffffff",
};

const team = [
  { name: "Dr. Amina Odhiambo",  role: "Chief Medical Officer",    bg: "#059669", desc: "Former MOH Kenya digital health lead with 15 years in public health systems." },
  { name: "Kevin Njoroge",        role: "Chief Technology Officer",  bg: "#0284c7", desc: "Full-stack engineer previously at Safaricom and Andela, passionate about health tech." },
  { name: "Faith Wambua",         role: "Head of Community Health",  bg: "#7c3aed", desc: "CHV coordinator with experience training community health workers across 8 counties." },
  { name: "James Mwangi",         role: "Head of Pharmacy Systems",  bg: "#d97706", desc: "Registered pharmacist and software developer bridging clinical and digital worlds." },
];

const milestones = [
  { year: "2022", title: "Founded", desc: "AfyaDiary Kenya was founded in Nairobi with a mission to digitise community healthcare." },
  { year: "2023", title: "First 100 Facilities", desc: "Launched across 100 health facilities in Nairobi, Kiambu, and Mombasa counties." },
  { year: "2024", title: "SHA Integration", desc: "Became the first platform fully integrated with the Social Health Authority numbering system." },
  { year: "2025", title: "National Scale", desc: "Operating in all 47 counties with over 2,400 registered healthcare workers." },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg,#022c22,${COLORS.emerald900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: COLORS.emerald400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Our Story</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 18, lineHeight: 1.15 }}>
            About AfyaDiary Kenya
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
            We are a Kenyan health technology company on a mission to make quality healthcare accessible to every Kenyan through secure, simple digital tools.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section style={{ background: COLORS.white, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
            {[
              { icon: "🎯", title: "Our Mission", accent: COLORS.emerald600, bg: COLORS.emerald50, desc: "To improve healthcare accessibility and transparency through secure, human-centred digital innovation that works for every Kenyan, from Nairobi to the most rural county." },
              { icon: "🔭", title: "Our Vision",  accent: COLORS.sky600,     bg: COLORS.sky100,    desc: "A connected Kenya where every citizen can access efficient, reliable, and affordable digital health services regardless of location or economic status." },
              { icon: "💎", title: "Our Values",  accent: "#7c3aed",          bg: "#ede9fe",        desc: "We believe in transparency, community ownership, and technology that serves people. Every feature we build starts with listening to health workers in the field." },
            ].map(({ icon, title, accent, bg, desc }) => (
              <div key={title} style={{ background: bg, borderRadius: 16, padding: "28px 24px", border: `1px solid ${accent}20` }}>
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{icon}</div>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.3rem", fontWeight: 400, color: COLORS.slate900, marginBottom: 10 }}>{title}</h2>
                <p style={{ fontSize: ".875rem", color: COLORS.slate600, lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About image + text */}
      <section style={{ background: COLORS.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="about-two-col">
            <div>
              <img
                src="/images/about-healthcare-team.png"
                alt="AfyaDiary Kenya healthcare team"
                style={{ width: "100%", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,.12)", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 600, color: COLORS.emerald600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Who We Are</div>
              <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: COLORS.slate900, marginBottom: 16, lineHeight: 1.2 }}>
                Built by Kenyans,<br />for Kenyans
              </h2>
              <p style={{ color: COLORS.slate600, fontSize: ".925rem", lineHeight: 1.8, marginBottom: 16 }}>
                AfyaDiary Kenya was born out of frustration with paper-based systems that lost patient records, delayed medicine dispensing, and left community health volunteers without the tools they needed.
              </p>
              <p style={{ color: COLORS.slate600, fontSize: ".925rem", lineHeight: 1.8, marginBottom: 24 }}>
                Our team of Kenyan engineers, clinicians, and community health workers built this platform from the ground up, spending time in clinics, pharmacies, and villages across the country to understand the real problems.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {[["47", "Counties Covered"],["2,400+","Health Workers"],["12,000+","Patients Served"]].map(([n, l]) => (
                  <div key={l} style={{ background: COLORS.emerald50, border: `1px solid ${COLORS.emerald100}`, borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: COLORS.emerald700, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: ".72rem", color: COLORS.slate500, marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.about-two-col{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Timeline */}
      <section style={{ background: COLORS.white, padding: "72px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 600, color: COLORS.emerald600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Timeline</div>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: COLORS.slate900 }}>Our journey so far</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: COLORS.emerald100, transform: "translateX(-50%)" }} className="timeline-line" />
            {milestones.map(({ year, title, desc }, i) => (
              <div key={year} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 40, position: "relative" }} className="tl-row">
                <div style={{ width: "46%", background: COLORS.slate50, border: `1px solid ${COLORS.slate200}`, borderRadius: 14, padding: "20px 22px", position: "relative" }} className="tl-card">
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: COLORS.emerald600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{year}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: COLORS.slate900, marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: ".82rem", color: COLORS.slate500, lineHeight: 1.65 }}>{desc}</p>
                </div>
                <div style={{ position: "absolute", left: "50%", top: 20, width: 12, height: 12, background: COLORS.emerald500, borderRadius: "50%", transform: "translateX(-50%)", border: `3px solid ${COLORS.white}`, boxShadow: `0 0 0 2px ${COLORS.emerald200}` }} className="tl-dot" />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media(max-width:640px){
            .timeline-line{left:12px!important;transform:none!important}
            .tl-row{justify-content:flex-end!important}
            .tl-card{width:calc(100% - 36px)!important}
            .tl-dot{left:12px!important;transform:none!important}
          }
        `}</style>
      </section>

      {/* Team */}
      <section style={{ background: COLORS.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 600, color: COLORS.emerald600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Leadership</div>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: COLORS.slate900 }}>The team behind AfyaDiary</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
            {team.map(({ name, role, bg, desc }) => (
              <div key={name} style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.slate200}`, padding: "24px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", transition: "all .2s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,.09)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 16, boxShadow: `0 4px 12px ${bg}50` }}>
                  {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: COLORS.slate900, marginBottom: 3 }}>{name}</h3>
                <div style={{ fontSize: ".75rem", color: COLORS.emerald600, fontWeight: 500, marginBottom: 10 }}>{role}</div>
                <p style={{ fontSize: ".8rem", color: COLORS.slate500, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg,#022c22,${COLORS.emerald900})`, padding: "72px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 300, color: "#fff", marginBottom: 14 }}>
            Join our growing community
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 28, lineHeight: 1.75, fontSize: ".925rem" }}>
            Whether you are a patient, pharmacist, or community health volunteer, AfyaDiary Kenya has a place for you.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/register" style={{ background: COLORS.emerald500, color: "#fff", padding: "12px 26px", borderRadius: 9, fontWeight: 600, fontSize: ".9rem", textDecoration: "none", boxShadow: `0 4px 16px ${COLORS.emerald500}40` }}>
              Get Started Free
            </Link>
            <Link to="/contact" style={{ border: "1.5px solid rgba(255,255,255,.25)", color: "rgba(255,255,255,.85)", padding: "12px 26px", borderRadius: 9, fontSize: ".9rem", textDecoration: "none" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}