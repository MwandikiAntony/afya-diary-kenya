import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, EmptyState, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const EMPTY = "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0";

export default function Notifications() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(({ data }) => setItems(data || []))
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader eyebrow="Notifications" title="Notifications" subtitle="Health updates, appointment confirmations, and system alerts." />

      {loading ? (
        <Card><div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading notifications...</div></Card>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={EMPTY} title="No notifications" desc="You have no notifications at this time. Check back later." /></Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {items.map((n, i) => (
            <div key={n._id || i} style={{
              background:"#fff", borderRadius:12, border:"1px solid #e2e8f0",
              padding:"16px 18px", boxShadow:"0 1px 4px rgba(0,0,0,.04)",
              borderLeft:"3px solid #059669",
            }}>
              <div style={{ fontSize:".9rem", fontWeight:600, color:"#0f172a", marginBottom:4 }}>
                {n.title || "Notification"}
              </div>
              <p style={{ fontSize:".855rem", color:"#475569", lineHeight:1.65, marginBottom:6 }}>{n.message}</p>
              <div style={{ fontSize:".72rem", color:"#94a3b8" }}>
                {new Date(n.createdAt).toLocaleString("en-KE", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  );
}