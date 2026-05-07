import React, { useEffect, useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChemistProfile() {
  const [chemist, setChemist]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [location, setLocation]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/chemist/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setChemist(data);
        setLocation(data.location || "");
      })
      .catch(err => toast.error(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported by your browser"); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const d = await res.json();
          setLocation(d.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast.success("Location detected");
        } catch {
          setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setDetecting(false);
        }
      },
      () => { toast.error("Unable to get location. Enable GPS and try again."); setDetecting(false); }
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.patch("/chemist/profile", { location }, { headers: { Authorization: `Bearer ${token}` } });
      setChemist(data);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (chemist?.name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label: "Full Name",      value: chemist?.name          || "Not set" },
    { label: "Phone Number",   value: chemist?.phone         || "Not set" },
    { label: "Email",          value: chemist?.email         || "Not set" },
    { label: "License Number", value: chemist?.licenseNumber || "Not set", mono: true },
    { label: "Pharmacy Name",  value: chemist?.pharmacyName  || "Not set" },
    { label: "Location",       value: chemist?.location      || "Not set" },
    { label: "Role",           value: "Pharmacist" },
  ];

  if (loading) {
    return (
      <ChemistLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontSize: ".9rem" }}>
          Loading profile...
        </div>
      </ChemistLayout>
    );
  }

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .ch-profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: flex-start; }
        @media (max-width: 640px) { .ch-profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <PageHeader
        eyebrow="Account"
        title="My Profile"
        subtitle="View and update your pharmacy account details."
      />

      <div className="ch-profile-grid">
        <Card style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#0284c7",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.4rem", fontWeight: 300,
            color: "#fff", margin: "0 auto 14px", border: "3px solid #e0f2fe",
          }}>
            {initials}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>
            {chemist?.name || "Chemist"}
          </div>
          <div style={{ fontSize: ".78rem", color: "#64748b", marginBottom: 10 }}>Pharmacist</div>
          {chemist?.pharmacyName && (
            <div style={{ background: "#e0f2fe", borderRadius: 8, padding: "7px 10px", fontSize: ".74rem", color: "#0284c7", fontWeight: 600 }}>
              {chemist.pharmacyName}
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: ".76rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em" }}>
              Account Details
            </div>
            {!editing && (
              <Btn variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Location</Btn>
            )}
          </div>

          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Btn variant="secondary" onClick={detectLocation} disabled={detecting}>
                {detecting ? "Detecting..." : "Use Current Location"}
              </Btn>
              <Inp
                label="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter location manually"
              />
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <Btn variant="outline" full onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn full disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Changes"}</Btn>
              </div>
            </div>
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
    </ChemistLayout>
  );
}