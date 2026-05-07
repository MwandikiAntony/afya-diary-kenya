import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AssignCHVPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient  = location.state?.patient;

  const [chvs, setChvs]     = useState([]);
  const [chvId, setChvId]   = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get("/chemist/chvs")
      .then(({ data }) => setChvs(data || []))
      .catch(() => toast.error("Failed to load CHVs"))
      .finally(() => setFetching(false));
  }, []);

  const handleAssign = async () => {
    if (!chvId) { toast.error("Please select a CHV"); return; }
    setLoading(true);
    try {
      await api.post("/chemist/assign-chv", { patientId: patient._id, chvId });
      toast.success("Patient assigned to CHV");
      setTimeout(() => navigate("/chemist-dashboard"), 900);
    } catch {
      toast.error("Failed to assign CHV");
    } finally {
      setLoading(false);
    }
  };

  const selectedCHV = chvs.find(c => c._id === chvId);

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .chv-option {
          padding: 13px 16px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; cursor: pointer; transition: all .15s; margin-bottom: 8px;
          display: flex; align-items: center; gap: 12; text-align: left; width: 100%;
          font-family: 'DM Sans',system-ui,sans-serif;
        }
        .chv-option:hover { border-color: #10b981; background: #ecfdf5; }
        .chv-option.selected { border-color: #059669; background: #ecfdf5; }
      `}</style>

      <PageHeader
        eyebrow="Chemist Portal"
        title="Assign to CHV"
        subtitle="Assign this patient to a community health volunteer for ongoing care."
      />

      <div style={{ maxWidth: 480 }}>
        {patient && (
          <div style={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
            padding: "14px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: ".74rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
              Patient
            </div>
            <div style={{ fontSize: ".9rem", fontWeight: 600, color: "#0f172a" }}>{patient.name}</div>
            <div style={{ fontSize: ".8rem", color: "#64748b", marginTop: 2, fontFamily: "monospace" }}>{patient.shaNumber}</div>
          </div>
        )}

        <Card>
          <div style={{ fontSize: ".74rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
            Select a CHV
          </div>

          {fetching ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#64748b", fontSize: ".875rem" }}>
              Loading community health volunteers...
            </div>
          ) : chvs.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: ".875rem" }}>
              No CHVs registered yet.
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {chvs.map(chv => {
                const isSelected = chvId === chv._id;
                const initials = (chv.name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <button
                    key={chv._id}
                    className={`chv-option${isSelected ? " selected" : ""}`}
                    onClick={() => setChvId(chv._id)}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: isSelected ? "#059669" : "#7c3aed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: ".76rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <div style={{ fontSize: ".875rem", fontWeight: 600, color: "#0f172a" }}>{chv.name}</div>
                      <div style={{ fontSize: ".78rem", color: "#64748b" }}>{chv.phone}</div>
                    </div>
                    {isSelected && (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {selectedCHV && (
            <div style={{ background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: ".82rem", color: "#065f46" }}>
              Assigning to <strong>{selectedCHV.name}</strong>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" full onClick={() => navigate("/chemist-dashboard")}>Skip for now</Btn>
            <Btn full disabled={loading || !chvId} onClick={handleAssign}>
              {loading ? "Assigning..." : "Confirm Assignment"}
            </Btn>
          </div>
        </Card>
      </div>
    </ChemistLayout>
  );
}