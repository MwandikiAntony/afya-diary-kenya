import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Badge, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChemistPatientPage() {
  const { state }      = useLocation();
  const { shaNumber }  = useParams();
  const navigate       = useNavigate();
  const [patient, setPatient] = useState(state?.patient || null);
  const [loading, setLoading] = useState(!state?.patient);

  useEffect(() => {
    if (!patient && shaNumber) {
      api.get(`/patients/search/${shaNumber}`)
        .then(({ data }) => setPatient(data))
        .catch(() => {
          toast.error("Patient not found");
          navigate("/chemist-dashboard");
        })
        .finally(() => setLoading(false));
    }
  }, [shaNumber, patient, navigate]);

  if (loading) {
    return (
      <ChemistLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontSize: ".9rem" }}>
          Loading patient...
        </div>
      </ChemistLayout>
    );
  }

  if (!patient) return null;

  const initials = (patient.name || "P").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label: "Phone",      value: patient.phone      || "Not set" },
    { label: "Gender",     value: patient.gender     || "Not set", cap: true },
    { label: "Age",        value: patient.age        || "Not set" },
    { label: "SHA Number", value: patient.shaNumber  || "Not set", mono: true },
    { label: "CHV",        value: patient.chvId?.name || "Not assigned" },
  ];

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .cp-grid { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: flex-start; }
        .cp-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
        @media (max-width: 640px) {
          .cp-grid { grid-template-columns: 1fr !important; }
          .cp-actions { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PageHeader
        eyebrow="Patient Record"
        title={patient.name}
        subtitle={`SHA Number: ${patient.shaNumber}`}
        action={
          <Btn variant="outline" size="sm" onClick={() => navigate("/chemist-dashboard")}>
            Back to Dashboard
          </Btn>
        }
      />

      <div className="cp-grid">
        {/* Avatar card */}
        <Card style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#059669",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces',Georgia,serif", fontSize: "1.4rem", fontWeight: 300,
            color: "#fff", margin: "0 auto 14px", border: "3px solid #d1fae5",
          }}>
            {initials}
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }}>
            {patient.name}
          </div>
          <Badge color={patient.chvId ? "green" : "gray"}>
            {patient.chvId ? "CHV Assigned" : "No CHV"}
          </Badge>
        </Card>

        {/* Details */}
        <div>
          <Card>
            <div style={{ fontSize: ".76rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
              Patient Details
            </div>
            {fields.map(({ label, value, mono, cap }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 6,
              }}>
                <span style={{ fontSize: ".78rem", color: "#64748b", fontWeight: 500 }}>{label}</span>
                <span style={{
                  fontSize: ".875rem", color: "#0f172a", fontWeight: 500,
                  fontFamily: mono ? "monospace" : "inherit",
                  textTransform: cap ? "capitalize" : "none",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </Card>

          <div className="cp-actions">
            <Btn
              full
              onClick={() => navigate(`/chemist/dispense/${patient.shaNumber}`, { state: { patient } })}
            >
              Dispense Medicine
            </Btn>
            <Btn
              variant="secondary"
              full
              onClick={() => navigate(`/chemist/add-record/${patient.shaNumber}`, { state: { patient } })}
            >
              Add Medical Record
            </Btn>
            <Btn
              variant="outline"
              full
              onClick={() => navigate("/chemist/assign-chv", { state: { patient } })}
            >
              {patient.chvId ? "Reassign CHV" : "Assign CHV"}
            </Btn>
          </div>
        </div>
      </div>
    </ChemistLayout>
  );
}