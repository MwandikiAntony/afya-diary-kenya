import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";

const C = {
  em900:"#064e3b",em800:"#065f46",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",
  em100:"#d1fae5",em50:"#ecfdf5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",
  bg:"#f6f8f7",white:"#ffffff",
};

/* ═══════════════════════════════════════
   SECURITY PAGE
════════════════════════════════════════ */
export function Security() {
  const pillars = [
    { icon: "🔐", title: "OTP Authentication", color: C.em50, accent: C.em600, desc: "No passwords to remember. Every login uses a one-time code sent to your registered phone via Africa's Talking SMS, expiring after 5 minutes." },
    { icon: "🛡️", title: "Role-Based Access Control", color: C.sky100, accent: C.sky600, desc: "Patients, CHVs, and chemists each see only the data they are authorised for. A pharmacist cannot view another pharmacist's patients, and CHVs can only see their own roster." },
    { icon: "🔒", title: "JWT Token Security", color: "#fef3c7", accent: "#d97706", desc: "All sessions use cryptographically signed JSON Web Tokens with 30-day expiry. Tokens are verified on every API request, ensuring only authenticated users access data." },
    { icon: "🏷️", title: "Bcrypt Password Hashing", color: "#ede9fe", accent: "#7c3aed", desc: "Passwords and PINs for CHVs and chemists are hashed with bcrypt using a cost factor of 10. Plain-text passwords are never stored or logged anywhere." },
    { icon: "🌐", title: "HTTPS Encryption", color: "#f0fdf4", accent: "#16a34a", desc: "All data transmitted between your device and our servers is encrypted using TLS 1.3. There is no unencrypted HTTP fallback in production environments." },
    { icon: "🗄️", title: "Secure Cloud Storage", color: "#fce7f3", accent: "#db2777", desc: "Patient data is stored on MongoDB Atlas with encryption at rest, IP allowlisting, and automated backups. Atlas is SOC 2 Type II and ISO 27001 certified." },
    { icon: "📋", title: "Audit Logging", color: C.em50, accent: C.em600, desc: "Every dispense, record creation, and patient update is logged with a timestamp, user ID, and action type. Logs are immutable and available for compliance review." },
    { icon: "⏱️", title: "OTP Rate Limiting", color: C.sky100, accent: C.sky600, desc: "We enforce a limit of 5 OTP requests per phone number per hour to prevent SMS bombing and brute force attacks." },
    { icon: "🇰🇪", title: "Kenya Data Protection Act", color: "#fef3c7", accent: "#d97706", desc: "Our data handling practices are designed to comply with the Kenya Data Protection Act 2019. We maintain a registered Data Protection Officer and have filed required notifications." },
  ];

  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Security</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Your data is safe with us
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 540, margin: "0 auto" }}>
            Healthcare data is among the most sensitive information that exists. We have built AfyaDiary Kenya with security as a core principle, not an afterthought.
          </p>
        </div>
      </section>

      <section style={{ background: C.white, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 400, color: C.sl900 }}>Security pillars</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {pillars.map(({ icon, title, color, accent, desc }) => (
              <div key={title} style={{ background: color, borderRadius: 14, padding: "24px 20px", border: `1px solid ${accent}20`, transition: "all .2s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,.08)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: C.sl900, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: ".82rem", color: C.sl600, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: C.sl900, marginBottom: 28, textAlign: "center" }}>
            Responsible Disclosure
          </h2>
          <div style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 16, padding: "28px 32px" }}>
            <p style={{ fontSize: ".9rem", color: C.sl600, lineHeight: 1.8, marginBottom: 16 }}>
              We take security vulnerabilities seriously. If you discover a security issue in AfyaDiary Kenya, please report it responsibly before public disclosure. We commit to acknowledging reports within 48 hours and providing a resolution timeline within 7 days.
            </p>
            <div style={{ background: C.em50, border: `1px solid ${C.em100}`, borderRadius: 10, padding: "14px 18px", fontSize: ".855rem", color: C.em900 }}>
              Report vulnerabilities to: <strong>security@afyadiary.co.ke</strong>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

/* ═══════════════════════════════════════
   CAREERS PAGE
════════════════════════════════════════ */
export function Careers() {
  const roles = [
    { title: "Senior React Developer", dept: "Engineering", type: "Full-time", location: "Nairobi / Remote", desc: "Build and maintain the AfyaDiary frontend, working closely with clinicians and community health workers to deliver impactful features." },
    { title: "Backend Node.js Engineer", dept: "Engineering", type: "Full-time", location: "Nairobi / Remote", desc: "Design and build scalable APIs, integrate with SMS providers, and ensure data security across the AfyaDiary platform." },
    { title: "Community Health Trainer", dept: "Field Operations", type: "Contract", location: "Multiple Counties", desc: "Train CHVs and pharmacy staff on using AfyaDiary in the field, gathering user feedback to improve the product." },
    { title: "Product Designer (UX/UI)", dept: "Design", type: "Full-time", location: "Nairobi", desc: "Design intuitive, accessible experiences for patients and healthcare workers, with a deep understanding of Kenyan healthcare contexts." },
    { title: "Data Analyst", dept: "Analytics", type: "Full-time", location: "Nairobi", desc: "Analyse community health outcomes, build dashboards for county health officials, and provide insights that drive better care." },
    { title: "Partnership Manager", dept: "Business Development", type: "Full-time", location: "Nairobi", desc: "Build relationships with county health departments, hospitals, pharmacy chains, and development partners to scale AfyaDiary's reach." },
  ];

  const perks = [
    { icon: "🏥", t: "Health Insurance",  d: "Comprehensive NHIF plus private health cover for you and your dependants." },
    { icon: "🏠", t: "Flexible Work",      d: "Remote-first culture with the option to work from our Nairobi office." },
    { icon: "📚", t: "Learning Budget",    d: "KSh 50,000 annual budget for courses, books, and conferences." },
    { icon: "🌍", t: "Mission Driven",     d: "Work on technology that directly improves healthcare for millions of Kenyans." },
    { icon: "💼", t: "Equity Options",     d: "Share in our growth through our employee stock option programme." },
    { icon: "🎯", t: "Impact Metrics",     d: "See the direct health outcomes your work produces, tracked monthly." },
  ];

  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Careers</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Work that matters
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            Join a team of Kenyan technologists, clinicians, and community health advocates building the future of healthcare in Africa.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section style={{ background: C.white, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 400, color: C.sl900 }}>Why AfyaDiary</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {perks.map(({ icon, t, d }) => (
              <div key={t} style={{ background: C.em50, borderRadius: 14, padding: "22px 20px", border: `1px solid ${C.em100}` }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: ".9rem", fontWeight: 600, color: C.sl900, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: ".82rem", color: C.sl600, lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section style={{ background: C.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Open Positions</div>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 400, color: C.sl900 }}>Current openings</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {roles.map(({ title, dept, type, location, desc }) => (
              <div key={title} style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 14, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, transition: "all .2s", flexWrap: "wrap" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.em400; e.currentTarget.style.boxShadow = `0 4px 16px rgba(16,185,129,.1)`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <span style={{ background: C.em50, color: C.em700, fontSize: ".7rem", fontWeight: 500, padding: "2px 10px", borderRadius: 999, border: `1px solid ${C.em100}` }}>{dept}</span>
                    <span style={{ background: C.sky100, color: C.sky600, fontSize: ".7rem", fontWeight: 500, padding: "2px 10px", borderRadius: 999 }}>{type}</span>
                    <span style={{ background: C.sl100, color: C.sl600, fontSize: ".7rem", fontWeight: 500, padding: "2px 10px", borderRadius: 999 }}>📍 {location}</span>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: C.sl900, marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: ".82rem", color: C.sl500, lineHeight: 1.65 }}>{desc}</p>
                </div>
                <a href="mailto:careers@afyadiary.co.ke" style={{
                  background: C.em600, color: "#fff", padding: "9px 18px", borderRadius: 8,
                  fontSize: ".8rem", fontWeight: 500, textDecoration: "none", flexShrink: 0,
                  transition: "all .15s", boxShadow: `0 2px 8px rgba(5,150,105,.25)`,
                }}>Apply Now</a>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 14, padding: "24px", marginTop: 28, textAlign: "center" }}>
            <p style={{ fontSize: ".875rem", color: C.sl600, lineHeight: 1.7 }}>
              Do not see a role that fits? Send your CV and a short note to{" "}
              <a href="mailto:careers@afyadiary.co.ke" style={{ color: C.em600, fontWeight: 500 }}>careers@afyadiary.co.ke</a>{" "}
              and we will keep you in mind for future openings.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

/* ═══════════════════════════════════════
   FAQ PAGE
════════════════════════════════════════ */
export function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    { cat: "Getting Started", qs: [
      { q: "How do I register on AfyaDiary Kenya?", a: "Click 'Get Started' on the homepage, select your role (patient, CHV, or chemist), fill in your details, and verify your phone number with a one-time code sent via SMS." },
      { q: "Is AfyaDiary Kenya free to use?", a: "Yes, AfyaDiary Kenya is free for patients, community health volunteers, and healthcare facilities enrolled in our public health programme. Premium analytics features are available for private facilities." },
      { q: "What is a SHA number and why do I need it?", a: "The Social Health Authority (SHA) number is Kenya's national health identification number issued by the Social Health Authority. It allows your records to be securely linked across different health facilities and is required for patient registration." },
      { q: "Can I use AfyaDiary Kenya on my phone?", a: "Yes. AfyaDiary Kenya is designed to work on any smartphone browser. A dedicated mobile app is also available for download on Android and iOS." },
    ]},
    { cat: "For Patients", qs: [
      { q: "How do I access my medical records?", a: "After logging in, navigate to 'My Records' in the sidebar. You will see your full health history including diagnoses, medications, and records added by your CHV or pharmacist." },
      { q: "Who can see my health records?", a: "Only healthcare providers directly involved in your care can access your records. This means your assigned CHV, any chemist you visit, and you. No one else has access without your explicit consent." },
      { q: "How do medication reminders work?", a: "Your CHV or pharmacist can set up SMS reminders for your medication schedule. You will receive an SMS to your registered phone number at the scheduled time." },
    ]},
    { cat: "For Chemists", qs: [
      { q: "How do I find a patient's records?", a: "Enter the patient's SHA number in the search bar on your dashboard. Their profile and dispensing history will appear immediately if they are registered in the system." },
      { q: "How do I add a new medicine to inventory?", a: "Go to your dashboard and click 'Add Medicine', enter the name, quantity, and price. If the medicine already exists in the system, the stock will be updated automatically." },
      { q: "What happens when stock runs low?", a: "The inventory screen highlights medicines with fewer than 10 units in amber and those with zero stock in red. You can set custom low-stock thresholds in your profile settings." },
    ]},
    { cat: "For CHVs", qs: [
      { q: "How are patients assigned to me?", a: "A chemist or facility administrator assigns patients to your account. Once assigned, they appear in your 'My Patients' list and you can view their records, submit visit reports, and set reminders." },
      { q: "Can I create patients from the field?", a: "Chemists can register new patients. As a CHV, you can view and update your assigned patients. If you need to register a new patient, coordinate with your linked pharmacy or health facility." },
      { q: "How do I submit a household visit report?", a: "Go to 'Reports' in your sidebar, click 'New Report', fill in the patient, visit title, and your findings or notes, then save. Reports are visible to facility administrators." },
    ]},
    { cat: "Technical", qs: [
      { q: "What do I do if my OTP does not arrive?", a: "Wait 2 minutes as SMS delivery may be delayed. Then click 'Resend OTP'. Check that your phone number is correct and has signal. If the issue persists, contact support@afyadiary.co.ke." },
      { q: "Can I use AfyaDiary Kenya offline?", a: "The current web version requires an internet connection. Offline functionality with sync is on our roadmap for the 2025 mobile app release." },
      { q: "How do I reset my account if I change my phone number?", a: "Contact our support team at support@afyadiary.co.ke with proof of identity. We will update your phone number and send a new OTP to the new number." },
    ]},
  ];

  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Help Centre</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8 }}>
            Find answers to the most common questions about AfyaDiary Kenya.
          </p>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "60px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          {faqs.map(({ cat, qs }) => (
            <div key={cat} style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 4, height: 22, background: C.em500, borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.2rem", fontWeight: 400, color: C.sl900 }}>{cat}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {qs.map(({ q, a }, i) => {
                  const id = `${cat}-${i}`;
                  const isOpen = open === id;
                  return (
                    <div key={q} style={{ background: C.white, border: `1px solid ${isOpen ? C.em300 : C.sl200}`, borderRadius: 12, overflow: "hidden", transition: "border-color .15s" }}>
                      <button onClick={() => setOpen(isOpen ? null : id)} style={{
                        width: "100%", padding: "16px 20px", background: "none", border: "none",
                        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                        textAlign: "left", fontFamily: "'DM Sans',system-ui,sans-serif",
                      }}>
                        <span style={{ fontSize: ".9rem", fontWeight: 500, color: C.sl900, flex: 1 }}>{q}</span>
                        <span style={{ fontSize: "1.1rem", color: C.em600, flexShrink: 0, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 20px 16px", fontSize: ".855rem", color: C.sl600, lineHeight: 1.75, borderTop: `1px solid ${C.sl100}`, paddingTop: 14 }}>
                          {a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 14, padding: "28px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>🙋</div>
            <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.15rem", fontWeight: 400, color: C.sl900, marginBottom: 10 }}>Still have questions?</h3>
            <p style={{ fontSize: ".875rem", color: C.sl500, marginBottom: 18 }}>Our support team is available Monday to Friday, 8am to 6pm EAT.</p>
            <Link to="/contact" style={{
              background: C.em600, color: "#fff", padding: "10px 22px", borderRadius: 8,
              fontWeight: 500, fontSize: ".875rem", textDecoration: "none",
              boxShadow: `0 2px 10px rgba(5,150,105,.3)`,
            }}>Contact Support</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

/* ═══════════════════════════════════════
   MOBILE APP PAGE
════════════════════════════════════════ */
export function MobileApp() {
  const appBtnStyle = {
    display: "flex", alignItems: "center", gap: 10,
    background: C.sl900, color: "#fff", padding: "12px 20px",
    borderRadius: 10, border: "1px solid rgba(255,255,255,.15)",
    cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif",
    transition: "all .2s",
  };

  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "flex-end" }} className="app-hero-grid">
            <div style={{ paddingBottom: 60 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>Mobile App</div>
              <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 18, lineHeight: 1.12 }}>
                AfyaDiary Kenya<br />
                <em style={{ fontStyle: "italic", color: C.em400 }}>in your pocket</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
                The AfyaDiary Kenya mobile app brings your health records, medication reminders, and AI wellness tools to your smartphone, even in areas with slow internet.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {/* Replaced <a href="#"> with <button> to satisfy jsx-a11y/anchor-is-valid */}
                <button style={appBtnStyle} onClick={() => {}} aria-label="Get it on Google Play (coming soon)">
                  <span style={{ fontSize: "1.5rem" }}>🤖</span>
                  <div>
                    <div style={{ fontSize: ".6rem", opacity: .7, textTransform: "uppercase", letterSpacing: ".06em" }}>Get it on</div>
                    <div style={{ fontSize: ".95rem", fontWeight: 600 }}>Google Play</div>
                  </div>
                </button>
                <button style={appBtnStyle} onClick={() => {}} aria-label="Download on the App Store (coming soon)">
                  <span style={{ fontSize: "1.5rem" }}>🍎</span>
                  <div>
                    <div style={{ fontSize: ".6rem", opacity: .7, textTransform: "uppercase", letterSpacing: ".06em" }}>Download on the</div>
                    <div style={{ fontSize: ".95rem", fontWeight: 600 }}>App Store</div>
                  </div>
                </button>
              </div>
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <img src="/images/Mobilemoc.png" alt="AfyaDiary Kenya mobile app" style={{ width: "clamp(140px,20vw,220px)", display: "block" }} />
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
          <path d="M0 60L80 45C160 30 320 0 480 0C640 0 800 30 960 40C1120 50 1280 30 1360 20L1440 10V60H0Z" fill={C.bg} />
        </svg>
      </section>

      <section style={{ background: C.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 400, color: C.sl900 }}>Everything the web app has, and more</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { icon: "📴", title: "Offline Mode",       desc: "View records and reminders even when you have no internet connection. Data syncs automatically when you reconnect." },
              { icon: "🔔", title: "Push Notifications", desc: "Never miss a medication reminder or appointment with native push notifications on Android and iOS." },
              { icon: "📷", title: "QR Code Scanner",    desc: "Use your phone camera to scan patient QR codes at the pharmacy, faster than typing a SHA number." },
              { icon: "🔒", title: "Biometric Login",    desc: "Log in quickly and securely with Face ID or fingerprint on supported devices." },
              { icon: "📍", title: "Location Services",  desc: "CHVs can tag household visit reports with GPS coordinates for accurate community health mapping." },
              { icon: "⚡", title: "Low Data Mode",      desc: "Optimised for areas with slow connections. The app uses less than 5MB of data per day in normal use." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 14, padding: "22px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: ".9rem", fontWeight: 600, color: C.sl900, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: ".82rem", color: C.sl500, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "72px 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 300, color: "#fff", marginBottom: 14 }}>
            Coming soon to all app stores
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 26, lineHeight: 1.75 }}>
            The app is currently in beta testing with select health facilities. Enter your email to be notified at launch.
          </p>
          <div style={{ display: "flex", maxWidth: 420, margin: "0 auto", gap: 0, background: "rgba(255,255,255,.1)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.15)" }}>
            <input placeholder="Your email address" style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "12px 16px", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem" }} />
            <button style={{ background: C.em500, color: "#fff", border: "none", padding: "12px 20px", cursor: "pointer", fontWeight: 600, fontSize: ".875rem", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Notify Me</button>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:640px){.app-hero-grid{grid-template-columns:1fr!important}}`}</style>
    </PublicLayout>
  );
}

/* ═══════════════════════════════════════
   404 PAGE
════════════════════════════════════════ */
export function NotFound() {
  return (
    <PublicLayout>
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", background: C.bg }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "7rem", fontWeight: 300, color: C.em100, lineHeight: 1, marginBottom: 8 }}>404</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.8rem", fontWeight: 400, color: C.sl900, marginBottom: 14 }}>Page not found</h1>
          <p style={{ color: C.sl500, fontSize: ".925rem", lineHeight: 1.75, marginBottom: 32 }}>
            The page you are looking for does not exist or has been moved. Let us get you back on track.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link to="/" style={{ background: C.em600, color: "#fff", padding: "11px 24px", borderRadius: 9, fontWeight: 500, fontSize: ".9rem", textDecoration: "none", boxShadow: `0 4px 14px rgba(5,150,105,.3)` }}>Go Home</Link>
            <Link to="/contact" style={{ border: `1.5px solid ${C.sl200}`, color: C.sl700, padding: "11px 24px", borderRadius: 9, fontSize: ".9rem", textDecoration: "none" }}>Contact Support</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}