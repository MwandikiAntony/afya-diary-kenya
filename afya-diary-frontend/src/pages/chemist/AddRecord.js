import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AddRecord() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const [form, setForm] = useState({
    shaNumber:  state?.patient?.shaNumber || "",
    diagnosis:  "",
    notes:      "",
  });
  const [loading, setLoading] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.shaNumber || !form.diagnosis) {
      toast.error("SHA number and diagnosis are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/chemist/add-record", form);
      toast.success(data.message || "Record added successfully");
      navigate("/chemist-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add record");
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
        title="Add Medical Record"
        subtitle="Record a diagnosis or clinical note for a patient."
      />

      <div style={{ maxWidth: 520 }}>
        {state?.patient && (
          <div style={{
            background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: 10,
            padding: "12px 16px", marginBottom: 16, fontSize: ".855rem", color: "#065f46",
          }}>
            Recording for: <strong>{state.patient.name}</strong> — SHA {state.patient.shaNumber}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp
              label="SHA Number"
              name="shaNumber"
              value={form.shaNumber}
              onChange={set}
              required
              placeholder="Patient SHA number"
              readOnly={!!state?.patient?.shaNumber}
            />
            <Inp
              label="Diagnosis"
              name="diagnosis"
              value={form.diagnosis}
              onChange={set}
              required
              placeholder="e.g. Hypertension, Malaria, Type 2 Diabetes"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: ".06em" }}>
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={set}
                placeholder="Additional clinical notes, treatment given, follow-up instructions..."
                rows={5}
                style={{
                  padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                  fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: ".875rem",
                  color: "#0f172a", outline: "none", resize: "vertical", lineHeight: 1.65,
                }}
                onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Btn variant="outline" full onClick={() => navigate(-1)}>Cancel</Btn>
              <Btn type="submit" full disabled={loading}>{loading ? "Saving..." : "Save Record"}</Btn>
            </div>
          </form>
        </Card>
      </div>
    </ChemistLayout>
  );
}