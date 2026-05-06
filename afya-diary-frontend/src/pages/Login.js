import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = {
  em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sky600:"#0284c7",sky50:"#f0f9ff",
  pur600:"#7c3aed",pur50:"#f5f3ff",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl300:"#cbd5e1",sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",
  red600:"#dc2626",bg:"#f6f8f7",white:"#ffffff",
};

const ROLES = [
  { value:"patient", label:"Patient",  color:C.em600,  bg:C.em50  },
  { value:"chv",     label:"CHV",      color:C.pur600, bg:C.pur50 },
  { value:"chemist", label:"Chemist",  color:C.sky600, bg:C.sky50 },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone,   setPhone]   = useState("");
  const [role,    setRole]    = useState(location.state?.role || "patient");
  const [loading, setLoading] = useState(false);

  const sendOtp = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/request-otp", { phone, role });
      toast.success("OTP sent to your phone");
      navigate("/verify", { state: { phone, role } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };


  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:${C.bg};color:${C.sl900}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease both}
        .inp-field{width:100%;padding:11px 14px;border-radius:9px;border:1.5px solid ${C.sl200};font-family:'DM Sans',system-ui,sans-serif;font-size:.875rem;color:${C.sl900};outline:none;transition:all .15s;background:${C.white}}
        .inp-field:focus{border-color:${C.em500};box-shadow:0 0 0 3px rgba(16,185,129,.1)}
        .role-btn{padding:11px 8px;border-radius:9px;border:1.5px solid ${C.sl200};background:${C.white};cursor:pointer;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:'DM Sans',system-ui,sans-serif}
      `}</style>

      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"clamp(24px,5vw,48px) 16px",background:C.bg}}>
        <div className="fade-up" style={{width:"100%",maxWidth:420}}>
          {/* Brand */}
          <div style={{textAlign:"center",marginBottom:32}}>
            <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:10,textDecoration:"none",marginBottom:24}}>
              <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${C.em500},${C.em700})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1.05rem",fontWeight:600,color:C.sl900,lineHeight:1.1}}>AfyaDiary Kenya</div>
                <div style={{fontSize:".58rem",color:C.em600,letterSpacing:".1em",textTransform:"uppercase"}}>Digital Health Platform</div>
              </div>
            </Link>
            <h1 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.5rem,3vw,1.9rem)",fontWeight:400,color:C.sl900,marginBottom:6}}>Welcome back</h1>
            <p style={{color:C.sl500,fontSize:".875rem",lineHeight:1.6}}>Enter your phone number to receive a login code.</p>
          </div>

          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.sl200}`,padding:"clamp(24px,5vw,36px)",boxShadow:"0 4px 24px rgba(0,0,0,.07)"}}>
            {/* Role selector */}
            <div style={{marginBottom:22}}>
              <label style={{fontSize:".76rem",fontWeight:600,color:C.sl700,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Signing in as</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {ROLES.map(({value,label,color,bg})=>(
                  <button key={value} type="button" onClick={()=>setRole(value)}
                    className="role-btn"
                    style={{borderColor:role===value?color:C.sl200,background:role===value?bg:C.white}}>
                    <span style={{fontSize:".8rem",fontWeight:role===value?600:400,color:role===value?color:C.sl500}}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={sendOtp} style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontSize:".76rem",fontWeight:600,color:C.sl700,textTransform:"uppercase",letterSpacing:".06em"}}>Phone Number</label>
                <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required
                  placeholder="+2547XXXXXXXX" className="inp-field"/>
              </div>

              <button type="submit" disabled={loading} style={{
                background:loading?C.sl300:C.em600,color:"#fff",padding:"12px",borderRadius:9,border:"none",
                cursor:loading?"not-allowed":"pointer",fontWeight:600,fontSize:".9rem",
                fontFamily:"'DM Sans',system-ui,sans-serif",transition:"all .2s",
                boxShadow:loading?"none":`0 4px 14px rgba(5,150,105,.3)`,
              }}>
                {loading?"Sending OTP...":"Send OTP"}
              </button>
            </form>

            <div style={{height:1,background:C.sl100,margin:"20px 0"}}/>

            <p style={{textAlign:"center",fontSize:".84rem",color:C.sl500}}>
              No account yet?{" "}
              <button onClick={()=>navigate("/register",{state:{role}})}
                style={{background:"none",border:"none",color:C.em600,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:".84rem"}}>
                Register here
              </button>
            </p>
            <p style={{textAlign:"center",marginTop:10,fontSize:".74rem",color:C.sl400}}>
              By signing in you agree to our{" "}
              <Link to="/terms" style={{color:C.em600}}>Terms</Link> and{" "}
              <Link to="/privacy" style={{color:C.em600}}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}