import React from "react";
import PublicLayout from "../components/PublicLayout";

const C = {
  em900:"#064e3b",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",sl200:"#e2e8f0",sl100:"#f1f5f9",
  bg:"#f6f8f7",white:"#ffffff",
};

const sections = [
  { title: "Acceptance of Terms", content: "By creating an account or using AfyaDiary Kenya, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use the platform. These terms apply to all users including patients, community health volunteers, and chemists." },
  { title: "Eligibility and Accounts", content: "You must be at least 18 years old to create an account independently, or have a parent or guardian register on your behalf. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate and complete information during registration. You must notify us immediately of any unauthorised use of your account." },
  { title: "Permitted Use", content: "AfyaDiary Kenya is intended solely for legitimate healthcare management purposes. Patients may use the platform to view their health records, manage appointments, and access wellness tools. Chemists may use it to manage inventory and dispense medicines to registered patients. Community health volunteers may use it to track assigned patients and submit reports. Any use outside these purposes is prohibited." },
  { title: "Prohibited Conduct", content: "You must not: use the platform for any unlawful purpose; access another user's data without authorisation; attempt to reverse-engineer, hack, or disrupt the platform; upload malicious code or content; impersonate another person or healthcare provider; use the platform to dispense medicines to unregistered patients; or share your account credentials with others. Violations may result in immediate account termination and referral to law enforcement." },
  { title: "Health Information Disclaimer", content: "AfyaDiary Kenya is a health management and records platform. It is not a substitute for professional medical advice, diagnosis, or treatment. The AI wellness features provide general wellness support only and must not be used as a diagnostic tool. Always seek the advice of a qualified healthcare professional for any medical condition. In a medical emergency, contact emergency services immediately." },
  { title: "Data Accuracy", content: "You are responsible for the accuracy of information you enter into the platform. AfyaDiary Kenya is not liable for harm arising from inaccurate patient data, incorrect medicine records, or erroneous information entered by any user. Chemists and CHVs must verify patient identity before accessing or updating records." },
  { title: "Intellectual Property", content: "All content, design, code, trademarks, and functionality of AfyaDiary Kenya are the property of AfyaDiary Kenya Ltd and are protected by Kenyan and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission." },
  { title: "Service Availability", content: "We strive for maximum uptime but do not guarantee uninterrupted access to the platform. Scheduled maintenance will be communicated in advance where possible. We are not liable for losses arising from service interruptions, whether planned or unplanned." },
  { title: "Termination", content: "We may suspend or terminate your account at any time if you breach these terms, if we reasonably suspect fraudulent or harmful activity, or if required by law. You may request account deletion at any time by contacting support@afyadiary.co.ke. Patient health records will be retained as required by Kenyan healthcare regulations even after account deletion." },
  { title: "Limitation of Liability", content: "To the maximum extent permitted by Kenyan law, AfyaDiary Kenya Ltd is not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim shall not exceed the amount paid by you (if any) for platform services in the preceding 12 months." },
  { title: "Governing Law", content: "These Terms of Service are governed by the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya. We encourage users to first attempt resolution through our support team before initiating legal proceedings." },
  { title: "Changes to Terms", content: "We reserve the right to update these terms at any time. Material changes will be communicated via SMS or in-app notification at least 14 days before taking effect. Continued use of the platform after changes constitute acceptance of the updated terms." },
];

export default function Terms() {
  return (
    <PublicLayout>
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16 }}>
            Terms of Service
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".9rem" }}>Effective date: 1 January 2025 &nbsp;|&nbsp; Last updated: 1 May 2025</p>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "60px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "16px 20px", marginBottom: 36, fontSize: ".855rem", color: "#7c2d12", lineHeight: 1.7 }}>
            Please read these Terms of Service carefully before using AfyaDiary Kenya. By accessing or using our platform, you agree to be bound by these terms.
          </div>

          {sections.map(({ title, content }, i) => (
            <div key={title} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.15rem", fontWeight: 400, color: C.sl900, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.sl200}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.em50, border: `1px solid ${C.em100}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".68rem", fontWeight: 700, color: C.em600, flexShrink: 0 }}>
                  {i + 1}
                </span>
                {title}
              </h2>
              <p style={{ fontSize: ".875rem", color: C.sl600, lineHeight: 1.85 }}>{content}</p>
            </div>
          ))}

          <div style={{ background: C.sl100, borderRadius: 14, padding: "24px", marginTop: 20 }}>
            <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: C.sl900, marginBottom: 8 }}>Questions about these terms?</h3>
            <p style={{ fontSize: ".855rem", color: C.sl600, lineHeight: 1.7 }}>
              Contact our legal team at <strong>legal@afyadiary.co.ke</strong> or by post at AfyaDiary Kenya Ltd, Westlands, Nairobi, Kenya.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}