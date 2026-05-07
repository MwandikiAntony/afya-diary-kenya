import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, Badge, EmptyState, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const EMPTY = "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0";

export default function Reminders() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reminders/mine")
      .then(({ data }) => setItems(data || []))
      .catch(() => toast.error("Failed to load reminders"))
      .finally(() => setLoading(false));
  }, []);

  const overdue  = items.filter(r => !r.sent && new Date(r.dueDate) < new Date());
  const pending  = items.filter(r => !r.sent && new Date(r.dueDate) >= new Date());
  const sent     = items.filter(r => r.sent);

  const ReminderCard = ({ r }) => {
    const due = new Date(r.dueDate);
    const isOverdue = !r.sent && due < new Date();
    return (
      <div style={{
        background:"#fff", borderRadius:12, border:"1px solid #e2e8f0",
        padding:"16px 18px", boxShadow:"0 1px 4px rgba(0,0,0,.04)",
        borderLeft:`3px solid ${r.sent ? "#10b981" : isOverdue ? "#dc2626" : "#f59e0b"}`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:".9rem", fontWeight:500, color:"#0f172a", marginBottom:5, lineHeight:1.5 }}>{r.message}</p>
            <div style={{ fontSize:".78rem", color:"#94a3b8" }}>
              Due: {due.toLocaleString("en-KE", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
            </div>
          </div>
          <Badge color={r.sent ? "green" : isOverdue ? "red" : "amber"}>
            {r.sent ? "Sent" : isOverdue ? "Overdue" : "Pending"}
          </Badge>
        </div>
      </div>
    );
  };

  const Section = ({ title, data, color }) => data.length === 0 ? null : (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:".72rem", fontWeight:700, color, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>{title} ({data.length})</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {data.map(r => <ReminderCard key={r._id} r={r} />)}
      </div>
    </div>
  );

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader eyebrow="Reminders" title="My Reminders" subtitle="SMS alerts sent by your healthcare providers." />

      {loading ? (
        <Card><div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading reminders...</div></Card>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={EMPTY} title="No reminders yet" desc="Your healthcare provider will send reminders for medications and appointments here." /></Card>
      ) : (
        <div>
          <Section title="Overdue" data={overdue} color="#dc2626" />
          <Section title="Upcoming" data={pending} color="#d97706" />
          <Section title="Sent" data={sent}    color="#059669" />
        </div>
      )}
    </PatientLayout>
  );
}