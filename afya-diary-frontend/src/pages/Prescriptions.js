import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, Badge, EmptyState, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const EMPTY = "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3M9 12h6 M12 9v6";

export default function Prescriptions() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/prescriptions")
      .then(({ data }) => {
        if (Array.isArray(data)) setItems(data);
        else if (Array.isArray(data?.prescriptions)) setItems(data.prescriptions);
        else setItems([]);
      })
      .catch(() => toast.error("Failed to load prescriptions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader eyebrow="Prescriptions" title="My Prescriptions" subtitle="View and track your prescribed medicines and dosage instructions." />

      {loading ? (
        <Card><div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading prescriptions...</div></Card>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={EMPTY} title="No prescriptions" desc="Prescriptions issued by your healthcare provider will appear here." /></Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.map((p, i) => (
            <div key={p._id || i} style={{
              background:"#fff", borderRadius:14, border:"1px solid #e2e8f0",
              padding:"20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:600, color:"#0f172a", marginBottom:3 }}>
                    {p.medication || "Medication"}
                  </h3>
                  <div style={{ fontSize:".78rem", color:"#94a3b8" }}>
                    Prescribed by {p.doctor?.name || p.chemist?.name || "Healthcare Provider"}
                  </div>
                </div>
                <Badge color={p.status === "dispensed" ? "green" : p.status === "active" ? "blue" : "amber"}>
                  {p.status || "pending"}
                </Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
                {[
                  ["Dosage", p.dosage],
                  ["Frequency", p.frequency],
                  ["Duration", p.duration],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} style={{ background:"#f8fafc", borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:".68rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:".855rem", fontWeight:500, color:"#0f172a" }}>{val}</div>
                  </div>
                ))}
              </div>
              {p.instructions && (
                <div style={{ marginTop:12, fontSize:".82rem", color:"#475569", lineHeight:1.65, background:"#f8fafc", borderRadius:8, padding:"10px 12px" }}>
                  {p.instructions}
                </div>
              )}
              <div style={{ marginTop:10, fontSize:".72rem", color:"#94a3b8" }}>
                Issued {new Date(p.createdAt).toLocaleDateString("en-KE", { day:"numeric", month:"long", year:"numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  );
}