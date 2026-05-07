import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, Btn, Inp, Badge, EmptyState, Table, TR, TD, Modal, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = { em600:"#059669",em50:"#ecfdf5",sl900:"#0f172a",sl500:"#64748b",sl200:"#e2e8f0",white:"#ffffff" };

const TYPE_COLOR = {
  diagnosis:  "blue",
  medication: "green",
  vaccine:    "purple",
  allergy:    "red",
  other:      "gray",
};

const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const EMPTY = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ type:"diagnosis", title:"", description:"" });
  const [filter,  setFilter]  = useState("all");

  const load = async () => {
    try {
      const { data } = await api.get("/records/mine");
      setRecords(data || []);
    } catch { toast.error("Failed to load records"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ type:"diagnosis", title:"", description:"" }); setOpen(true); };
  const openEdit = r => { setEditing(r); setForm({ type:r.type, title:r.title, description:r.description }); setOpen(true); };

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/records/${editing._id}`, form);
        toast.success("Record updated");
      } else {
        await api.post("/records", form);
        toast.success("Record saved");
      }
      setOpen(false);
      load();
    } catch { toast.error("Could not save record"); }
    finally { setSaving(false); }
  };

  const filtered = filter === "all" ? records : records.filter(r => r.type === filter);
  const types = ["all","diagnosis","medication","vaccine","allergy","other"];

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Patient Records"
        title="My Health Records"
        subtitle="View and manage your complete medical history."
        action={<Btn onClick={openAdd}><Ic d="M12 5v14 M5 12h14" size={15} />Add Record</Btn>}
      />

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{
              padding:"6px 14px", borderRadius:999, border:"1.5px solid",
              borderColor: filter===t ? C.em600 : C.sl200,
              background: filter===t ? C.em50 : C.white,
              color: filter===t ? C.em600 : C.sl500,
              fontSize:".78rem", fontWeight: filter===t ? 600 : 400,
              cursor:"pointer", textTransform:"capitalize",
              fontFamily:"'DM Sans',system-ui,sans-serif", transition:"all .15s",
            }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Card><div style={{ padding:"40px", textAlign:"center", color:C.sl500, fontSize:".875rem" }}>Loading records...</div></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={EMPTY} title="No records found" desc="Add your first health record to start tracking your medical history." /></Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map((r, i) => (
            <div key={r._id} className={`fade d${Math.min(i+1,4)}`}
              style={{ background:C.white, borderRadius:14, border:`1px solid ${C.sl200}`, padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)", borderLeft:`3px solid ${C.em600}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <h3 style={{ fontSize:"1rem", fontWeight:600, color:C.sl900 }}>{r.title}</h3>
                    <Badge color={TYPE_COLOR[r.type] || "gray"}>{r.type}</Badge>
                  </div>
                  {r.description && (
                    <p style={{ fontSize:".855rem", color:C.sl500, lineHeight:1.7, marginBottom:8 }}>{r.description}</p>
                  )}
                  <div style={{ fontSize:".72rem", color:"#94a3b8" }}>
                    Added {new Date(r.createdAt).toLocaleDateString("en-KE", { day:"numeric", month:"long", year:"numeric" })}
                  </div>
                </div>
                <Btn variant="outline" size="sm" onClick={() => openEdit(r)}>Edit</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Record" : "Add Health Record"}>
        <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <label style={{ fontSize:".74rem", fontWeight:600, color:"#334155", textTransform:"uppercase", letterSpacing:".06em" }}>Type *</label>
            <select value={form.type} onChange={e => setForm({ ...form, type:e.target.value })}
              style={{ padding:"10px 13px", borderRadius:8, border:"1.5px solid #e2e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a", outline:"none", background:"#fff", appearance:"none", cursor:"pointer" }}>
              {["diagnosis","medication","vaccine","allergy","other"].map(t => (
                <option key={t} value={t} style={{ textTransform:"capitalize" }}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
              ))}
            </select>
          </div>
          <Inp label="Title" value={form.title} onChange={e => setForm({ ...form, title:e.target.value })} required placeholder="e.g. Type 2 Diabetes, Metformin 500mg" />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <label style={{ fontSize:".74rem", fontWeight:600, color:"#334155", textTransform:"uppercase", letterSpacing:".06em" }}>Details</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description:e.target.value })}
              placeholder="Additional notes or details..." rows={4}
              style={{ padding:"10px 13px", borderRadius:8, border:"1.5px solid #e2e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a", outline:"none", resize:"vertical", lineHeight:1.6 }}
              onFocus={e => { e.target.style.borderColor="#10b981"; e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,.1)"; }}
              onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn variant="outline" full onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" full disabled={saving}>{saving?"Saving...":editing?"Update Record":"Save Record"}</Btn>
          </div>
        </form>
      </Modal>
    </PatientLayout>
  );
}