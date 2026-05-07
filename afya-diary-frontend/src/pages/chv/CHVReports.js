import React, { useEffect, useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import { PageHeader, Card, Btn, Inp, Table, TR, TD, EmptyState, Modal, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY_ICON = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8";
const BLANK = { patientId: "", title: "", notes: "" };

export default function CHVReports() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(BLANK);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/reports");
      setReports(data || []);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await api.post("/reports", form);
      toast.success("Report submitted");
      setOpen(false);
      setForm(BLANK);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSaving(false);
    }
  };

  const del = async id => {
    setDeleting(id);
    try {
      await api.delete(`/reports/${id}`);
      toast.success("Report deleted");
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <CHVLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="CHV Portal"
        title="Reports"
        subtitle="Submit and review household visit and health status reports."
        action={<Btn onClick={() => setOpen(true)}>New Report</Btn>}
      />

      <Card padding="0">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: ".875rem" }}>
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={EMPTY_ICON}
            title="No reports yet"
            desc="Submit your first household visit report to start tracking community health."
          />
        ) : (
          <Table headers={["Patient", "Title", "Notes", "Date", ""]}>
            {reports.map(r => (
              <TR key={r._id}>
                <TD>
                  <span style={{ fontWeight: 500 }}>
                    {r.patientId?.name || r.patientId || "General"}
                  </span>
                </TD>
                <TD>{r.title}</TD>
                <TD muted>
                  <span style={{ display: "block", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.notes || "—"}
                  </span>
                </TD>
                <TD muted>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </TD>
                <TD>
                  <Btn
                    variant="danger"
                    size="sm"
                    disabled={deleting === r._id}
                    onClick={() => del(r._id)}
                  >
                    {deleting === r._id ? "Deleting..." : "Delete"}
                  </Btn>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New Report">
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp
            label="Patient ID"
            value={form.patientId}
            onChange={e => setForm({ ...form, patientId: e.target.value })}
            placeholder="Patient ID or leave blank for general report"
          />
          <Inp
            label="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            placeholder="e.g. Household visit report"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: ".06em" }}>
              Notes / Findings *
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Describe what you observed during the visit..."
              required
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
            <Btn variant="outline" full onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" full disabled={saving}>{saving ? "Submitting..." : "Submit Report"}</Btn>
          </div>
        </form>
      </Modal>
    </CHVLayout>
  );
}