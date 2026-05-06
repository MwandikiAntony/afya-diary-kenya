import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",
  pur600:"#7c3aed",sky600:"#0284c7",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",sl400:"#94a3b8",
  sl300:"#cbd5e1",sl200:"#e2e8f0",sl100:"#f1f5f9",white:"#ffffff",bg:"#f6f8f7",
};

const ROLE_COLOR = { patient: C.em600, chv: C.pur600, chemist: C.sky600 };

export default function Verify() {
  const location = useLocation();
  const navigate  = useNavigate();
  const state     = location.state || {};
  const { phone, role = "patient", password } = state;

  const [digits, setDigits]   = useState(["","","","","",""]);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer]       = useState(60);

  // Create refs array outside render cycle
  const inputRefs = useRef([
    React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(),
  ]);

  const accent = ROLE_COLOR[role] || C.em600;

  useEffect(() => {
    inputRefs.current[0]?.current?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return undefined;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const submitOtp = useCallback(async (code) => {
    setLoading(true);
    try {
      const endpoint = state?.name ? "/verify-registration-otp" : "/verify-login-otp";
      const { data } = await api.post(`/auth${endpoint}`, {
        phone, code, role, password,
        name: state.name,
        shaNumber: state.shaNumber,
        licenseNumber: state.licenseNumber,
        pharmacyName: state.pharmacyName,
        email: state.email,
      });
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Verified successfully");
        if (data.user.role === "patient")  navigate("/dashboard");
        else if (data.user.role === "chv") navigate("/chv-dashboard");
        else if (data.user.role === "chemist") navigate("/chemist-dashboard");
        else navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
      setDigits(["","","","","",""]);
      inputRefs.current[0]?.current?.focus();
    } finally {
      setLoading(false);
    }
  }, [phone, role, password, state, navigate]);

  const handleDigit = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.current?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) {
      submitOtp(next.join(""));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      inputRefs.current[5]?.current?.focus();
      submitOtp(text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { toast.error("Enter all 6 digits"); return; }
    submitOtp(code);
  };

  const resendOtp = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { phone, role });
      toast.success("OTP resent");
      setTimer(60);
      setDigits(["","","","","",""]);
      inputRefs.current[0]?.current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:${C.bg};color:${C.sl900}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .v-fade{animation:fadeUp .5s ease both}
        .digit-box{
          width:46px;height:54px;border-radius:9px;border:1.5px solid ${C.sl200};
          text-align:center;font-size:1.35rem;font-weight:600;color:${C.sl900};
          font-family:'DM Mono',monospace;outline:none;background:${C.white};
          transition:all .15s;-webkit-appearance:none;
        }
        .digit-box:focus{border-color:${accent};box-shadow:0 0 0 3px ${accent}20}
        .digit-box.filled{border-color:${accent};background:${C.em50}}
        .v-btn-back{width:100%;background:none;border:1.5px solid ${C.sl200};color:${C.sl600};padding:11px;border-radius:9px;cursor:pointer;font-family:'DM Sans',system-ui,sans-serif;font-size:.875rem;font-weight:500;transition:all .15s}
        .v-btn-back:hover{border-color:${C.sl400};color:${C.sl900}}
        @media(max-width:420px){.digit-box{width:38px;height:48px;font-size:1.1rem}}
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"clamp(24px,5vw,48px) 16px", background:C.bg }}>
        <div className="v-fade" style={{ width:"100%", maxWidth:420 }}>
          {/* Brand */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <Link to="/" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:24 }}>
              <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${C.em500},${C.em700})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"1rem", fontWeight:600, color:C.sl900, lineHeight:1.1 }}>AfyaDiary Kenya</div>
                <div style={{ fontSize:".56rem", color:C.em600, letterSpacing:".1em", textTransform:"uppercase" }}>Digital Health Platform</div>
              </div>
            </Link>
            <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(1.5rem,3vw,1.9rem)", fontWeight:400, color:C.sl900, marginBottom:8 }}>
              Verify your phone
            </h1>
            {phone ? (
              <p style={{ color:C.sl500, fontSize:".875rem", lineHeight:1.6 }}>
                Enter the 6-digit code sent to{" "}
                <strong style={{ color:C.sl700 }}>{phone}</strong>
              </p>
            ) : (
              <p style={{ color:C.sl500, fontSize:".875rem" }}>
                No phone number found.{" "}
                <Link to="/login" style={{ color:C.em600, fontWeight:500 }}>Go back to login</Link>
              </p>
            )}
          </div>

          <div style={{ background:C.white, borderRadius:18, border:`1px solid ${C.sl200}`, padding:"clamp(24px,5vw,36px)", boxShadow:"0 4px 24px rgba(0,0,0,.07)" }}>
            <form onSubmit={handleSubmit}>
              {/* OTP boxes */}
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:26 }} onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={inputRefs.current[i]}
                    className={`digit-box${d ? " filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={loading}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || digits.join("").length < 6}
                style={{
                  width:"100%", padding:"12px", borderRadius:9, border:"none",
                  background: (loading || digits.join("").length < 6) ? C.sl300 : accent,
                  color: (loading || digits.join("").length < 6) ? C.sl500 : "#fff",
                  cursor: (loading || digits.join("").length < 6) ? "not-allowed" : "pointer",
                  fontWeight:600, fontSize:".9rem", fontFamily:"'DM Sans',system-ui,sans-serif",
                  transition:"all .2s",
                  boxShadow: (!loading && digits.join("").length === 6) ? `0 4px 14px ${accent}40` : "none",
                }}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            {/* Timer and resend */}
            <div style={{ marginTop:20, textAlign:"center" }}>
              {timer > 0 ? (
                <p style={{ fontSize:".84rem", color:C.sl500 }}>
                  Resend code in{" "}
                  <span style={{ fontWeight:600, color:C.sl700, fontFamily:"monospace" }}>
                    {mins}:{secs}
                  </span>
                </p>
              ) : (
                <button onClick={resendOtp} disabled={resending}
                  style={{ background:"none", border:"none", color:accent, fontWeight:500, cursor:resending?"not-allowed":"pointer", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".84rem" }}>
                  {resending ? "Resending..." : "Resend Code"}
                </button>
              )}
            </div>

            <div style={{ height:1, background:C.sl100, margin:"20px 0" }} />

            <button className="v-btn-back" onClick={() => navigate("/login", { state:{ role } })}>
              Back to Sign In
            </button>
          </div>

          {/* Security note */}
          <div style={{ marginTop:16, background:C.em50, border:`1px solid ${C.em400}20`, borderRadius:10, padding:"12px 16px", fontSize:".78rem", color:C.em900, lineHeight:1.65, textAlign:"center" }}>
            AfyaDiary Kenya will never ask you to share your OTP code with anyone.
          </div>
        </div>
      </div>
    </>
  );
}