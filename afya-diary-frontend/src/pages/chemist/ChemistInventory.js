import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Table, TR, TD, EmptyState, Badge, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY_ICON = "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01";

export default function ChemistInventory() {
  const navigate = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    api.get("/chemist/medicines")
      .then(({ data }) => setItems(data || []))
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  const stockBadge = stock => {
    if (stock === 0)   return <Badge color="red">Out of stock</Badge>;
    if (stock <= 5)    return <Badge color="red">Critical</Badge>;
    if (stock <= 15)   return <Badge color="amber">Low stock</Badge>;
    return <Badge color="green">In stock</Badge>;
  };

  const filtered = items.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const lowCount = items.filter(m => m.stock <= 15).length;

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Inventory"
        title="Medicine Inventory"
        subtitle="Track and manage your pharmacy stock levels."
        action={<Btn onClick={() => navigate("/chemist/add-medicine")}>Add Medicine</Btn>}
      />

      {lowCount > 0 && (
        <div style={{
          background: "#fef3c7", border: "1px solid #f59e0b30",
          borderLeft: "3px solid #f59e0b", borderRadius: 10,
          padding: "12px 16px", marginBottom: 16,
          fontSize: ".855rem", color: "#92400e",
        }}>
          <strong>{lowCount} item{lowCount > 1 ? "s" : ""}</strong> running low or out of stock. Restock soon to avoid shortages.
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search medicines..."
          style={{
            width: "100%", maxWidth: 320, padding: "10px 14px",
            borderRadius: 9, border: "1.5px solid #e2e8f0",
            fontFamily: "'DM Sans',system-ui,sans-serif",
            fontSize: ".875rem", color: "#0f172a", outline: "none",
          }}
          onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,.1)"; }}
          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      <Card padding="0">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: ".875rem" }}>
            Loading inventory...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={EMPTY_ICON}
            title="No medicines found"
            desc={search ? "No medicines match your search." : "Add your first medicine to start tracking inventory."}
          />
        ) : (
          <Table headers={["Medicine Name", "Stock", "Price (KSh)", "Status"]}>
            {filtered.map(m => (
              <TR key={m._id}>
                <TD><span style={{ fontWeight: 500 }}>{m.name}</span></TD>
                <TD>
                  <span style={{
                    fontWeight: 600, fontSize: ".875rem",
                    color: m.stock === 0 ? "#dc2626" : m.stock <= 10 ? "#d97706" : "#059669",
                  }}>
                    {m.stock}
                  </span>
                </TD>
                <TD muted>{m.price ? m.price.toLocaleString() : "—"}</TD>
                <TD>{stockBadge(m.stock)}</TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <div style={{ marginTop: 16, fontSize: ".78rem", color: "#94a3b8", textAlign: "right" }}>
        {filtered.length} of {items.length} medicines shown
      </div>
    </ChemistLayout>
  );
}