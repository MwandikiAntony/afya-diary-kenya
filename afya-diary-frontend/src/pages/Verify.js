import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = {
  em900:"#064e3b",em600:"#059669",em500:"#10b981",em400:"#34d399",em50:"#ecfdf5",em100:"#d1fae5",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",sl400:"#94a3b8",
  sl200:"#e2e8f0",sl100:"#f1f5f9",sl300:"#cbd5e1",
  red600:"#dc2626",bg:"#f6f8f7",white:"#ffffff",
};

export default function Verify() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const state     = location.state || {};
  const { phone, role = "patient", password } = state;

  const [digits, setDigits] = useState(["","","","","",""]);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer]       = useState(60);
  const refs = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];

  useEffect(() => {
    refs[0]?.current?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleDigit = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) refs[i + 1]?.current?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) {
      submitOtp(next.join(""));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i - 1]?.current?.focus();
    }
  };

  const handlePaste = e => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      const next = text.split("");
      setDigits(next);
      refs[5]?.current?.focus();
      submitOtp(text);
    }
  };

  const submitOtp = async (code) => {
    setLoading(true);
    try {
      const endpoint = state?.name ? "/verify-registration-otp" : "/verify-login-otp";
      const { data } = await api.post(`/auth${endpoint}`, {
        phone, code, role, password,
        name: state.name, shaNumber: state.shaNumber,
        licenseNumber: state.licenseNumber, pharmacyName: state.pharmacyName,
        email: state.email,
      });
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful");
        if (data.user.role === "patient") navigate("/dashboard");
        else if (data.user.role === "chv")     navigate("/chv-dashboard");
        else if (data.user.role === "chemist")  navigate("/chemist-dashboard");
        else navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      setDigits(["","","","","",""]);
      refs[0]?.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
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
      toast.success("OTP resent successfully");
      setTimer(60);
      setDigits(["","","","","",""]);
      refs[0]?.current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const roleColors = { patient: C.em600, chv: "#7c3aed", chemist: "#0284c7" };
  const roleAccent = roleColors[role] || C.em600;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:${C.bg};color:${C.sl900}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
        .fade-up{animation:fadeUp .5s ease both}
        .digit-inp{
          width:48px;height:56px;border-radius:10px;border:1.5px solid ${C.sl200};
          text-align:center;font-size:1.4rem;font-weight:600;color:${C.sl900};
          font-family:'DM Mono',monospace,'DM Sans',sans-serif;outline:none;
          background:${C.white};transition:all .15s;
        }
        .digit-inp:focus{border-color:${roleAccent};box-shadow:0 0 0 3px ${roleAccent}20}
        .digit-inp.filled{border-color:${roleAccent};background:${C.em50}}
        @media(max-width:420px){.digit-inp{width:40px;height:50px;font-size:1.2rem}}
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: C.bg }}>
        {/* Left decorative panel */}
        <div style={{
          flex: "0 0 44%", background: `linear-gradient(135deg,#022c22,${C.em900})`,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "clamp(32px,5vw,56px)", position: "relative", overflow: "hidden",
        }} className="verify-left">
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,.08),transparent 70%)", pointerEvents: "none" }} />

          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 7, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🏥</div>
            <div>
              <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1rem", fontWeight: 600, color: "#fff" }}>AfyaDiary Kenya</div>
              <div style={{ fontSize: ".58rem", color: C.em400, letterSpacing: ".1em", textTransform: "uppercase" }}>Digital Health Platform</div>
            </div>
          </Link>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: 24 }}>
              📱
            </div>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 300, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
              Check your phone
            </h2>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".9rem", lineHeight: 1.8 }}>
              We sent a 6-digit code to{" "}
              <strong style={{ color: C.em400 }}>{phone || "your phone"}</strong>.
              It expires in 5 minutes.
            </p>

            <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(255,255,255,.06)", borderRadius: 12, border: "1px solid rgba(255,255,255,.1)" }}>
              <div style={{ fontSize: ".78rem", fontWeight: 600, color: C.em400, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Security Tip</div>
              <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>
                AfyaDiary Kenya will never ask you to share your OTP code with anyone. Never share it over phone or SMS.
              </p>
            </div>
          </div>

          <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.3)" }}>2025 AfyaDiary Kenya Ltd.</div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(24px,4vw,48px)" }}>
          <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>
            <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 400, color: C.sl900, marginBottom: 8 }}>
              Enter your code
            </h1>
            <p style={{ color: C.sl500, fontSize: ".875rem", marginBottom: 32, lineHeight: 1.6 }}>
              Enter the 6-digit code sent to{" "}
              <strong style={{ color: C.sl700 }}>{phone || "your phone"}</strong>
            </p>

            {!phone && (
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: ".84rem", color: "#7c2d12" }}>
                No phone number found.{" "}
                <Link to="/login" style={{ color: C.em600, fontWeight: 500 }}>Go back to login</Link>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* OTP digit boxes */}
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i} ref={refs[i]}
                    className={`digit-inp${d ? " filled" : ""}`}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={loading}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || digits.join("").length < 6} style={{
                width: "100%", background: (loading || digits.join("").length < 6) ? C.sl300 : roleAccent,
                color: "#fff", padding: "13px", borderRadius: 10, border: "none",
                cursor: (loading || digits.join("").length < 6) ? "not-allowed" : "pointer",
                fontWeight: 600, fontSize: ".9rem", fontFamily: "'DM Sans',system-ui,sans-serif",
                transition: "all .2s",
                boxShadow: digits.join("").length === 6 && !loading ? `0 4px 14px ${roleAccent}40` : "none",
              }}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Timer and resend */}
            <div style={{ marginTop: 24, textAlign: "center" }}>
              {timer > 0 ? (
                <p style={{ fontSize: ".84rem", color: C.sl500 }}>
                  Resend code in{" "}
                  <span style={{ fontWeight: 600, color: C.sl700, fontVariantNumeric: "tabular-nums" }}>
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button onClick={resendOtp} disabled={resending} style={{
                  background: "none", border: "none", color: roleAccent, fontWeight: 500,
                  cursor: resending ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".84rem",
                }}>
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div style={{ height: 1, background: C.sl200, margin: "24px 0" }} />

            <button onClick={() => navigate("/login", { state: { role } })} style={{
              width: "100%", background: "none", border: `1.5px solid ${C.sl200}`,
              color: C.sl600, padding: "11px", borderRadius: 9, cursor: "pointer",
              fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem", fontWeight: 500,
              transition: "all .15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.sl400; e.currentTarget.style.color = C.sl900; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.color = C.sl600; }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.verify-left{display:none!important}}`}</style>
    </>
  );
}