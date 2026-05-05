import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = {
  em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sky600:"#0284c7",sky50:"#f0f9ff",
  pur600:"#7c3aed",pur50:"#f5f3ff",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",
  red600:"#dc2626",bg:"#f6f8f7",white:"#ffffff",
};

const ROLES = [
  { value:"patient", label:"Patient",  color:C.em600,  bg:C.em50,  desc:"Access your health records, appointments, and wellness support." },
  { value:"chv",     label:"CHV",      color:C.pur600, bg:C.pur50, desc:"Manage your assigned patients, submit reports, and send reminders." },
  { value:"chemist", label:"Chemist",  color:C.sky600, bg:C.sky50, desc:"Manage your pharmacy inventory and dispense medicines." },
];

export default function Register() {
  const navigate = useNavigate();
  const [role,    setRole]    = useState("patient");
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name:"",phone:"",email:"",password:"",age:"",gender:"",shaNumber:"",licenseNumber:"",pharmacyName:"" });

  const set = e => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = { name:f.name, phone:f.phone, role };
    if (role==="patient") { data.age=f.age; data.gender=f.gender; data.shaNumber=f.shaNumber; }
    if (role==="chv")     { data.email=f.email; data.password=f.password; data.shaNumber=f.shaNumber; }
    if (role==="chemist") { data.email=f.email; data.password=f.password; data.licenseNumber=f.licenseNumber; data.pharmacyName=f.pharmacyName; }
    try {
      await api.post("/auth/request-otp", data);
      toast.success("OTP sent to your phone");
      navigate("/verify", { state: { phone:f.phone, role, name:f.name, shaNumber:f.shaNumber, email:f.email, password:f.password, gender:f.gender, licenseNumber:f.licenseNumber, pharmacyName:f.pharmacyName } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
        .inp-field{width:100%;padding:10px 13px;border-radius:8px;border:1.5px solid ${C.sl200};font-family:'DM Sans',system-ui,sans-serif;font-size:.875rem;color:${C.sl900};outline:none;transition:all .15s;background:${C.white}}
        .inp-field:focus{border-color:${C.em500};box-shadow:0 0 0 3px rgba(16,185,129,.1)}
        .role-btn{padding:12px 8px;border-radius:9px;border:1.5px solid ${C.sl200};background:${C.white};cursor:pointer;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:'DM Sans',system-ui,sans-serif}
        .lbl{font-size:.74rem;font-weight:600;color:${C.sl700};display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}
      `}</style>

      <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"clamp(24px,5vw,48px) 16px",background:C.bg}}>
        <div className="fade-up" style={{width:"100%",maxWidth:480}}>
          {/* Brand */}
          <div style={{textAlign:"center",marginBottom:28}}>
            <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:10,textDecoration:"none",marginBottom:20}}>
              <div style={{width:34,height:34,borderRadius:8,background:`linear-gradient(135deg,${C.em500},${C.em700})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"1rem",fontWeight:600,color:C.sl900,lineHeight:1.1}}>AfyaDiary Kenya</div>
                <div style={{fontSize:".56rem",color:C.em600,letterSpacing:".1em",textTransform:"uppercase"}}>Digital Health Platform</div>
              </div>
            </Link>
            <h1 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(1.4rem,3vw,1.8rem)",fontWeight:400,color:C.sl900,marginBottom:6}}>Create your account</h1>
            <p style={{color:C.sl500,fontSize:".855rem"}}>
              Already registered?{" "}
              <button onClick={()=>navigate("/login")} style={{background:"none",border:"none",color:C.em600,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:".855rem"}}>Sign in</button>
            </p>
          </div>

          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.sl200}`,padding:"clamp(22px,5vw,34px)",boxShadow:"0 4px 24px rgba(0,0,0,.07)"}}>
            {/* Role */}
            <div style={{marginBottom:20}}>
              <label className="lbl">Registering as</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
                {ROLES.map(({value,label,color,bg})=>(
                  <button key={value} type="button" onClick={()=>setRole(value)} className="role-btn"
                    style={{borderColor:role===value?color:C.sl200,background:role===value?bg:C.white}}>
                    <span style={{fontSize:".8rem",fontWeight:role===value?600:400,color:role===value?color:C.sl500}}>{label}</span>
                  </button>
                ))}
              </div>
              <div style={{fontSize:".76rem",color:C.sl500,lineHeight:1.55}}>{ROLES.find(r=>r.value===role)?.desc}</div>
            </div>

            <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:13}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label className="lbl">Full Name</label><input name="name" value={f.name} onChange={set} required placeholder="Your full name" className="inp-field"/></div>
                <div><label className="lbl">Phone Number</label><input name="phone" type="tel" value={f.phone} onChange={set} required placeholder="+2547XXXXXXXX" className="inp-field"/></div>
              </div>

              {role==="patient" && (
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><label className="lbl">Age</label><input name="age" type="number" value={f.age} onChange={set} required placeholder="Age" className="inp-field"/></div>
                    <div>
                      <label className="lbl">Gender</label>
                      <select name="gender" value={f.gender} onChange={set} required className="inp-field" style={{appearance:"none",cursor:"pointer"}}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="lbl">SHA Number</label><input name="shaNumber" value={f.shaNumber} onChange={set} required placeholder="Social Health Authority Number" className="inp-field"/></div>
                </>
              )}

              {role==="chv" && (
                <>
                  <div><label className="lbl">Email Address</label><input name="email" type="email" value={f.email} onChange={set} required placeholder="your@email.com" className="inp-field"/></div>
                  <div><label className="lbl">Password</label><input name="password" type="password" value={f.password} onChange={set} required placeholder="Create a secure password" className="inp-field"/></div>
                  <div><label className="lbl">SHA Number</label><input name="shaNumber" value={f.shaNumber} onChange={set} required placeholder="Social Health Authority Number" className="inp-field"/></div>
                </>
              )}

              {role==="chemist" && (
                <>
                  <div><label className="lbl">Email Address</label><input name="email" type="email" value={f.email} onChange={set} required placeholder="your@email.com" className="inp-field"/></div>
                  <div><label className="lbl">Password</label><input name="password" type="password" value={f.password} onChange={set} required placeholder="Create a secure password" className="inp-field"/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><label className="lbl">License Number</label><input name="licenseNumber" value={f.licenseNumber} onChange={set} placeholder="PPB/XXXX" className="inp-field"/></div>
                    <div><label className="lbl">Pharmacy Name</label><input name="pharmacyName" value={f.pharmacyName} onChange={set} placeholder="Pharmacy name" className="inp-field"/></div>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} style={{
                background:loading?C.sl200:C.em600,color:loading?C.sl500:"#fff",
                padding:"12px",borderRadius:9,border:"none",
                cursor:loading?"not-allowed":"pointer",fontWeight:600,fontSize:".9rem",
                fontFamily:"'DM Sans',system-ui,sans-serif",transition:"all .2s",marginTop:4,
                boxShadow:loading?"none":`0 4px 14px rgba(5,150,105,.3)`,
              }}>
                {loading?"Sending OTP...":"Register and Get OTP"}
              </button>
            </form>

            <p style={{textAlign:"center",marginTop:16,fontSize:".74rem",color:C.sl400}}>
              By registering you agree to our{" "}
              <Link to="/terms" style={{color:C.em600}}>Terms</Link> and{" "}
              <Link to="/privacy" style={{color:C.em600}}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}