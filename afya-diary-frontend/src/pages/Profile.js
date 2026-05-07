import React, { useState } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = { em600:"#059669",em50:"#ecfdf5",sl900:"#0f172a",sl700:"#334155",sl500:"#64748b",sl200:"#e2e8f0",sl100:"#f1f5f9",white:"#fff" };

export default function Profile() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

  const [user, setUser]   = useState(stored);
  const [editing, setEditing] = useState(false);
  const [form, setForm]   = useState({ name: stored.name || "", phone: stored.phone || "" });
  const [saving, setSaving] = useState(false);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      const updated = { ...user, ...(data.user || form) };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated");
      setEditing(false);
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const initials = (user.name || "P").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label:"Full Name",    value: user.name       || "Not set" },
    { label:"Phone Number", value: user.phone      || "Not set" },
    { label:"SHA Number",   value: user.shaNumber  || "Not set", mono: true },
    { label:"Role",         value: user.role       || "patient", cap: true },
    { label:"Gender",       value: user.gender     || "Not set", cap: true },
    { label:"Age",          value: user.age        || "Not set" },
    { label:"Email",        value: user.email      || "Not set" },
  ];

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader eyebrow="Account" title="My Profile" subtitle="View and update your personal information." />

      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:20, alignItems:"flex-start" }} className="profile-grid">
        {/* Avatar card */}
        <Card style={{ textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:C.em600, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',Georgia,serif", fontSize:"1.6rem", fontWeight:300, color:"#fff", margin:"0 auto 14px" }}>
            {initials}
          </div>
          <div style={{ fontSize:"1rem", fontWeight:600, color:C.sl900, marginBottom:3 }}>{user.name || "Patient"}</div>
          <div style={{ fontSize:".78rem", color:C.sl500, textTransform:"capitalize", marginBottom:14 }}>{user.role || "patient"}</div>
          {user.shaNumber && (
            <div style={{ background:C.em50, borderRadius:8, padding:"8px 12px", fontSize:".74rem", color:C.em600, fontFamily:"monospace", fontWeight:600 }}>
              SHA: {user.shaNumber}
            </div>
          )}
        </Card>

        {/* Details card */}
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div style={{ fontSize:".78rem", fontWeight:700, color:C.sl700, textTransform:"uppercase", letterSpacing:".08em" }}>Account Details</div>
            {!editing && <Btn variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Profile</Btn>}
          </div>

          {editing ? (
            <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Inp label="Full Name" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} required />
              <Inp label="Phone Number" value={form.phone} type="tel" onChange={e => setForm({ ...form, phone:e.target.value })} required />
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <Btn variant="outline" full onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn type="submit" full disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn>
              </div>
            </form>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {fields.map(({ label, value, mono, cap }) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.sl100}`, flexWrap:"wrap", gap:6 }}>
                  <span style={{ fontSize:".78rem", color:C.sl500, fontWeight:500 }}>{label}</span>
                  <span style={{
                    fontSize:".875rem", color:C.sl900, fontWeight:500,
                    fontFamily: mono ? "monospace" : "inherit",
                    textTransform: cap ? "capitalize" : "none",
                  }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <style>{`@media(max-width:640px){.profile-grid{grid-template-columns:1fr!important}}`}</style>
    </PatientLayout>
  );
}