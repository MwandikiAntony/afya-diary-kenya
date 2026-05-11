import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";

const C = {
  em900:"#064e3b",em600:"#059669",em500:"#10b981",em400:"#34d399",
  em50:"#ecfdf5",em100:"#d1fae5",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",white:"#ffffff",bg:"#f6f8f7",
};

const sections = [
  { id:"collection", title:"Information We Collect",
    content:"We collect information you provide directly when registering, including your name, phone number, SHA number, gender, age, and role. For chemists we collect license number and pharmacy name. For CHVs we collect email and password hash. We also collect usage data such as pages visited and actions taken. We do not collect payment card information." },
  { id:"use", title:"How We Use Your Information",
    content:"Your information is used to provide the AfyaDiary Kenya platform, send OTP codes for authentication via SMS, send medication and appointment reminders, link patients with assigned community health volunteers, and enable chemists to access patient records for dispensing. We never sell your personal data." },
  { id:"sharing", title:"Information Sharing",
    content:"We share your information only with healthcare providers involved in your care, Africa's Talking for SMS delivery, and MongoDB Atlas for secure data storage. We may disclose information if required by Kenyan law or to protect user safety. All third-party partners are bound by strict data processing agreements." },
  { id:"security", title:"Data Security",
    content:"We protect your data using JWT token authentication, bcrypt password hashing, role-based access control, HTTPS encrypted transmission, and MongoDB Atlas enterprise security. OTP codes expire after 5 minutes and can only be used once. Access tokens expire after 30 days." },
  { id:"rights", title:"Your Rights Under the Kenya Data Protection Act",
    content:"Under the Kenya Data Protection Act 2019, you have the right to access, correct, or delete your personal data, object to certain processing, withdraw consent at any time, and lodge a complaint with the Office of the Data Protection Commissioner. Contact privacy@afyadiary.co.ke to exercise these rights." },
  { id:"retention", title:"Data Retention",
    content:"Patient health records are retained for a minimum of 7 years in accordance with Kenyan healthcare regulations. Account data is retained while your account is active and for 2 years after deactivation. OTP records are deleted after 24 hours." },
  { id:"changes", title:"Changes to This Policy",
    content:"We may update this Privacy Policy from time to time. When we do, we will post the updated policy on this page and, where the changes are significant, notify users via SMS or in-app notice. Continued use of AfyaDiary Kenya after changes take effect constitutes acceptance." },
  { id:"contact", title:"Contact Our Data Protection Officer",
    content:"For privacy-related questions, requests, or complaints contact our Data Protection Officer at privacy@afyadiary.co.ke or by post at AfyaDiary Kenya Ltd, Westlands, Nairobi, Kenya. We aim to respond to all privacy requests within 14 business days." },
];

export default function Privacy() {
  const [active, setActive] = useState(null);

  return (
    <PublicLayout>
      <section style={{ background:`linear-gradient(135deg,#022c22,${C.em900})`, padding:"80px 0 56px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
          <div style={{ fontSize:".72rem", fontWeight:600, color:C.em400, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Legal</div>
          <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:300, color:"#fff", marginBottom:14, lineHeight:1.15 }}>
            Privacy Policy
          </h1>
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:".875rem" }}>
            Effective 1 January 2025. Last updated 1 May 2025.
          </p>
        </div>
      </section>

      <section style={{ background:C.bg, padding:"56px 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 clamp(16px,4vw,48px)", display:"grid", gridTemplateColumns:"200px 1fr", gap:36, alignItems:"flex-start" }} className="privacy-grid">

          {/* Sidebar TOC */}
          <div style={{ position:"sticky", top:88 }} className="privacy-toc">
            <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.sl200}`, padding:"18px 14px" }}>
              <div style={{ fontSize:".68rem", fontWeight:700, color:C.em600, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Contents</div>
              {sections.map(({ id, title }) => (
                <a key={id} href={`#${id}`} onClick={() => setActive(id)}
                  style={{
                    display:"block", fontSize:".8rem", padding:"5px 8px", borderRadius:6, textDecoration:"none",
                    color: active === id ? C.em600 : C.sl600, fontWeight: active === id ? 600 : 400,
                    background: active === id ? C.em50 : "none", transition:"all .15s",
                    borderLeft: `2px solid ${active === id ? C.em500 : "transparent"}`,
                  }}>
                  {title}
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ background:C.em50, border:`1px solid ${C.em100}`, borderRadius:12, padding:"14px 18px", marginBottom:28, fontSize:".855rem", color:C.em900, lineHeight:1.7 }}>
              This policy explains how AfyaDiary Kenya Ltd collects, uses, and protects your personal health information in accordance with the Kenya Data Protection Act 2019.
            </div>
            {sections.map(({ id, title, content }) => (
              <div key={id} id={id} style={{ marginBottom:36, scrollMarginTop:96 }}>
                <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"1.15rem", fontWeight:400, color:C.sl900, marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${C.sl200}` }}>
                  {title}
                </h2>
                <p style={{ fontSize:".875rem", color:C.sl600, lineHeight:1.85 }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){.privacy-grid{grid-template-columns:1fr!important}.privacy-toc{display:none}}`}</style>
    </PublicLayout>
  );
}