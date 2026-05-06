import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",
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
  { section:"Main" },
  { to:"/chemist-dashboard", label:"Dashboard",    icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { to:"/chemist-scan",      label:"Scan QR",      icon:"M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" },
  { to:"/chemist-inventory", label:"Inventory",    icon:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" },
  { section:"Wellness" },
  { to:"/ai-chat",             label:"AI Assistant", icon:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { to:"/mental-health/tips",  label:"Health Tips",  icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { to:"/mood-tracker",        label:"Mood Tracker", icon:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
  { section:"Account" },
  { to:"/chemist-profile", label:"My Profile", icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" },
];

const LOGOUT_ICON = "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9";
const SEARCH_ICON = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0";
const BELL_ICON   = "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0";
const MENU_ICON   = "M3 12h18 M3 6h18 M3 18h18";

export default function ChemistLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const initials = (user.name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

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
        .c-shell{display:flex;height:100vh;overflow:hidden}
        .c-sb{width:260px;background:${C.em900};display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;overflow-x:hidden;z-index:50;transition:transform .3s ease}
        .c-brand{padding:18px 16px 14px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .c-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .c-logo-ic{width:34px;height:34px;border-radius:7px;background:${C.em600};display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .c-logo-name{font-family:'Fraunces',Georgia,serif;font-size:.98rem;font-weight:600;color:#fff;line-height:1.1}
        .c-logo-sub{font-size:.56rem;color:${C.em400};letter-spacing:.1em;text-transform:uppercase}
        .c-nav{flex:1;padding:10px 8px}
        .c-sec{font-size:.58rem;font-weight:700;color:${C.em400};text-transform:uppercase;letter-spacing:.12em;padding:10px 10px 3px;margin-top:10px}
        .c-sec:first-child{margin-top:0}
        .c-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;color:rgba(255,255,255,.58);text-decoration:none;font-size:.855rem;font-weight:400;transition:all .15s;cursor:pointer;border:none;background:none;width:100%;text-align:left;margin-bottom:2px}
        .c-link:hover{background:rgba(255,255,255,.08);color:#fff}
        .c-link.act{background:rgba(52,211,153,.14);color:${C.em400}}
        .c-link.act svg{color:${C.em400}}
        .c-logout{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;color:rgba(255,100,100,.65);font-size:.855rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all .15s;margin-top:4px;font-family:'DM Sans',system-ui,sans-serif}
        .c-logout:hover{background:rgba(220,38,38,.1);color:#f87171}
        .c-foot{padding:10px 8px;border-top:1px solid rgba(255,255,255,.08)}
        .c-user{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px}
        .c-avatar{width:32px;height:32px;border-radius:50%;background:${C.em700};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.72rem;color:#fff;flex-shrink:0;border:1.5px solid rgba(255,255,255,.12)}
        .c-uname{font-size:.82rem;font-weight:500;color:#fff;line-height:1.2}
        .c-urole{font-size:.64rem;color:${C.em400}}
        .c-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .c-topbar{height:64px;background:${C.white};border-bottom:1px solid ${C.sl200};display:flex;align-items:center;justify-content:space-between;padding:0 22px;flex-shrink:0;gap:12px}
        .c-tl{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
        .c-tr{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .c-search{display:flex;align-items:center;gap:8px;background:${C.sl50};border:1.5px solid ${C.sl200};border-radius:999px;padding:7px 13px;width:min(260px,100%);transition:all .15s}
        .c-search:focus-within{border-color:${C.em400};box-shadow:0 0 0 3px rgba(52,211,153,.09);background:${C.white}}
        .c-search input{border:none;background:none;outline:none;font-family:'DM Sans',system-ui,sans-serif;font-size:.855rem;color:${C.sl700};width:100%}
        .c-search input::placeholder{color:${C.sl400}}
        .c-search svg{flex-shrink:0;color:${C.sl400}}
        .c-notif-btn{position:relative;width:34px;height:34px;border-radius:7px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${C.sl500};transition:all .15s}
        .c-notif-btn:hover{background:${C.sl100};color:${C.sl700}}
        .c-n-badge{position:absolute;top:2px;right:2px;width:14px;height:14px;background:#dc2626;color:#fff;border-radius:50%;font-size:.54rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid ${C.white}}
        .c-menu-btn{display:none;padding:7px;border:none;background:none;cursor:pointer;border-radius:7px;color:${C.sl600};transition:background .15s}
        .c-menu-btn:hover{background:${C.sl100}}
        .c-page{flex:1;overflow-y:auto;padding:26px}
        .c-overlay{display:none;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.42);backdrop-filter:blur(2px)}
        @media(max-width:1024px){
          .c-sb{position:fixed;top:0;left:0;bottom:0;transform:translateX(-100%)}
          .c-sb.open{transform:translateX(0)}
          .c-overlay.open{display:block}
          .c-menu-btn{display:flex;align-items:center;justify-content:center}
          .c-page{padding:18px 12px}
        }
        @media(max-width:640px){
          .c-page{padding:12px 8px}
          .c-topbar{padding:0 12px}
          .c-search{display:none}
        }
      `}</style>

      <div className="c-shell">
        <div className={`c-overlay${sideOpen ? " open" : ""}`} onClick={() => setSideOpen(false)} />

        <aside className={`c-sb${sideOpen ? " open" : ""}`}>
          <div className="c-brand">
            <Link to="/chemist-dashboard" className="c-logo">
              <div className="c-logo-ic">
                <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" size={17} />
              </div>
              <div>
                <div className="c-logo-name">AfyaDiary Kenya</div>
                <div className="c-logo-sub">Chemist Portal</div>
              </div>
            </Link>
          </div>

          <nav className="c-nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={`sec-${i}`} className="c-sec">{item.section}</div>
              ) : (
                <Link key={item.to} to={item.to}
                  className={`c-link${location.pathname === item.to ? " act" : ""}`}>
                  <Ic d={item.icon} />
                  <span>{item.label}</span>
                </Link>
              )
            )}
            <button className="c-logout" onClick={logout}>
              <Ic d={LOGOUT_ICON} />
              <span>Logout</span>
            </button>
          </nav>

          <div className="c-foot">
            <div className="c-user">
              <div className="c-avatar">{initials}</div>
              <div>
                <div className="c-uname">{user.name || "Chemist"}</div>
                <div className="c-urole">Pharmacist</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="c-main">
          <header className="c-topbar">
            <div className="c-tl">
              <button className="c-menu-btn" onClick={() => setSideOpen(true)}>
                <Ic d={MENU_ICON} size={20} />
              </button>
              <div className="c-search">
                <Ic d={SEARCH_ICON} size={15} />
                <input placeholder="Search patients, medicines..." aria-label="Search" />
              </div>
            </div>
            <div className="c-tr">
              <button className="c-notif-btn" aria-label="Notifications">
                <Ic d={BELL_ICON} size={17} />
                <span className="c-n-badge" aria-hidden="true">3</span>
              </button>
              <div className="c-avatar" style={{ width:30, height:30, fontSize:".66rem" }}>{initials}</div>
            </div>
          </header>
          <main className="c-page">{children}</main>
        </div>
      </div>
    </>
  );
}