import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function DispensePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient  = location.state?.patient;

  const [medicines, setMedicines] = useState([]);
  const [form, setForm]     = useState({ medicineId: "", quantity: "" });
  const [shaNumber, setShaNumber] = useState(patient?.shaNumber || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/chemist/medicines?ts=${Date.now()}`)
      .then(({ data }) => setMedicines(data || []))
      .catch(() => toast.error("Failed to load medicines"));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.medicineId || !form.quantity) {
      toast.error("Select a medicine and enter quantity");
      return;
    }
    setLoading(true);
    try {
      await api.post("/chemist/dispense", {
        patientId: patient?._id,
        medicineId: form.medicineId,
        quantity: Number(form.quantity),
      });
      toast.success("Medicine dispensed successfully");
      navigate("/chemist/assign-chv", { state: { patient } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispense medicine");
    } finally {
      setLoading(false);
    }
  };

  const selected = medicines.find(m => m._id === form.medicineId);

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .dispense-sel {
          width: 100%; padding: 10px 13px; border-radius: 8px;
          border: 1.5px solid #e2e8f0; font-family: 'DM Sans',system-ui,sans-serif;
          font-size: .875rem; color: #0f172a; outline: none; appearance: none;
          background: #fff; cursor: pointer;
        }
        .dispense-sel:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
      `}</style>

      <PageHeader
        eyebrow="Chemist Portal"
        title="Dispense Medicine"
        subtitle="Record medicine dispensed to a patient."
      />

      <div style={{ maxWidth: 520 }}>
        {patient ? (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: ".74rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
              Patient
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: ".82rem", color: "#64748b" }}>Name</span>
                <span style={{ fontSize: ".875rem", fontWeight: 600, color: "#0f172a" }}>{patient.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: ".82rem", color: "#64748b" }}>SHA Number</span>
                <span style={{ fontSize: ".875rem", fontWeight: 600, color: "#0f172a", fontFamily: "monospace" }}>{patient.shaNumber}</span>
              </div>
              {patient.phone && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: ".82rem", color: "#64748b" }}>Phone</span>
                  <span style={{ fontSize: ".875rem", color: "#0f172a" }}>{patient.phone}</span>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card style={{ marginBottom: 16 }}>
            <Inp
              label="SHA Number"
              value={shaNumber}
              onChange={e => setShaNumber(e.target.value)}
              placeholder="Enter patient SHA number"
              required
            />
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: ".06em" }}>
                Select Medicine *
              </label>
              <select
                className="dispense-sel"
                value={form.medicineId}
                onChange={e => setForm({ ...form, medicineId: e.target.value })}
                required
              >
                <option value="">Choose a medicine...</option>
                {medicines.map(m => (
                  <option key={m._id} value={m._id} disabled={m.stock === 0}>
                    {m.name} ({m.stock} in stock{m.stock === 0 ? " - out of stock" : ""})
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", fontSize: ".82rem", color: "#475569" }}>
                Available stock: <strong style={{ color: selected.stock <= 10 ? "#d97706" : "#059669" }}>{selected.stock} units</strong>
                {selected.price ? ` — KSh ${selected.price.toLocaleString()} per unit` : ""}
              </div>
            )}

            <Inp
              label="Quantity *"
              type="number"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              placeholder="Enter quantity"
              required
            />

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Btn variant="outline" full onClick={() => navigate(-1)}>Cancel</Btn>
              <Btn type="submit" full disabled={loading}>{loading ? "Dispensing..." : "Dispense Medicine"}</Btn>
            </div>
          </form>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={() => navigate("/chemist/add-medicine", { state: { fromDispense: true, patient } })}
              style={{
                background: "none", border: "none", color: "#059669", fontSize: ".82rem",
                fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif",
              }}
            >
              Medicine not listed? Add a new medicine
            </button>
          </div>
        </Card>
      </div>
    </ChemistLayout>
  );
}