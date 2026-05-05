import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";

const C = {
  em900:"#064e3b",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",sl200:"#e2e8f0",sl100:"#f1f5f9",
  bg:"#f6f8f7",white:"#ffffff",
};

const sections = [
  { id:"collection", title:"Information We Collect", content:`We collect information you provide directly, including your name, phone number, SHA number, gender, age, and role (patient, chemist, or community health volunteer). For chemists, we also collect license number and pharmacy name. For CHVs, we collect email address and password hash. We collect usage data such as pages visited, features used, and actions taken within the platform. We do not collect payment card information.` },
  { id:"use", title:"How We Use Your Information", content:`Your information is used to: provide and maintain the AfyaDiary Kenya platform; send OTP codes for authentication via SMS; send medication and appointment reminders via Africa's Talking SMS service; link patients with their assigned community health volunteers; enable chemists to access patient records for dispensing purposes; and improve our services through anonymised usage analytics. We do not sell your personal data to third parties under any circumstances.` },
  { id:"sharing", title:"Information Sharing", content:`We share your information only as follows: with healthcare providers directly involved in your care (CHVs and chemists you are assigned to); with Africa's Talking Limited for SMS delivery; and with MongoDB Atlas for secure data storage. We may disclose information if required by Kenyan law, court order, or to protect the safety of users or the public. All third-party partners are bound by strict data processing agreements.` },
  { id:"security", title:"Data Security", content:`We protect your data using industry-standard security measures including JWT token authentication, bcrypt password hashing, role-based access control, HTTPS encrypted transmission, and MongoDB Atlas enterprise security. OTP codes expire after 5 minutes and can only be used once. Access tokens expire after 30 days. We conduct regular security reviews and promptly address any vulnerabilities identified.` },
  { id:"rights", title:"Your Rights Under the Kenya Data Protection Act", content:`Under the Kenya Data Protection Act 2019, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data (subject to legal retention requirements); object to certain processing of your data; withdraw consent at any time; and lodge a complaint with the Office of the Data Protection Commissioner. To exercise any of these rights, contact us at privacy@afyadiary.co.ke.` },
  { id:"retention", title:"Data Retention", content:`We retain patient health records for a minimum of 7 years in accordance with Kenyan healthcare regulations. Account data is retained while your account is active and for 2 years after deactivation. OTP records are deleted after 24 hours. Dispensing records are retained for 10 years for regulatory compliance. You may request deletion of non-regulated personal data at any time.` },
  { id:"children", title:"Children's Privacy", content:`AfyaDiary Kenya may hold records for patients under 18 years of age when registered by a parent, guardian, or authorised healthcare provider. We do not knowingly allow minors to create their own accounts without guardian oversight. If you believe a child's data has been collected without proper consent, please contact us immediately.` },
  { id:"changes", title:"Changes to This Policy", content:`We may update this Privacy Policy from time to time. When we do, we will post the updated policy on this page with a revised effective date and, where the changes are significant, notify users via SMS or in-app notice. Continued use of AfyaDiary Kenya after changes take effect constitutes acceptance of the updated policy.` },
  { id:"contact", title:"Contact Our Data Protection Officer", content:`For any privacy-related questions, requests, or complaints, contact our Data Protection Officer at: privacy@afyadiary.co.ke or by post at AfyaDiary Kenya Ltd, Westlands, Nairobi, Kenya. We aim to respond to all privacy requests within 14 business days.` },
];

export default function Privacy() {
  const [active, setActive] = useState(null);

  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".9rem" }}>Effective date: 1 January 2025 &nbsp;|&nbsp; Last updated: 1 May 2025</p>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "60px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, alignItems: "flex-start" }} className="privacy-grid">
          {/* Sidebar TOC */}
          <div style={{ position: "sticky", top: 88 }} className="privacy-toc">
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "20px 16px" }}>
              <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>Contents</div>
              {sections.map(({ id, title }) => (
                <a key={id} href={`#${id}`} style={{
                  display: "block", color: C.sl600, fontSize: ".8rem",
                  padding: "5px 8px", borderRadius: 6, textDecoration: "none",
                  transition: "all .15s", borderLeft: `2px solid ${active === id ? C.em500 : "transparent"}`,
                  color: active === id ? C.em600 : C.sl600, fontWeight: active === id ? 500 : 400,
                }}
                  onMouseOver={e => { e.currentTarget.style.background = C.sl100; e.currentTarget.style.color = C.sl900; }}
                  onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = active === id ? C.em600 : C.sl600; }}
                  onClick={() => setActive(id)}>
                  {title}
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ background: C.em50, border: `1px solid ${C.em100}`, borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: ".855rem", color: C.em900, lineHeight: 1.7 }}>
              This policy explains how AfyaDiary Kenya Ltd collects, uses, and protects your personal health information in accordance with the Kenya Data Protection Act 2019 and applicable healthcare data regulations.
            </div>

            {sections.map(({ id, title, content }) => (
              <div key={id} id={id} style={{ marginBottom: 40, scrollMarginTop: 96 }}>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.2rem", fontWeight: 400, color: C.sl900, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.sl200}` }}>
                  {title}
                </h2>
                <p style={{ fontSize: ".875rem", color: C.sl600, lineHeight: 1.85 }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){.privacy-grid{grid-template-columns:1fr!important}.privacy-toc{display:none}}`}</style>
    </PublicLayout>
  );
}