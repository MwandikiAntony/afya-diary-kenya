import React, { useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import toast from "react-hot-toast";

export default function CHVProfile() {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const [user, setUser]     = useState(stored);
  const [editing, setEditing] = useState(false);
  const [form, setForm]     = useState({ name: stored.name || "", phone: stored.phone || "", location: stored.location || "" });
  const [saving, setSaving] = useState(false);

  const save = e => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label: "Full Name",    value: user.name     || "Not set" },
    { label: "Phone Number", value: user.phone    || "Not set" },
    { label: "Email",        value: user.email    || "Not set" },
    { label: "SHA Number",   value: user.shaNumber || "Not set", mono: true },
    { label: "Location",     value: user.location || "Not set" },
    { label: "Role",         value: "Community Health Volunteer" },
  ];

  return (
    <CHVLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: flex-start; }
        @media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <PageHeader
        eyebrow="Account"
        title="My Profile"
        subtitle="View and update your CHV account details."
      />

      <div className="profile-grid">
        <Card style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#7c3aed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.4rem", fontWeight: 300,
            color: "#fff", margin: "0 auto 14px", border: "3px solid #ede9fe",
          }}>
            {initials}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{user.name || "CHV Worker"}</div>
          <div style={{ fontSize: ".78rem", color: "#64748b", marginBottom: 10 }}>Community Health Volunteer</div>
          {user.shaNumber && (
            <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "7px 10px", fontSize: ".72rem", color: "#7c3aed", fontFamily: "monospace", fontWeight: 600 }}>
              SHA: {user.shaNumber}
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: ".76rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em" }}>Account Details</div>
            {!editing && (
              <Btn variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Profile</Btn>
            )}
          </div>

          {editing ? (
            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <Inp label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <Inp label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Your service area" />
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <Btn variant="outline" full onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn type="submit" full disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn>
              </div>
            </form>
          ) : (
            <div>
              {fields.map(({ label, value, mono }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 6,
                }}>
                  <span style={{ fontSize: ".78rem", color: "#64748b", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: ".875rem", color: "#0f172a", fontWeight: 500, fontFamily: mono ? "monospace" : "inherit" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </CHVLayout>
  );
}