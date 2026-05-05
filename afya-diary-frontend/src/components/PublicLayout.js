import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 clamp(16px,4vw,48px)", height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(2,44,34,.97)" : "rgba(2,44,34,.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,.07)",
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,.2)" : "none",
      transition: "all .3s ease",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🏥</div>
        <div>
          <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1rem", fontWeight: 600, color: "#fff", lineHeight: 1.1 }}>AfyaDiary Kenya</div>
          <div style={{ fontSize: ".58rem", color: "#34d399", letterSpacing: ".1em", textTransform: "uppercase" }}>Digital Health Platform</div>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="pub-nav-desk">
        {[["/#features","Features"],["/#about","About"],["/#mental","Wellness"]].map(([href, label]) => (
          <a key={href} href={href} style={{ color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: ".85rem", padding: "6px 11px", borderRadius: 6, transition: "all .15s" }}
            onMouseOver={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
            onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,.75)"; e.currentTarget.style.background = "none"; }}>{label}</a>
        ))}
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,.15)", margin: "0 4px" }} />
        <Link to="/login" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontSize: ".85rem", padding: "6px 12px", borderRadius: 6 }}>Login</Link>
        <Link to="/register" style={{ background: "#10b981", color: "#fff", textDecoration: "none", fontSize: ".85rem", fontWeight: 500, padding: "7px 16px", borderRadius: 7, boxShadow: "0 2px 8px rgba(16,185,129,.3)" }}>Get Started</Link>
      </div>

      <button onClick={() => setMobileOpen(v => !v)} className="pub-nav-mob"
        style={{ display: "none", padding: 8, border: "none", background: "none", cursor: "pointer", color: "#fff", borderRadius: 6 }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d={mobileOpen ? "M18 6L6 18 M6 6l12 12" : "M3 12h18 M3 6h18 M3 18h18"} />
        </svg>
      </button>

      {mobileOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(2,44,34,.97)", borderTop: "1px solid rgba(255,255,255,.08)", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[["/#features","Features"],["/#about","About"],["/#mental","Wellness"],["/#stats","Impact"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", padding: "11px 0", fontSize: ".9rem", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{label}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", border: "1.5px solid rgba(255,255,255,.2)", borderRadius: 8, color: "#fff", textDecoration: "none", fontSize: ".85rem" }}>Login</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", background: "#10b981", borderRadius: 8, color: "#fff", textDecoration: "none", fontSize: ".85rem", fontWeight: 500 }}>Register</Link>
          </div>
        </div>
      )}

      <style>{`
        @media(min-width:769px){.pub-nav-desk{display:flex!important}.pub-nav-mob{display:none!important}}
        @media(max-width:768px){.pub-nav-desk{display:none!important}.pub-nav-mob{display:flex!important;align-items:center;justify-content:center}}
      `}</style>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#022c22", color: "rgba(255,255,255,.6)", padding: "52px 0 26px", marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 36 }}>
          <div style={{ maxWidth: 240 }}>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.05rem", fontWeight: 600, color: "#fff", marginBottom: 9 }}>AfyaDiary Kenya</div>
            <p style={{ fontSize: ".82rem", lineHeight: 1.75, marginBottom: 10 }}>Kenya's premier digital health platform connecting patients, pharmacists, and community health workers.</p>
            <div style={{ fontSize: ".74rem", color: "#34d399" }}>Made in Kenya with care</div>
          </div>

          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "12px 20px" }}>
            {[
              { title: "Platform",   links: [["Features","/features"],["Security","/security"],["Mobile App","/mobile-app"]] },
              { title: "Company",    links: [["About","/about"],["Careers","/careers"],["Contact","/contact"]] },
              { title: "Support",    links: [["Help Center","/faq"],["User Guides","/guides"],["API Docs","/api"]] },
              { title: "Legal",      links: [["Privacy","/privacy"],["Terms","/terms"],["Data Protection","/security"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ fontSize: ".68rem", fontWeight: 600, color: "#34d399", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>{title}</h4>
                {links.map(([label, to]) => (
                  <Link key={label} to={to} style={{ display: "block", color: "rgba(255,255,255,.52)", fontSize: ".82rem", padding: "3px 0", textDecoration: "none", transition: "color .15s" }}
                    onMouseOver={e => { e.currentTarget.style.color = "#fff"; }}
                    onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,.52)"; }}>{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "24px 0", fontSize: ".875rem" }}>
          {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
            <button key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", cursor: "pointer", color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; }}>
              <Icon />
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.07)", margin: "20px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, fontSize: ".74rem" }}>
          <span>2025 AfyaDiary Kenya Ltd. All rights reserved.</span>
          <div style={{ display: "flex", gap: 14 }}>
            {[["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"]].map(([l, to]) => (
              <Link key={l} to={to} style={{ color: "rgba(255,255,255,.4)", textDecoration: "none", transition: "color .15s" }}
                onMouseOver={e => { e.currentTarget.style.color = "#fff"; }}
                onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,.4)"; }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#f6f8f7;color:#0f172a;line-height:1.6}a{color:inherit}`}</style>
      <Nav />
      <div style={{ paddingTop: 68 }}>{children}</div>
      <Footer />
    </>
  );
}