import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  scan:      "M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2",
  inventory: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  profile:   "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  ai:        "M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-5 0v-15A2.5 2.5 0 019.5 2z M14.5 8A2.5 2.5 0 0117 10.5v8.5a2.5 2.5 0 01-5 0v-8.5A2.5 2.5 0 0114.5 8z",
  tips:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  mood:      "M12 2a10 10 0 100 20A10 10 0 0012 2z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  menu:      "M3 12h18 M3 6h18 M3 18h18",
  close:     "M18 6L6 18 M6 6l12 12",
  patient:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  medicine:  "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3M9 12h6 M12 9v6",
};

const NAV = [
  { section: "Main" },
  { to: "/chemist-dashboard", label: "Dashboard",   icon: "dashboard" },
  { to: "/chemist-scan",      label: "Scan QR",     icon: "scan"      },
  { to: "/chemist-inventory", label: "Inventory",   icon: "inventory" },
  { section: "Mental Wellness" },
  { to: "/ai-chat",           label: "AI Assistant",icon: "ai"        },
  { to: "/mental-health/tips",label: "Health Tips", icon: "tips"      },
  { to: "/mood-tracker",      label: "Mood Tracker",icon: "mood"      },
  { section: "Account" },
  { to: "/chemist-profile",   label: "My Profile",  icon: "profile"   },
];

export default function ChemistLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const initials = (user.name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />

      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        :root{
          --em-950:#022c22;--em-900:#064e3b;--em-800:#065f46;--em-700:#047857;
          --em-600:#059669;--em-500:#10b981;--em-400:#34d399;--em-100:#d1fae5;--em-50:#ecfdf5;
          --sl-900:#0f172a;--sl-800:#1e293b;--sl-700:#334155;--sl-600:#475569;
          --sl-500:#64748b;--sl-400:#94a3b8;--sl-300:#cbd5e1;--sl-200:#e2e8f0;
          --sl-100:#f1f5f9;--sl-50:#f8fafc;
          --sidebar:260px;--header:64px;
          --font-d:'Fraunces',Georgia,serif;--font-b:'DM Sans',system-ui,sans-serif;
        }
        html,body{margin:0;padding:0;font-family:var(--font-b);-webkit-font-smoothing:antialiased}
        body{background:#f6f8f7;color:var(--sl-900)}

        .shell{display:flex;height:100vh;overflow:hidden}

        /* Sidebar */
        .sb{width:var(--sidebar);background:var(--em-900);display:flex;flex-direction:column;
          flex-shrink:0;overflow-y:auto;overflow-x:hidden;z-index:50;transition:transform .3s ease}
        .sb-brand{padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .sb-logo{display:flex;align-items:center;gap:12px;text-decoration:none}
        .sb-icon{width:38px;height:38px;background:var(--em-500);border-radius:8px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.2rem}
        .sb-name{font-family:var(--font-d);font-size:1.05rem;font-weight:600;color:#fff;line-height:1.1}
        .sb-sub{font-size:.65rem;color:var(--em-400);font-weight:400;letter-spacing:.08em;text-transform:uppercase}
        .sb-nav{flex:1;padding:12px 10px}
        .sb-sec{font-size:.62rem;font-weight:600;color:var(--em-400);text-transform:uppercase;
          letter-spacing:.1em;padding:8px 10px 3px;margin-top:12px}
        .sb-sec:first-child{margin-top:0}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;
          color:rgba(255,255,255,.6);text-decoration:none;font-size:.875rem;font-weight:400;
          transition:all .15s ease;cursor:pointer;border:none;background:none;width:100%;text-align:left;margin-bottom:2px}
        .sb-link svg{flex-shrink:0;opacity:.7}
        .sb-link:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-link:hover svg{opacity:1}
        .sb-link.act{background:rgba(52,211,153,.15);color:var(--em-400)}
        .sb-link.act svg{opacity:1;color:var(--em-400)}
        .sb-foot{padding:12px 10px;border-top:1px solid rgba(255,255,255,.08)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:background .15s}
        .sb-user:hover{background:rgba(255,255,255,.06)}
        .sb-avatar{width:32px;height:32px;border-radius:50%;background:var(--em-600);
          display:flex;align-items:center;justify-content:center;font-weight:600;font-size:.75rem;color:#fff;flex-shrink:0}
        .sb-uname{font-size:.82rem;font-weight:500;color:#fff;line-height:1.2}
        .sb-urole{font-size:.68rem;color:var(--em-400);text-transform:capitalize}
        .sb-logout{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;
          color:rgba(255,100,100,.7);font-size:.875rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all .15s;margin-top:4px}
        .sb-logout:hover{background:rgba(220,38,38,.1);color:#f87171}

        /* Main */
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .topbar{height:var(--header);background:#fff;border-bottom:1px solid var(--sl-200);
          display:flex;align-items:center;justify-content:space-between;padding:0 28px;
          flex-shrink:0;gap:16px;position:sticky;top:0;z-index:40}
        .topbar-l{display:flex;align-items:center;gap:16px;flex:1;min-width:0}
        .topbar-r{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .t-search{display:flex;align-items:center;gap:8px;background:var(--sl-50);
          border:1.5px solid var(--sl-200);border-radius:999px;padding:7px 14px;
          width:min(300px,100%);transition:all .15s}
        .t-search:focus-within{border-color:var(--em-400);box-shadow:0 0 0 3px rgba(52,211,153,.1);background:#fff}
        .t-search input{border:none;background:none;outline:none;font-family:var(--font-b);font-size:.875rem;color:var(--sl-700);width:100%}
        .t-search input::placeholder{color:var(--sl-400)}
        .t-search svg{flex-shrink:0;color:var(--sl-400)}
        .notif-btn{position:relative;width:36px;height:36px;border-radius:8px;background:none;
          border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
          color:var(--sl-500);transition:all .15s}
        .notif-btn:hover{background:var(--sl-100);color:var(--sl-700)}
        .n-badge{position:absolute;top:3px;right:3px;width:15px;height:15px;background:#dc2626;
          color:#fff;border-radius:50%;font-size:.58rem;font-weight:700;display:flex;
          align-items:center;justify-content:center;border:2px solid #fff}
        .menu-btn{display:none;padding:7px;border:none;background:none;cursor:pointer;
          border-radius:7px;color:var(--sl-600);transition:background .15s}
        .menu-btn:hover{background:var(--sl-100)}
        .page{flex:1;overflow-y:auto;padding:32px}
        .overlay{display:none;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.4);backdrop-filter:blur(2px)}

        @media(max-width:1024px){
          .sb{position:fixed;top:0;left:0;bottom:0;transform:translateX(-100%);transition:transform .3s ease}
          .sb.open{transform:translateX(0)}
          .overlay.open{display:block}
          .menu-btn{display:flex;align-items:center;justify-content:center}
          .page{padding:24px 16px}
        }
        @media(max-width:640px){
          .page{padding:16px 12px}
          .topbar{padding:0 16px}
          .t-search{display:none}
        }
      `}</style>

      <div className="shell">
        {/* Overlay */}
        <div className={`overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />

        {/* Sidebar */}
        <aside className={`sb${open ? " open" : ""}`}>
          <div className="sb-brand">
            <Link to="/chemist-dashboard" className="sb-logo">
              <div className="sb-icon">🏥</div>
              <div>
                <div className="sb-name">AfyaDiary</div>
                <div className="sb-sub">Kenya · Chemist</div>
              </div>
            </Link>
          </div>

          <nav className="sb-nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={i} className="sb-sec">{item.section}</div>
              ) : (
                <Link key={item.to} to={item.to}
                  className={`sb-link${location.pathname === item.to ? " act" : ""}`}>
                  <Icon d={ICONS[item.icon]} />
                  <span>{item.label}</span>
                </Link>
              )
            )}
            <button className="sb-logout" onClick={logout}>
              <Icon d={ICONS.logout} />
              <span>Logout</span>
            </button>
          </nav>

          <div className="sb-foot">
            <div className="sb-user">
              <div className="sb-avatar">{initials}</div>
              <div>
                <div className="sb-uname">{user.name || "Chemist"}</div>
                <div className="sb-urole">Pharmacist</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-l">
              <button className="menu-btn" onClick={() => setOpen(true)}>
                <Icon d={ICONS.menu} size={20} />
              </button>
              <div className="t-search">
                <Icon d={ICONS.search} size={16} />
                <input placeholder="Search patients, medicines…" />
              </div>
            </div>
            <div className="topbar-r">
              <button className="notif-btn">
                <Icon d={ICONS.bell} size={18} />
                <span className="n-badge">3</span>
              </button>
              <div className="sb-avatar" style={{ width: 32, height: 32, fontSize: ".72rem" }}>{initials}</div>
            </div>
          </header>

          <div className="page">{children}</div>
        </div>
      </div>
    </>
  );
}