import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";

const C = {
  em900: "#064e3b", em600: "#059669", em500: "#10b981", em400: "#34d399",
  em100: "#d1fae5", em50: "#ecfdf5",
  sky600: "#0284c7", sky100: "#e0f2fe",
  sl900: "#0f172a", sl700: "#334155", sl600: "#475569", sl500: "#64748b",
  sl400: "#94a3b8", sl200: "#e2e8f0", sl100: "#f1f5f9",
  bg: "#f6f8f7", white: "#ffffff",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1.5px solid ${C.sl200}`, fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: ".875rem", color: C.sl900, outline: "none",
    transition: "border-color .15s, box-shadow .15s", background: C.white,
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg,#022c22,${C.em900})`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Get In Touch</div>
          <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem", lineHeight: 1.8 }}>
            Have a question, feedback, or need support? Our team is here to help.
          </p>
        </div>
      </section>

      <section style={{ background: C.bg, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 48, alignItems: "flex-start" }} className="contact-grid">

            {/* Info */}
            <div>
              <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.4rem", fontWeight: 400, color: C.sl900, marginBottom: 24 }}>
                Talk to our team
              </h2>
              {[
                { icon: "📍", title: "Head Office", lines: ["AfyaDiary Kenya Ltd", "Westlands, Nairobi", "Kenya"] },
                { icon: "📞", title: "Phone", lines: ["+254 712 345 678", "Mon to Fri, 8am to 6pm EAT"] },
                { icon: "📧", title: "Email", lines: ["support@afyadiary.co.ke", "partnerships@afyadiary.co.ke"] },
                { icon: "💬", title: "WhatsApp", lines: ["+254 712 345 678", "Quick responses within 2 hours"] },
              ].map(({ icon, title, lines }) => (
                <div key={title} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: C.em50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0, border: `1px solid ${C.em100}` }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl900, marginBottom: 3 }}>{title}</div>
                    {lines.map(l => <div key={l} style={{ fontSize: ".8rem", color: C.sl500, lineHeight: 1.6 }}>{l}</div>)}
                  </div>
                </div>
              ))}

              <div style={{ background: C.white, border: `1px solid ${C.sl200}`, borderRadius: 14, padding: "18px 20px", marginTop: 8 }}>
                <div style={{ fontSize: ".8rem", fontWeight: 600, color: C.sl900, marginBottom: 6 }}>Office Hours</div>
                <div style={{ fontSize: ".78rem", color: C.sl500, lineHeight: 1.8 }}>
                  Monday to Friday: 8:00am to 6:00pm EAT<br />
                  Saturday: 9:00am to 1:00pm EAT<br />
                  Sunday: Closed
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.sl200}`, padding: "36px 32px", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.4rem", fontWeight: 400, color: C.sl900, marginBottom: 10 }}>Message sent!</h3>
                  <p style={{ color: C.sl500, fontSize: ".9rem", lineHeight: 1.7 }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    style={{ marginTop: 24, background: C.em600, color: "#fff", padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontSize: ".875rem" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.25rem", fontWeight: 400, color: C.sl900, marginBottom: 24 }}>Send us a message</h3>
                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-two">
                      {[["name","Full Name","text"],["email","Email Address","email"]].map(([name, placeholder, type]) => (
                        <div key={name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <label style={{ fontSize: ".78rem", fontWeight: 500, color: C.sl700 }}>{placeholder}</label>
                          <input name={name} type={type} required value={form[name]} onChange={handle} placeholder={placeholder} style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = C.em500; e.target.style.boxShadow = `0 0 0 3px rgba(16,185,129,.1)`; }}
                            onBlur={e => { e.target.style.borderColor = C.sl200; e.target.style.boxShadow = "none"; }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: ".78rem", fontWeight: 500, color: C.sl700 }}>Subject</label>
                      <select name="subject" value={form.subject} onChange={handle} required style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", cursor: "pointer" }}
                        onFocus={e => { e.target.style.borderColor = C.em500; e.target.style.boxShadow = `0 0 0 3px rgba(16,185,129,.1)`; }}
                        onBlur={e => { e.target.style.borderColor = C.sl200; e.target.style.boxShadow = "none"; }}>
                        <option value="">Select a subject</option>
                        <option>General Enquiry</option>
                        <option>Technical Support</option>
                        <option>Partnership</option>
                        <option>Billing</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: ".78rem", fontWeight: 500, color: C.sl700 }}>Message</label>
                      <textarea name="message" rows={5} required value={form.message} onChange={handle} placeholder="Tell us how we can help..." style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                        onFocus={e => { e.target.style.borderColor = C.em500; e.target.style.boxShadow = `0 0 0 3px rgba(16,185,129,.1)`; }}
                        onBlur={e => { e.target.style.borderColor = C.sl200; e.target.style.boxShadow = "none"; }} />
                    </div>
                    <button type="submit" disabled={loading} style={{
                      background: loading ? C.sl300 : C.em600, color: "#fff",
                      padding: "12px", borderRadius: 9, border: "none", cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: 600, fontSize: ".9rem", fontFamily: "'DM Sans',system-ui,sans-serif",
                      transition: "all .2s", boxShadow: loading ? "none" : `0 4px 14px rgba(5,150,105,.3)`,
                    }}>
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important}.form-two{grid-template-columns:1fr!important}}`}</style>
    </PublicLayout>
  );
}