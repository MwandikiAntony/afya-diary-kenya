import React from "react";

const C = {
  em600:"#059669",sl900:"#0f172a",sl600:"#475569",sl500:"#64748b",
  sl200:"#e2e8f0",sl100:"#f1f5f9",white:"#ffffff",
};

const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
        <div>
          {eyebrow && (
            <div style={{ fontSize:".68rem", fontWeight:700, color:C.em600, textTransform:"uppercase", letterSpacing:".12em", marginBottom:4 }}>
              {eyebrow}
            </div>
          )}
          <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(1.3rem,2.5vw,1.75rem)", fontWeight:400, color:C.sl900, lineHeight:1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize:".855rem", color:C.sl500, marginTop:5, lineHeight:1.6 }}>{subtitle}</p>
          )}
        </div>
        {action && <div style={{ flexShrink:0 }}>{action}</div>}
      </div>
    </div>
  );
}

export function Card({ children, style = {}, padding = "22px 20px" }) {
  return (
    <div style={{
      background:C.white, borderRadius:14, border:`1px solid ${C.sl200}`,
      boxShadow:"0 1px 4px rgba(0,0,0,.04)", padding, ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, sub, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
      <div>
        <div style={{ fontSize:".78rem", fontWeight:700, color:C.sl600, textTransform:"uppercase", letterSpacing:".08em" }}>{title}</div>
        {sub && <div style={{ fontSize:".74rem", color:C.sl500, marginTop:2 }}>{sub}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Btn({ children, onClick, type = "button", disabled = false, variant = "primary", size = "md", full = false, style = {} }) {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
    border:"none", cursor:disabled?"not-allowed":"pointer", fontFamily:"'DM Sans',system-ui,sans-serif",
    fontWeight:500, transition:"all .18s", textDecoration:"none", borderRadius:8,
    opacity: disabled ? .55 : 1,
    width: full ? "100%" : "auto",
    ...style,
  };
  const sizes = { sm:"7px 13px", md:"10px 18px", lg:"12px 24px" };
  const fSizes = { sm:".78rem", md:".875rem", lg:".9rem" };
  const variants = {
    primary: { background:"#059669", color:"#fff", boxShadow:"0 2px 8px rgba(5,150,105,.25)" },
    secondary: { background:C.sl100, color:C.sl700 },
    outline: { background:"none", color:C.sl700, border:`1.5px solid ${C.sl200}` },
    danger: { background:"#e72424", color:"#fff" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ ...base, padding:sizes[size], fontSize:fSizes[size], ...variants[variant] }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.filter="brightness(1.08)"; }}
      onMouseOut={e => { e.currentTarget.style.filter="none"; }}>
      {children}
    </button>
  );
}

export function Inp({ label, name, value, onChange, type = "text", placeholder, required = false, readOnly = false, error }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      {label && <label style={{ fontSize:".74rem", fontWeight:600, color:C.sl700, textTransform:"uppercase", letterSpacing:".06em" }}>{label}{required && " *"}</label>}
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} readOnly={readOnly}
        style={{
          padding:"10px 13px", borderRadius:8, border:`1.5px solid ${error?"#dc2626":C.sl200}`,
          fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a",
          outline:"none", transition:"all .15s", background:readOnly?"#f8fafc":"#fff", width:"100%",
        }}
        onFocus={e => { e.target.style.borderColor="#10b981"; e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,.1)"; }}
        onBlur={e => { e.target.style.borderColor=error?"#dc2626":C.sl200; e.target.style.boxShadow="none"; }}
      />
      {error && <span style={{ fontSize:".74rem", color:"#dc2626" }}>{error}</span>}
    </div>
  );
}

export function Badge({ children, color = "green" }) {
  const map = {
    green: { bg:"#ecfdf5", text:"#047857" },
    blue:  { bg:"#e0f2fe", text:"#0369a1" },
    amber: { bg:"#fef3c7", text:"#b45309" },
    red:   { bg:"#fee2e2", text:"#b91c1c" },
    gray:  { bg:"#f1f5f9", text:"#475569" },
    purple:{ bg:"#ede9fe", text:"#6d28d9" },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px", borderRadius:999, fontSize:".72rem", fontWeight:600, background:s.bg, color:s.text }}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ padding:"48px 24px", textAlign:"center" }}>
      <div style={{ width:52, height:52, borderRadius:12, background:C.sl100, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
        <Ic d={icon} size={22} />
      </div>
      <div style={{ fontSize:".95rem", fontWeight:600, color:C.sl700, marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:".82rem", color:C.sl500, lineHeight:1.65, maxWidth:280, margin:"0 auto" }}>{desc}</div>
    </div>
  );
}

export function Table({ headers, children, responsive = true }) {
  return (
    <div style={{ overflowX: responsive ? "auto" : "visible" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth: responsive ? 480 : "auto" }}>
        <thead>
          <tr style={{ background:C.sl100 }}>
            {headers.map(h => (
              <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:".7rem", fontWeight:700, color:C.sl500, textTransform:"uppercase", letterSpacing:".08em", borderBottom:`1px solid ${C.sl200}`, whiteSpace:"nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, onClick }) {
  return (
    <tr style={{ borderBottom:`1px solid ${C.sl100}`, transition:"background .1s", cursor:onClick?"pointer":"default" }}
      onMouseOver={e => { e.currentTarget.style.background=C.sl100; }}
      onMouseOut={e => { e.currentTarget.style.background="none"; }}
      onClick={onClick}>
      {children}
    </tr>
  );
}

export function TD({ children, muted = false, mono = false }) {
  return (
    <td style={{ padding:"11px 14px", fontSize:".845rem", color:muted?"#64748b":"#0f172a", fontFamily:mono?"monospace":"inherit", verticalAlign:"middle" }}>
      {children}
    </td>
  );
}

export function Modal({ open, onClose, title, children, maxWidth = 460 }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.42)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:C.white, borderRadius:18, padding:"28px 26px", width:"100%", maxWidth, boxShadow:"0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"1.15rem", fontWeight:400, color:C.sl900 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.sl400, borderRadius:6, padding:4, display:"flex" }}>
            <Ic d="M18 6L6 18 M6 6l12 12" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
export const BASE_STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#f6f8f7;color:#0f172a;line-height:1.6}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeUp .4s ease both}
  .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}.d4{animation-delay:.28s}
  @media(max-width:640px){.hide-mobile{display:none!important}}
  @media(min-width:641px){.show-mobile{display:none!important}}
`;