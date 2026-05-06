import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",
  sky600:"#0284c7",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",sl400:"#94a3b8",
  sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",white:"#ffffff",
};

const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV = [
  { section:"Health" },
  { to:"/dashboard",     label:"Dashboard",     icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { to:"/records",       label:"My Records",    icon:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { to:"/prescriptions", label:"Prescriptions", icon:"M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3M9 12h6 M12 9v6" },
  { to:"/appointments",  label:"Appointments",  icon:"M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { to:"/reminders",     label:"Reminders",     icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" },
  { to:"/notifications", label:"Notifications", icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" },
  { section:"Wellness" },
  { to:"/ai-chat",             label:"AI Assistant", icon:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { to:"/mental-health/tips",  label:"Health Tips",  icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { to:"/mood-tracker",        label:"Mood Tracker", icon:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
  { section:"Account" },
  { to:"/profile", label:"My Profile", icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" },
];

const LOGOUT_ICON = "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9";
const SEARCH_ICON = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0";
const BELL_ICON   = "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0";
const MENU_ICON   = "M3 12h18 M3 6h18 M3 18h18";

export default function PatientLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const initials = (user.name || "P").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => { setSideOpen(false); }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;padding:0;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#f6f8f7;color:${C.sl900}}
        .pt-shell{display:flex;height:100vh;overflow:hidden}
        .pt-sb{width:260px;background:${C.em900};display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;overflow-x:hidden;z-index:50;transition:transform .3s ease}
        .pt-brand{padding:18px 16px 14px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .pt-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .pt-logo-ic{width:34px;height:34px;border-radius:7px;background:${C.em600};display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .pt-logo-name{font-family:'Fraunces',Georgia,serif;font-size:.98rem;font-weight:600;color:#fff;line-height:1.1}
        .pt-logo-sub{font-size:.56rem;color:${C.em400};letter-spacing:.1em;text-transform:uppercase}
        .pt-nav{flex:1;padding:10px 8px}
        .pt-sec{font-size:.58rem;font-weight:700;color:${C.em400};text-transform:uppercase;letter-spacing:.12em;padding:10px 10px 3px;margin-top:10px}
        .pt-sec:first-child{margin-top:0}
        .pt-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;color:rgba(255,255,255,.58);text-decoration:none;font-size:.855rem;font-weight:400;transition:all .15s;cursor:pointer;border:none;background:none;width:100%;text-align:left;margin-bottom:2px}
        .pt-link:hover{background:rgba(255,255,255,.08);color:#fff}
        .pt-link.act{background:rgba(52,211,153,.14);color:${C.em400}}
        .pt-logout{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;color:rgba(255,100,100,.65);font-size:.855rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all .15s;margin-top:4px;font-family:'DM Sans',system-ui,sans-serif}
        .pt-logout:hover{background:rgba(220,38,38,.1);color:#f87171}
        .pt-foot{padding:10px 8px;border-top:1px solid rgba(255,255,255,.08)}
        .pt-user{display:flex;align-items:center;gap:10px;padding:8px 10px}
        .pt-avatar{width:32px;height:32px;border-radius:50%;background:${C.sky600};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.72rem;color:#fff;flex-shrink:0;border:1.5px solid rgba(255,255,255,.12)}
        .pt-uname{font-size:.82rem;font-weight:500;color:#fff;line-height:1.2}
        .pt-urole{font-size:.64rem;color:${C.em400}}
        .pt-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .pt-topbar{height:64px;background:${C.white};border-bottom:1px solid ${C.sl200};display:flex;align-items:center;justify-content:space-between;padding:0 22px;flex-shrink:0;gap:12px}
        .pt-tl{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
        .pt-tr{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .pt-search{display:flex;align-items:center;gap:8px;background:${C.sl50};border:1.5px solid ${C.sl200};border-radius:999px;padding:7px 13px;width:min(260px,100%);transition:all .15s}
        .pt-search:focus-within{border-color:${C.em400};box-shadow:0 0 0 3px rgba(52,211,153,.09);background:${C.white}}
        .pt-search input{border:none;background:none;outline:none;font-family:'DM Sans',system-ui,sans-serif;font-size:.855rem;color:${C.sl700};width:100%}
        .pt-search input::placeholder{color:${C.sl400}}
        .pt-search svg{flex-shrink:0;color:${C.sl400}}
        .pt-notif-btn{position:relative;width:34px;height:34px;border-radius:7px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${C.sl500};transition:all .15s}
        .pt-notif-btn:hover{background:${C.sl100};color:${C.sl700}}
        .pt-n-badge{position:absolute;top:2px;right:2px;width:14px;height:14px;background:#dc2626;color:#fff;border-radius:50%;font-size:.54rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid ${C.white}}
        .pt-menu-btn{display:none;padding:7px;border:none;background:none;cursor:pointer;border-radius:7px;color:${C.sl600};transition:background .15s}
        .pt-menu-btn:hover{background:${C.sl100}}
        .pt-page{flex:1;overflow-y:auto;padding:26px}
        .pt-overlay{display:none;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.42);backdrop-filter:blur(2px)}
        @media(max-width:1024px){
          .pt-sb{position:fixed;top:0;left:0;bottom:0;transform:translateX(-100%)}
          .pt-sb.open{transform:translateX(0)}
          .pt-overlay.open{display:block}
          .pt-menu-btn{display:flex;align-items:center;justify-content:center}
          .pt-page{padding:18px 12px}
        }
        @media(max-width:640px){
          .pt-page{padding:12px 8px}
          .pt-topbar{padding:0 12px}
          .pt-search{display:none}
        }
      `}</style>

      <div className="pt-shell">
        <div className={`pt-overlay${sideOpen ? " open" : ""}`} onClick={() => setSideOpen(false)} />

        <aside className={`pt-sb${sideOpen ? " open" : ""}`}>
          <div className="pt-brand">
            <Link to="/dashboard" className="pt-logo">
              <div className="pt-logo-ic">
                <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" size={17} />
              </div>
              <div>
                <div className="pt-logo-name">AfyaDiary Kenya</div>
                <div className="pt-logo-sub">Patient Portal</div>
              </div>
            </Link>
          </div>

          <nav className="pt-nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={`sec-${i}`} className="pt-sec">{item.section}</div>
              ) : (
                <Link key={item.to} to={item.to}
                  className={`pt-link${location.pathname === item.to ? " act" : ""}`}>
                  <Ic d={item.icon} />
                  <span>{item.label}</span>
                </Link>
              )
            )}
            <button className="pt-logout" onClick={logout}>
              <Ic d={LOGOUT_ICON} />
              <span>Logout</span>
            </button>
          </nav>

          <div className="pt-foot">
            <div className="pt-user">
              <div className="pt-avatar">{initials}</div>
              <div>
                <div className="pt-uname">{user.name || "Patient"}</div>
                <div className="pt-urole">{user.shaNumber ? `SHA: ${user.shaNumber}` : "Patient"}</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="pt-main">
          <header className="pt-topbar">
            <div className="pt-tl">
              <button className="pt-menu-btn" onClick={() => setSideOpen(true)}>
                <Ic d={MENU_ICON} size={20} />
              </button>
              <div className="pt-search">
                <Ic d={SEARCH_ICON} size={15} />
                <input placeholder="Search records, appointments..." aria-label="Search" />
              </div>
            </div>
            <div className="pt-tr">
              <button className="pt-notif-btn" aria-label="Notifications">
                <Ic d={BELL_ICON} size={17} />
                <span className="pt-n-badge" aria-hidden="true">1</span>
              </button>
              <div className="pt-avatar" style={{ width:30, height:30, fontSize:".66rem" }}>{initials}</div>
            </div>
          </header>
          <main className="pt-page">{children}</main>
        </div>
      </div>
    </>
  );
}