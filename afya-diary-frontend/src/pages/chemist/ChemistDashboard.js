import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const C = {
  em900:"#064e3b",em700:"#047857",em600:"#059669",em500:"#10b981",em400:"#34d399",
  em100:"#d1fae5",em50:"#ecfdf5",
  sky600:"#0284c7",sky100:"#e0f2fe",
  amber500:"#f59e0b",amber100:"#fef3c7",amber600:"#d97706",
  pur600:"#7c3aed",pur100:"#ede9fe",
  sl900:"#0f172a",sl700:"#334155",sl600:"#475569",sl500:"#64748b",
  sl400:"#94a3b8",sl200:"#e2e8f0",sl100:"#f1f5f9",sl50:"#f8fafc",
  red600:"#dc2626",red100:"#fee2e2",
  white:"#ffffff",bg:"#f6f8f7",
};

export default function ChemistDashboard() {
  const navigate = useNavigate();
  const [shaNumber, setShaNumber]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [dispenses, setDispenses]   = useState([]);
  const [medicines, setMedicines]   = useState([]);
  const [addMedOpen, setAddMedOpen] = useState(false);
  const [medForm, setMedForm]       = useState({ name: "", stock: "", price: "" });
  const [savingMed, setSavingMed]   = useState(false);

  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

  useEffect(() => {
    api.get("/chemist/dispenses").then(({ data }) => setDispenses(data)).catch(() => {});
    api.get("/chemist/medicines").then(({ data }) => setMedicines(data)).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!shaNumber.trim()) { toast.error("Enter a SHA number"); return; }
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/search/${shaNumber}`, { headers: { "Cache-Control": "no-cache" } });
      if (data?.shaNumber) {
        toast.success("Patient found");
        navigate(`/chemist/patient/${data.shaNumber}`, { state: { patient: data } });
      } else {
        toast.error("Patient not found");
      }
    } catch {
      toast.error("Patient not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMed = async e => {
    e.preventDefault();
    if (!medForm.name || !medForm.stock) { toast.error("Name and stock required"); return; }
    setSavingMed(true);
    try {
      await api.post("/chemist/add-medicine", medForm);
      toast.success("Medicine added");
      setAddMedOpen(false);
      setMedForm({ name: "", stock: "", price: "" });
      const { data } = await api.get("/chemist/medicines");
      setMedicines(data);
    } catch { toast.error("Failed to add medicine"); }
    finally { setSavingMed(false); }
  };

  const lowStock = medicines.filter(m => m.stock <= 10);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <ChemistLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp .4s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
        .inp{width:100%;padding:10px 13px;border-radius:8px;border:1.5px solid ${C.sl200};font-family:'DM Sans',system-ui,sans-serif;font-size:.875rem;color:${C.sl900};outline:none;transition:all .15s;background:${C.white}}
        .inp:focus{border-color:${C.em500};box-shadow:0 0 0 3px rgba(16,185,129,.1)}
        .btn-em{background:${C.em600};color:#fff;padding:10px 18px;border-radius:8px;border:none;cursor:pointer;font-weight:600;font-size:.855rem;font-family:'DM Sans',system-ui,sans-serif;transition:all .2s;box-shadow:0 2px 8px rgba(5,150,105,.25)}
        .btn-em:hover{background:${C.em700};transform:translateY(-1px)}
        .btn-out{background:none;color:${C.sl600};padding:10px 18px;border-radius:8px;border:1.5px solid ${C.sl200};cursor:pointer;font-size:.855rem;font-family:'DM Sans',system-ui,sans-serif;transition:all .15s}
        .btn-out:hover{border-color:${C.sl400};color:${C.sl900}}
        @media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}.dash-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Header */}
      <div className="fade" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: ".72rem", fontWeight: 600, color: C.em600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Chemist Dashboard</div>
        <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: C.sl900 }}>
          {greeting}, {user.name?.split(" ")[0] || "Chemist"} 👋
        </h1>
        <p style={{ color: C.sl500, fontSize: ".855rem", marginTop: 4 }}>
          {user.pharmacyName || "Your Pharmacy"} &nbsp;|&nbsp; {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="fade d1 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "💊", label: "Medicines",       value: medicines.length,                 bg: C.em50,     color: C.em600 },
          { icon: "📦", label: "Low Stock Items",  value: lowStock.length,                  bg: C.amber100, color: C.amber600, warn: lowStock.length > 0 },
          { icon: "🧾", label: "Total Dispenses",  value: dispenses.length,                 bg: C.sky100,   color: C.sky600 },
          { icon: "👥", label: "Patients Today",   value: new Set(dispenses.filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).map(d => d.patientId?._id)).size, bg: C.pur100, color: C.pur600 },
        ].map(({ icon, label, value, bg, color, warn }) => (
          <div key={label} style={{ background: C.white, borderRadius: 14, border: `1.5px solid ${warn ? C.amber500 + "40" : C.sl200}`, padding: "18px", boxShadow: warn ? `0 2px 12px ${C.amber500}18` : "0 1px 4px rgba(0,0,0,.04)", transition: "all .2s" }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.08)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = warn ? `0 2px 12px ${C.amber500}18` : "0 1px 4px rgba(0,0,0,.04)"; }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: 12 }}>{icon}</div>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.7rem", fontWeight: 400, color: C.sl900, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: ".72rem", color: C.sl500, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Actions */}
      <div className="fade d2" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, padding: "20px 22px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize: ".78rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Patient Lookup</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, background: C.sl50, border: `1.5px solid ${C.sl200}`, borderRadius: 9, padding: "0 14px", transition: "all .15s" }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = C.em500; e.currentTarget.style.background = C.white; }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = C.sl200; e.currentTarget.style.background = C.sl50; }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.sl400} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" /></svg>
            <input
              value={shaNumber} onChange={e => setShaNumber(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Enter SHA number to find patient..."
              style={{ border: "none", background: "none", outline: "none", flex: 1, fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem", color: C.sl900, padding: "11px 0" }}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-em" style={{ flexShrink: 0 }}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button onClick={() => navigate("/chemist/add-patient")} className="btn-out">
            + Add Patient
          </button>
          <button onClick={() => setAddMedOpen(true)} className="btn-out">
            + Add Medicine
          </button>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ background: C.amber100, border: `1px solid ${C.amber500}40`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: "1.2rem" }}>⚠️</div>
          <div>
            <span style={{ fontSize: ".855rem", fontWeight: 600, color: "#78350f" }}>Low stock alert: </span>
            <span style={{ fontSize: ".84rem", color: "#92400e" }}>
              {lowStock.map(m => m.name).join(", ")} {lowStock.length === 1 ? "has" : "have"} 10 or fewer units remaining.
            </span>
          </div>
        </div>
      )}

      <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Medicine Inventory */}
        <div className="fade d2" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.sl100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em" }}>Medicine Stock</div>
            <span style={{ fontSize: ".72rem", color: C.sl400 }}>{medicines.length} items</span>
          </div>
          {medicines.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: C.sl400, fontSize: ".875rem" }}>No medicines added yet</div>
          ) : (
            <div style={{ overflow: "auto", maxHeight: 320 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.sl50 }}>
                    {["Medicine","Stock","Price"].map(h => (
                      <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: ".72rem", fontWeight: 600, color: C.sl500, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid ${C.sl200}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(m => (
                    <tr key={m._id} style={{ borderBottom: `1px solid ${C.sl100}`, transition: "background .1s" }}
                      onMouseOver={e => { e.currentTarget.style.background = C.sl50; }}
                      onMouseOut={e => { e.currentTarget.style.background = "none"; }}>
                      <td style={{ padding: "11px 16px", fontSize: ".855rem", color: C.sl900, fontWeight: 500 }}>{m.name}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ fontSize: ".8rem", fontWeight: 600, color: m.stock <= 5 ? C.red600 : m.stock <= 10 ? C.amber600 : C.em600, background: m.stock <= 5 ? C.red100 : m.stock <= 10 ? C.amber100 : C.em50, padding: "2px 10px", borderRadius: 999 }}>
                          {m.stock}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: ".82rem", color: C.sl600 }}>
                        {m.price ? `KSh ${m.price}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Dispenses */}
        <div className="fade d3" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sl200}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.sl100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.sl700, textTransform: "uppercase", letterSpacing: ".08em" }}>Recent Dispenses</div>
            <span style={{ fontSize: ".72rem", color: C.sl400 }}>{dispenses.length} total</span>
          </div>
          {dispenses.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: C.sl400, fontSize: ".875rem" }}>No dispenses recorded yet</div>
          ) : (
            <div style={{ overflow: "auto", maxHeight: 320 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.sl50 }}>
                    {["Patient","Medicine","Qty","Date"].map(h => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: ".72rem", fontWeight: 600, color: C.sl500, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid ${C.sl200}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dispenses.slice(0, 10).map(d => (
                    <tr key={d._id} style={{ borderBottom: `1px solid ${C.sl100}`, transition: "background .1s" }}
                      onMouseOver={e => { e.currentTarget.style.background = C.sl50; }}
                      onMouseOut={e => { e.currentTarget.style.background = "none"; }}>
                      <td style={{ padding: "10px 14px", fontSize: ".82rem", color: C.sl900, fontWeight: 500 }}>{d.patient?.name || d.patientId?.name || "N/A"}</td>
                      <td style={{ padding: "10px 14px", fontSize: ".82rem", color: C.sl600 }}>{d.medicine || d.medicineId?.name || "N/A"}</td>
                      <td style={{ padding: "10px 14px", fontSize: ".82rem", color: C.sl600, textAlign: "center" }}>{d.quantity}</td>
                      <td style={{ padding: "10px 14px", fontSize: ".76rem", color: C.sl400 }}>{new Date(d.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {addMedOpen && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setAddMedOpen(false); }}>
          <div style={{ background: C.white, borderRadius: 18, padding: "32px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.25rem", fontWeight: 400, color: C.sl900, marginBottom: 6 }}>Add New Medicine</h2>
            <p style={{ fontSize: ".82rem", color: C.sl500, marginBottom: 22 }}>Enter the medicine details to add to your inventory.</p>
            <form onSubmit={handleAddMed} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name","Medicine Name","text",true],["stock","Stock Quantity","number",true],["price","Price (KSh)","number",false]].map(([name,ph,type,req]) => (
                <div key={name}>
                  <label style={{ fontSize: ".78rem", fontWeight: 500, color: C.sl700, display: "block", marginBottom: 4 }}>{ph}{req ? " *" : ""}</label>
                  <input className="inp" name={name} type={type} value={medForm[name]} onChange={e => setMedForm({ ...medForm, [e.target.name]: e.target.value })} placeholder={ph} required={req} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" className="btn-out" style={{ flex: 1 }} onClick={() => setAddMedOpen(false)}>Cancel</button>
                <button type="submit" className="btn-em" style={{ flex: 1 }} disabled={savingMed}>{savingMed ? "Saving..." : "Add Medicine"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ChemistLayout>
  );
}