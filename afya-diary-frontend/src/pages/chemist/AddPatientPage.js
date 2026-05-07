import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

const BLANK = { name: "", phone: "", gender: "", age: "", shaNumber: "" };

export default function AddPatientPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(BLANK);
  const [loading, setLoading] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.shaNumber) {
      toast.error("Name, phone, and SHA number are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/chemist/create-patient", form);
      toast.success(data.message || "Patient added successfully");
      navigate("/chemist/dispense", { state: { patient: data.patient } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Chemist Portal"
        title="Add Walk-in Patient"
        subtitle="Register a new patient who does not yet have an account."
      />

      <div style={{ maxWidth: 480 }}>
        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Full Name" name="name" value={form.name} onChange={set} required placeholder="Patient full name" />
            <Inp label="Phone Number" name="phone" type="tel" value={form.phone} onChange={set} required placeholder="+2547XXXXXXXX" />
            <Inp label="SHA Number" name="shaNumber" value={form.shaNumber} onChange={set} required placeholder="Social Health Authority Number" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Age" name="age" type="number" value={form.age} onChange={set} placeholder="Age" />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={set}
                  style={{
                    padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                    fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem",
                    color: "#0f172a", outline: "none", appearance: "none", cursor: "pointer",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Btn variant="outline" full onClick={() => navigate(-1)}>Cancel</Btn>
              <Btn type="submit" full disabled={loading}>{loading ? "Adding..." : "Add Patient"}</Btn>
            </div>
          </form>
        </Card>
      </div>
    </ChemistLayout>
  );
}