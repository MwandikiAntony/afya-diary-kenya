import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

/* ── tokens ── */
const C = {
  em950:"#022c22",em900:"#064e3b",em800:"#065f46",em700:"#047857",
  em600:"#059669",em500:"#10b981",em400:"#34d399",em200:"#a7f3d0",
  em100:"#d1fae5",em50:"#ecfdf5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  pur600:"#7c3aed",pur100:"#ede9fe",
  amb600:"#d97706",amb100:"#fef3c7",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",
  white:"#ffffff",bg:"#f6f8f7",
};

/* ── SVG icon helper ── */
const Ic = ({ d, size = 20, stroke = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ── intersection observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── animated counter ── */
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1);
          const ease = p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: .3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── reveal wrapper ── */
function Reveal({ children, delay = 0, from = "bottom", className = "" }) {
  const [ref, visible] = useReveal();
  const tx = from === "left" ? "-24px" : from === "right" ? "24px" : "0";
  const ty = from === "bottom" ? "28px" : from === "top" ? "-28px" : "0";
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translate(${tx},${ty})`,
      transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [["#features","Features"],["#about","About"],["#impact","Impact"],["#wellness","Wellness"]];
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      height:68,padding:"0 clamp(16px,4vw,52px)",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background: scrolled ? "rgba(2,44,34,.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.07)" : "none",
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,.18)" : "none",
      transition:"all .35s ease",
    }}>
      <Link to="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
        <div style={{width:34,height:34,borderRadius:8,background:`linear-gradient(135deg,${C.em500},${C.em700})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" size={18} stroke="#fff" sw={2} />
        </div>
        <div>
          <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1rem",fontWeight:600,color:"#fff",lineHeight:1.1}}>AfyaDiary Kenya</div>
          <div style={{fontSize:".56rem",color:C.em400,letterSpacing:".1em",textTransform:"uppercase"}}>Digital Health Platform</div>
        </div>
      </Link>

      <div style={{display:"flex",alignItems:"center",gap:4}} className="nd">
        {links.map(([h,l]) => (
          <a key={h} href={h} style={{color:"rgba(255,255,255,.75)",textDecoration:"none",fontSize:".855rem",padding:"6px 11px",borderRadius:6,transition:"all .15s"}}
            onMouseOver={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,.08)"}}
            onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.75)";e.currentTarget.style.background="none"}}>{l}</a>
        ))}
        <div style={{width:1,height:18,background:"rgba(255,255,255,.15)",margin:"0 6px"}}/>
        <Link to="/login" style={{color:"rgba(255,255,255,.8)",textDecoration:"none",fontSize:".855rem",padding:"7px 13px",borderRadius:6,transition:"all .15s"}}>Login</Link>
        <Link to="/register" style={{background:C.em600,color:"#fff",textDecoration:"none",fontSize:".855rem",fontWeight:500,padding:"8px 18px",borderRadius:8,boxShadow:`0 2px 10px ${C.em600}50`,transition:"all .2s"}}
          onMouseOver={e=>{e.currentTarget.style.background=C.em700;e.currentTarget.style.transform="translateY(-1px)"}}
          onMouseOut={e=>{e.currentTarget.style.background=C.em600;e.currentTarget.style.transform="none"}}>Get Started</Link>
      </div>

      <button onClick={()=>setOpen(v=>!v)} className="nm" style={{display:"none",padding:8,border:"none",background:"none",cursor:"pointer",color:"#fff",borderRadius:6}}>
        <Ic d={open?"M18 6L6 18 M6 6l12 12":"M3 12h18 M3 6h18 M3 18h18"} size={22}/>
      </button>

      {open && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"rgba(2,44,34,.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,.08)",padding:"16px 20px 24px",display:"flex",flexDirection:"column",gap:2}}>
          {links.map(([h,l])=>(
            <a key={h} href={h} onClick={()=>setOpen(false)} style={{color:"rgba(255,255,255,.8)",textDecoration:"none",padding:"12px 0",fontSize:".9rem",borderBottom:"1px solid rgba(255,255,255,.06)"}}>{l}</a>
          ))}
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <Link to="/login" onClick={()=>setOpen(false)} style={{flex:1,textAlign:"center",padding:"11px",border:"1.5px solid rgba(255,255,255,.2)",borderRadius:8,color:"#fff",textDecoration:"none",fontSize:".855rem"}}>Login</Link>
            <Link to="/register" onClick={()=>setOpen(false)} style={{flex:1,textAlign:"center",padding:"11px",background:C.em600,borderRadius:8,color:"#fff",textDecoration:"none",fontSize:".855rem",fontWeight:500}}>Register</Link>
          </div>
        </div>
      )}
      <style>{`@media(min-width:769px){.nd{display:flex!important}.nm{display:none!important}}@media(max-width:768px){.nd{display:none!important}.nm{display:flex!important;align-items:center;justify-content:center}}`}</style>
    </nav>
  );
}

/* ── footer col ── */
function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{fontSize:".68rem",fontWeight:700,color:C.em400,textTransform:"uppercase",letterSpacing:".12em",marginBottom:14}}>{title}</h4>
      {links.map(([l,to])=>(
        <Link key={l} to={to} style={{display:"block",color:"rgba(255,255,255,.52)",fontSize:".84rem",padding:"4px 0",textDecoration:"none",transition:"color .15s"}}
          onMouseOver={e=>{e.currentTarget.style.color="#fff"}}
          onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.52)"}}>{l}</Link>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:${C.bg};color:${C.sl900};line-height:1.6;scroll-behavior:smooth}
        a{color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        .hero-fade{animation:fadeUp .9s ease both}
        .d1{animation-delay:.1s}.d2{animation-delay:.28s}.d3{animation-delay:.46s}.d4{animation-delay:.62s}
        .float{animation:floatY 7s ease-in-out infinite}
        .feat-card{background:${C.white};border-radius:16px;border:1px solid ${C.sl200};padding:28px 22px;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .28s;position:relative;overflow:hidden}
        .feat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${C.em500},${C.em700});opacity:0;transition:opacity .28s}
        .feat-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(0,0,0,.09)}
        .feat-card:hover::after{opacity:1}
        .role-card{border-radius:20px;padding:32px 26px;transition:all .28s;text-decoration:none;display:block}
        .role-card:hover{transform:translateY(-7px);box-shadow:0 24px 48px rgba(0,0,0,.16)}
        .quote-card{background:${C.white};border-radius:16px;border:1px solid ${C.sl200};padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .28s}
        .quote-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.09)}
        .stat-tile{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:28px;text-align:center;backdrop-filter:blur(12px);transition:all .28s}
        .stat-tile:hover{background:rgba(255,255,255,.1);transform:translateY(-3px)}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.sl300};border-radius:3px}
        @media(max-width:900px){.two-col{grid-template-columns:1fr!important}.role-grid{grid-template-columns:1fr!important}.feat-4{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:640px){.stat-grid{grid-template-columns:repeat(2,1fr)!important}.quote-grid{grid-template-columns:1fr!important}.foot-grid{grid-template-columns:repeat(2,1fr)!important}.feat-4{grid-template-columns:1fr!important}}
        @media(max-width:420px){.stat-grid{grid-template-columns:1fr!important}.foot-grid{grid-template-columns:1fr!important}}
      `}</style>

      <Nav />

      {/* ── HERO ── */}
      <section style={{position:"relative",minHeight:"96vh",display:"flex",flexDirection:"column",paddingTop:68,overflow:"hidden"}}>
        {/* Real background image, no tinted overlay grid */}
        <img src="/images/Hero.png" alt="Trusted Medical Care for Every Kenyan"
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:"scale(1.03)"}}/>
        {/* Clean dark gradient only on the left where text is */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(2,44,34,.88) 0%,rgba(6,78,59,.65) 45%,rgba(0,0,0,.1) 100%)"}}/>

        <div style={{position:"relative",zIndex:2,flex:1,display:"flex",alignItems:"center",maxWidth:1200,margin:"0 auto",width:"100%",padding:"clamp(48px,8vw,100px) clamp(16px,4vw,52px) clamp(48px,6vw,80px)"}}>
          <div style={{maxWidth:580}}>
        
            <h1 className="hero-fade d1" style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(2.1rem,5vw,3.8rem)",fontWeight:300,color:"#fff",lineHeight:1.1,marginBottom:20,letterSpacing:"-.02em"}}>
              Trusted Medical Care<br/>
              <em style={{fontStyle:"italic",color:C.em400}}>For Every Kenyan.</em>
            </h1>

            <p className="hero-fade d2" style={{fontSize:"clamp(.875rem,1.8vw,1.05rem)",color:"rgba(255,255,255,.72)",lineHeight:1.82,maxWidth:500,marginBottom:34}}>
              Manage patients, track appointments, store records, and never miss important reminders. Built for Kenya's healthcare workers and communities.
            </p>

            <div className="hero-fade d3" style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:44}}>
              <Link to="/dashboard" style={{background:C.em600,color:"#fff",textDecoration:"none",padding:"12px 22px",borderRadius:9,fontWeight:500,fontSize:".875rem",boxShadow:`0 4px 16px ${C.em600}50`,transition:"all .2s"}}>Patient Portal</Link>
              <Link to="/chv-dashboard" style={{background:C.sky600,color:"#fff",textDecoration:"none",padding:"12px 22px",borderRadius:9,fontWeight:500,fontSize:".875rem",boxShadow:`0 4px 14px ${C.sky600}45`,transition:"all .2s"}}>CHV Portal</Link>
              <Link to="/chemist-dashboard" style={{background:C.pur600,color:"#fff",textDecoration:"none",padding:"12px 22px",borderRadius:9,fontWeight:500,fontSize:".875rem",boxShadow:`0 4px 14px ${C.pur600}45`,transition:"all .2s"}}>Chemist Portal</Link>
            </div>

            <div className="hero-fade d4" style={{display:"flex",alignItems:"center",gap:14,color:"rgba(255,255,255,.45)",fontSize:".78rem"}}>
              <div style={{display:"flex"}}>
                {[C.em500,C.sky600,C.pur600,C.amb600].map((bg,i)=>(
                  <div key={i} style={{width:28,height:28,borderRadius:"50%",background:bg,border:"2px solid rgba(255,255,255,.2)",marginLeft:i?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",color:"#fff",fontWeight:700}}>{["N","W","A","K"][i]}</div>
                ))}
              </div>
              <span>Trusted by <strong style={{color:"rgba(255,255,255,.75)"}}>2,400+</strong> healthcare workers</span>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:"relative",zIndex:2,width:"100%",display:"block",flexShrink:0}}>
          <path d="M0 60L80 45C160 30 320 0 480 0C640 0 800 30 960 40C1120 50 1280 30 1360 20L1440 10V60H0Z" fill={C.bg}/>
        </svg>
      </section>

      {/* ── MENTAL HEALTH BANNER ── */}
      <section style={{background:C.sky100,padding:"clamp(32px,5vw,52px) 0"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
          <Reveal>
            <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.3rem,2.5vw,1.8rem)",fontWeight:400,color:"#0c4a6e",marginBottom:10}}>
              Feeling stressed or overwhelmed?
            </h2>
            <p style={{color:"#0369a1",marginBottom:22,fontSize:".9rem",lineHeight:1.7}}>
              Get mental health support and talk with our AI Wellness Assistant at no cost.
            </p>
            <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:10}}>
              <Link to="/ai-chat" style={{background:C.sky600,color:"#fff",padding:"10px 22px",borderRadius:8,textDecoration:"none",fontWeight:500,fontSize:".875rem",transition:"all .2s"}}>Get Help Now</Link>
              <Link to="/mental-health/tips" style={{border:`1.5px solid ${C.sky600}`,color:C.sky600,padding:"10px 22px",borderRadius:8,textDecoration:"none",fontWeight:500,fontSize:".875rem",transition:"all .2s"}}>Learn More</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES with Mobilemoc.png ── */}
      <section id="features" style={{padding:"clamp(64px,8vw,100px) 0",background:C.white}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:52}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:C.em600,textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Platform Features</div>
              <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:400,color:C.sl900,marginBottom:12}}>
                Smarter Healthcare. Simple. Secure.
              </h2>
              <p style={{color:C.sl500,fontSize:".9rem",maxWidth:460,margin:"0 auto",lineHeight:1.75}}>
                Everything needed to deliver better healthcare outcomes for Kenyan communities.
              </p>
            </div>
          </Reveal>

          <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <div className="feat-4" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {icon:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",bg:C.em50,  title:"Patient Management", desc:"Register and manage patient records with SHA number integration and QR code identification."},
                {icon:"M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",bg:C.sky100,title:"Appointments",         desc:"Automate scheduling and send smart SMS reminders to reduce missed visits."},
                {icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                                   bg:C.em50,  title:"Data Security",       desc:"End-to-end encryption with role-based access and full Kenya Data Protection Act compliance."},
                {icon:"M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3",     bg:C.pur100,title:"Medicine Dispensing",  desc:"Real-time inventory tracking with dispensing logs and low-stock alerts for pharmacists."},
              ].map(({icon,bg,title,desc},i)=>(
                <Reveal key={title} delay={i*.08}>
                  <div className="feat-card">
                    <div style={{width:42,height:42,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                      <Ic d={icon} size={20} stroke={C.em700}/>
                    </div>
                    <h3 style={{fontSize:".9rem",fontWeight:600,color:C.sl900,marginBottom:6}}>{title}</h3>
                    <p style={{fontSize:".8rem",color:C.sl500,lineHeight:1.7}}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal from="right">
              <div style={{display:"flex",justifyContent:"center",position:"relative"}}>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:320,height:320,background:`radial-gradient(circle,${C.em100},transparent 70%)`,borderRadius:"50%",pointerEvents:"none"}}/>
                <img src="/images/Mobilemoc.png" alt="AfyaDiary Kenya mobile application" className="float"
                  style={{width:"100%",maxWidth:"clamp(180px,36vw,320px)",filter:"drop-shadow(0 24px 48px rgba(0,0,0,.14))",position:"relative",zIndex:2}}/>
              </div>
            </Reveal>
          </div>

          <Reveal delay={.1}>
            <div style={{textAlign:"center",marginTop:44}}>
              <Link to="/features" style={{display:"inline-block",background:"#1d4ed8",color:"#fff",padding:"11px 26px",borderRadius:8,fontWeight:500,textDecoration:"none",fontSize:".875rem",boxShadow:"0 4px 14px rgba(29,78,216,.28)"}}>
                Explore All Features
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT with about-healthcare-team.png ── */}
      <section id="about" style={{padding:"clamp(64px,8vw,100px) 0",background:C.bg}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <Reveal from="left">
              <div style={{position:"relative"}}>
                <img src="/images/about-healthcare-team.png" alt="Healthcare professionals collaborating" className="float"
                  style={{borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,.13)",width:"100%",height:"auto",objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",bottom:-16,right:-16,background:C.white,borderRadius:14,padding:"14px 20px",boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:`1px solid ${C.sl200}`}}>
                  <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1.4rem",fontWeight:400,color:C.em600}}>47</div>
                  <div style={{fontSize:".7rem",color:C.sl500,textTransform:"uppercase",letterSpacing:".06em"}}>Counties covered</div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div style={{fontSize:".7rem",fontWeight:700,color:C.em600,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>About Us</div>
                <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:400,color:C.sl900,lineHeight:1.12,marginBottom:16}}>
                  About <span style={{color:C.em600}}>AfyaDiary Kenya</span>
                </h2>
              </Reveal>
              <Reveal delay={.1}>
                <p style={{color:C.sl600,fontSize:".925rem",lineHeight:1.82,marginBottom:16}}>
                  AfyaDiary Kenya is a modern healthcare management platform designed to connect patients, chemists, hospitals, and community health volunteers. Our goal is to make healthcare data simple, secure, and accessible for everyone.
                </p>
                <p style={{color:C.sl600,fontSize:".925rem",lineHeight:1.82,marginBottom:26}}>
                  Built by a Kenyan team that spent time in clinics, pharmacies, and villages across the country, understanding the real problems before writing a single line of code.
                </p>
              </Reveal>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:30}}>
                {[
                  {icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",title:"Our Mission",desc:"Improve healthcare accessibility through secure, human-centred digital innovation."},
                  {icon:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",title:"Our Vision",desc:"A connected Kenya where every citizen can access efficient, reliable digital health services."},
                ].map(({icon,title,desc},i)=>(
                  <Reveal key={title} delay={.1+i*.1}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:40,height:40,borderRadius:10,background:C.em50,border:`1px solid ${C.em100}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Ic d={icon} size={18} stroke={C.em700}/>
                      </div>
                      <div>
                        <h4 style={{fontSize:".875rem",fontWeight:600,color:C.sl900,marginBottom:4}}>{title}</h4>
                        <p style={{fontSize:".78rem",color:C.sl500,lineHeight:1.65}}>{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={.2}>
                <Link to="/about" style={{display:"inline-block",background:"#1d4ed8",color:"#fff",padding:"11px 26px",borderRadius:8,fontWeight:500,textDecoration:"none",fontSize:".875rem",boxShadow:"0 4px 14px rgba(29,78,216,.25)"}}>Learn More</Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section id="impact" style={{background:`linear-gradient(135deg,${C.em950},${C.em900},#065f46)`,padding:"clamp(64px,8vw,100px) 0"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
          <Reveal>
            <div style={{fontSize:".7rem",fontWeight:700,color:C.em400,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Our Impact</div>
            <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:300,color:"#fff",marginBottom:52}}>
              Improving health outcomes across Kenya
            </h2>
          </Reveal>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[
              {n:12400,s:"+",label:"Patients Registered"},
              {n:340,  s:"+",label:"Healthcare Facilities"},
              {n:95,   s:"%",label:"SMS Delivery Rate"},
              {n:2800, s:"+",label:"Medicines Dispensed"},
            ].map(({n,s,label},i)=>(
              <Reveal key={label} delay={i*.08}>
                <div className="stat-tile">
                  <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:300,color:"#fff",lineHeight:1}}>
                    <Counter target={n} suffix={s}/>
                  </div>
                  <div style={{fontSize:".7rem",color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".1em",marginTop:10}}>{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{padding:"clamp(64px,8vw,100px) 0",background:C.white}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:C.em600,textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Who Uses AfyaDiary</div>
              <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:400,color:C.sl900}}>
                Built for every role in the care chain
              </h2>
            </div>
          </Reveal>
          <div className="role-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[
              {title:"Patients",sub:"Your health, your records",color:"#064e3b",accent:C.em500,to:"/dashboard",desc:"Access medical records, prescriptions, book appointments, and track your health journey.",features:["Digital health records","Medicine reminders","Appointment booking","Mental wellness tools"]},
              {title:"Chemists",sub:"Dispensary management",color:"#1e3a5f",accent:C.sky500,to:"/chemist-dashboard",desc:"Manage medicine inventory, dispense to patients, scan QR codes, and track dispensing history.",features:["Patient search by SHA","Medicine inventory","QR code scanning","Dispense tracking"]},
              {title:"CHVs",sub:"Community health volunteers",color:"#3b1f5e",accent:C.pur400,to:"/chv-dashboard",desc:"Track assigned patients, submit household reports, send reminders, and coordinate care.",features:["Assigned patient list","Home visit reports","SMS reminders","Community tracking"]},
            ].map(({title,sub,color,accent,to,desc,features},i)=>(
              <Reveal key={title} delay={i*.1}>
                <Link to={to} className="role-card" style={{background:`linear-gradient(155deg,${color},${color}cc)`,border:`1px solid ${accent}20`}}>
                  <div style={{fontSize:".7rem",fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>{sub}</div>
                  <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1.5rem",fontWeight:400,color:"#fff",marginBottom:12}}>{title}</div>
                  <p style={{fontSize:".855rem",color:"rgba(255,255,255,.62)",lineHeight:1.72,marginBottom:20}}>{desc}</p>
                  <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
                    {features.map(f=>(
                      <li key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:".8rem",color:"rgba(255,255,255,.72)"}}>
                        <span style={{width:4,height:4,borderRadius:"50%",background:accent,flexShrink:0,display:"inline-block"}}/>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{marginTop:22,display:"inline-flex",alignItems:"center",gap:6,color:accent,fontSize:".8rem",fontWeight:500}}>
                    Open Portal <Ic d="M5 12h14 M12 5l7 7-7 7" size={13} stroke={accent}/>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WELLNESS ── */}
      <section id="wellness" style={{padding:"clamp(64px,8vw,100px) 0",background:C.bg}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <Reveal>
            <div style={{background:"linear-gradient(135deg,#3b1f5e,#4c1d95)",borderRadius:24,padding:"clamp(32px,5vw,60px)",display:"flex",alignItems:"center",flexWrap:"wrap",gap:40}}>
              <div style={{flex:"1 1 280px"}}>
                <div style={{fontSize:".7rem",fontWeight:700,color:"#c4b5fd",textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Mind and Mood</div>
                <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.4rem,3vw,2.1rem)",fontWeight:300,color:"#fff",marginBottom:14,lineHeight:1.2}}>
                  Mental wellness support <em style={{fontStyle:"italic",color:"#a78bfa"}}>for all</em>
                </h2>
                <p style={{color:"rgba(255,255,255,.62)",lineHeight:1.8,marginBottom:26,fontSize:".875rem"}}>
                  From AI-powered wellness chats to daily mood journalling, AfyaDiary includes comprehensive mental health tools that every Kenyan can access at no cost.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                  {[["Chat with AI","/ai-chat"],["Wellness Tips","/mental-health/tips"],["Mood Tracker","/mood-tracker"]].map(([l,to])=>(
                    <Link key={l} to={to} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",padding:"8px 15px",borderRadius:8,fontSize:".8rem",fontWeight:500,textDecoration:"none",transition:"all .15s"}}
                      onMouseOver={e=>{e.currentTarget.style.background="rgba(255,255,255,.18)"}}
                      onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)"}}>{l}</Link>
                  ))}
                </div>
              </div>
              <div style={{flex:"0 1 260px",background:"rgba(255,255,255,.07)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,.1)"}}>
                {[
                  {icon:"M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-5 0v-15A2.5 2.5 0 019.5 2z",t:"AI Wellness Chat",d:"Talk to Afya AI about stress, anxiety, or daily health."},
                  {icon:"M12 2a10 10 0 100 20A10 10 0 0012 2z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",t:"Mood Journalling",d:"Track your emotional health with daily check-ins."},
                  {icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",t:"Health Tips",d:"Daily tips curated for the Kenyan context."},
                ].map(({icon,t,d},i)=>(
                  <div key={t} style={{display:"flex",gap:12,paddingBottom:i<2?16:0,marginBottom:i<2?16:0,borderBottom:i<2?"1px solid rgba(255,255,255,.07)":"none"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Ic d={icon} size={17} stroke="#a78bfa"/>
                    </div>
                    <div>
                      <div style={{fontSize:".855rem",fontWeight:500,color:"#fff",marginBottom:3}}>{t}</div>
                      <div style={{fontSize:".76rem",color:"rgba(255,255,255,.5)",lineHeight:1.6}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{padding:"clamp(64px,8vw,100px) 0",background:C.white}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:44}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:C.em600,textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Testimonials</div>
              <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:400,color:C.sl900}}>What healthcare workers say</h2>
            </div>
          </Reveal>
          <div className="quote-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {[
              {name:"Nurse Wanjiku N.",role:"CHV, Kiambu County",bg:C.em600,quote:"AfyaDiary has transformed how I track my 80 assigned patients. The SMS reminders alone have improved medication adherence by 40% in my area."},
              {name:"Pharmacist Ahmed O.",role:"Chemist, Mombasa",bg:C.sky600,quote:"Searching patients by SHA number and dispensing medicines is now seamless. The inventory management saves me hours every week."},
              {name:"Mary K.",role:"Patient, Nairobi",bg:C.pur600,quote:"I can now access all my health records on my phone. The mental wellness chat helped me through a very difficult period last year."},
            ].map(({name,role,bg,quote},i)=>(
              <Reveal key={name} delay={i*.1}>
                <div className="quote-card">
                  <div style={{fontSize:"2.2rem",color:C.sl200,fontFamily:"Georgia",marginBottom:10,lineHeight:1}}>"</div>
                  <p style={{fontSize:".875rem",color:C.sl500,lineHeight:1.78,marginBottom:18}}>{quote}</p>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:".75rem",flexShrink:0}}>
                      {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{fontSize:".855rem",fontWeight:600,color:C.sl900}}>{name}</div>
                      <div style={{fontSize:".72rem",color:C.sl400}}>{role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:"clamp(64px,8vw,100px) 0",background:`linear-gradient(135deg,${C.em950},${C.em900},${C.em800})`}}>
        <div style={{maxWidth:660,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
          <Reveal>
            <div style={{fontSize:".7rem",fontWeight:700,color:C.em400,textTransform:"uppercase",letterSpacing:".12em",marginBottom:14}}>Get Started Today</div>
            <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:300,color:"#fff",marginBottom:16,lineHeight:1.18}}>
              Ready to Take Charge<br/>of Your Health?
            </h2>
            <p style={{color:"rgba(255,255,255,.58)",fontSize:".925rem",marginBottom:32,lineHeight:1.8}}>
              Join thousands of Kenyans using AfyaDiary Kenya to manage health records, appointments, and wellness all in one place.
            </p>
            <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:12}}>
              <Link to="/register" style={{background:C.em500,color:"#fff",padding:"13px 30px",borderRadius:10,fontWeight:600,fontSize:".95rem",textDecoration:"none",boxShadow:`0 4px 20px ${C.em500}45`,transition:"all .2s"}}
                onMouseOver={e=>{e.currentTarget.style.background=C.em600;e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseOut={e=>{e.currentTarget.style.background=C.em500;e.currentTarget.style.transform="none"}}>
                Create Free Account
              </Link>
              <Link to="/features" style={{border:"1.5px solid rgba(255,255,255,.25)",color:"rgba(255,255,255,.85)",padding:"13px 30px",borderRadius:10,fontSize:".95rem",textDecoration:"none",transition:"all .2s"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.5)";e.currentTarget.style.color="#fff"}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.25)";e.currentTarget.style.color="rgba(255,255,255,.85)"}}>
                Learn More
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:C.em950,color:"rgba(255,255,255,.58)",padding:"56px 0 26px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(16px,4vw,52px)"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:14,justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.08)",paddingBottom:20,marginBottom:36,fontSize:".76rem"}}>
            <div>Country: <strong style={{color:"#fff"}}>Kenya</strong></div>
            <div>Language: <strong style={{color:"#fff"}}>English</strong></div>
            <div>Contact: <span style={{color:"#fff"}}>+254 712 345 678</span> &nbsp;|&nbsp; <span style={{color:"#fff"}}>support@afyadiary.co.ke</span></div>
          </div>

          <div style={{display:"flex",gap:48,flexWrap:"wrap",marginBottom:36}}>
            <div style={{maxWidth:250,flexShrink:0}}>
              <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1.05rem",fontWeight:600,color:"#fff",marginBottom:10}}>AfyaDiary Kenya</div>
              <p style={{fontSize:".82rem",lineHeight:1.78,marginBottom:12}}>
                A digital healthcare management platform improving patient record accessibility, appointment management, and secure data handling across Kenya.
              </p>
              <div style={{fontSize:".74rem",color:C.em400}}>Made in Kenya with care</div>
            </div>
            <div className="foot-grid" style={{flex:1,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"12px 20px"}}>
              {[
                {title:"Platform",   links:[["Features","/features"],["Mobile App","/mobile-app"],["Security","/security"],["Integrations","/features"]]},
                {title:"Healthcare", links:[["Patient Records","#"],["Appointments","/appointments"],["Analytics","#"],["Dashboards","#"]]},
                {title:"Docs",       links:[["User Guides","/guides"],["API Docs","/api"],["Help Center","/faq"],["Support","/contact"]]},
                {title:"Learn",      links:[["Health Guides","#"],["Resources","#"],["Privacy Tips","/privacy"],["Training","#"]]},
                {title:"Company",    links:[["About Us","/about"],["Careers","/careers"],["Contact","/contact"],["Leadership","/about"]]},
                {title:"Policies",   links:[["Privacy","/privacy"],["Terms","/terms"],["Data Protection","/security"],["Complaints","#"]]},
              ].map(({title,links})=><FooterCol key={title} title={title} links={links}/>)}
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:10,margin:"24px 0"}}>
            {[FaFacebookF,FaTwitter,FaLinkedinIn,FaInstagram].map((Icon,i)=>(
              <button key={i} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",cursor:"pointer",color:"rgba(255,255,255,.58)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",fontSize:".855rem"}}
                onMouseOver={e=>{e.currentTarget.style.background="rgba(255,255,255,.16)";e.currentTarget.style.color="#fff"}}
                onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,.07)";e.currentTarget.style.color="rgba(255,255,255,.58)"}}>
                <Icon/>
              </button>
            ))}
          </div>

          <div style={{fontSize:".74rem",lineHeight:1.75,marginBottom:16,borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:20}}>
            <p>AfyaDiary Kenya is a digital healthcare management platform aimed at improving patient record accessibility, appointment management, and secure data handling. Please use the system responsibly and comply with local healthcare regulations and data privacy laws.</p>
            <p style={{marginTop:7}}>AfyaDiary Kenya Ltd is registered in Kenya. For regulatory or compliance inquiries, please contact our support team.</p>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,fontSize:".74rem"}}>
            <span>2025 AfyaDiary Kenya Ltd. All rights reserved.</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
              {[["Sitemap","#"],["Cookie Settings","#"],["Terms","/terms"],["Complaints","#"]].map(([l,to])=>(
                <Link key={l} to={to} style={{color:"rgba(255,255,255,.38)",textDecoration:"none",transition:"color .15s"}}
                  onMouseOver={e=>{e.currentTarget.style.color="#fff"}}
                  onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.38)"}}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}