import React, { useEffect, useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import { PageHeader, Card, Btn, Inp, Table, TR, TD, EmptyState, Modal, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY = "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75";
const BLANK = { name:"", phone:"", age:"", gender:"", shaNumber:"" };

export default function CHVPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [search, setSearch]     = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/patients/assigned");
      setPatients(data || []);
    } catch { toast.error("Failed to load patients"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(BLANK); setOpen(true); };
  const openEdit = p => { setEditing(p._id); setForm({ name:p.name, phone:p.phone, age:p.age||"", gender:p.gender||"", shaNumber:p.shaNumber||"" }); setOpen(true); };

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/patients/${editing}`, form);
        toast.success("Patient updated");
      } else {
        await api.post("/patients", form);
        toast.success("Patient added");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save patient");
    } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = patients.filter(p =>
    [p.name, p.phone, p.shaNumber].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <CHVLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`@media(max-width:640px){.chvp-actions{flex-direction:column!important}}`}</style>

      <PageHeader
        eyebrow="CHV Portal"
        title="Assigned Patients"
        subtitle="Manage your roster of community patients."
        action={<Btn onClick={openAdd}>Add Patient</Btn>}
      />

      {/* Search */}
      <div style={{ marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone or SHA number..."
          style={{ width:"100%", maxWidth:360, padding:"10px 14px", borderRadius:9, border:"1.5px solid #e2e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a", outline:"none" }}
          onFocus={e => { e.target.style.borderColor="#10b981"; e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,.1)"; }}
          onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}
        />
      </div>

      <Card padding="0">
        {loading ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading patients...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={EMPTY} title="No patients found" desc={search ? "No patients match your search." : "No patients assigned to you yet."} />
        ) : (
          <Table headers={["Name","Phone","Age","Gender","SHA Number","Actions"]}>
            {filtered.map(p => (
              <TR key={p._id}>
                <TD><span style={{ fontWeight:500 }}>{p.name}</span></TD>
                <TD muted>{p.phone}</TD>
                <TD muted>{p.age || "—"}</TD>
                <TD muted style={{ textTransform:"capitalize" }}>{p.gender || "—"}</TD>
                <TD mono muted>{p.shaNumber || "—"}</TD>
                <TD>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant="outline" size="sm" onClick={() => openEdit(p)}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(p._id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Patient" : "Add Patient"}>
        <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <Inp label="Full Name" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} required placeholder="Patient full name" />
          <Inp label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone:e.target.value })} required placeholder="+2547XXXXXXXX" />
          <Inp label="SHA Number" value={form.shaNumber} onChange={e => setForm({ ...form, shaNumber:e.target.value })} required placeholder="Social Health Authority Number" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Inp label="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age:e.target.value })} placeholder="Age" />
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:".74rem", fontWeight:600, color:"#334155", textTransform:"uppercase", letterSpacing:".06em" }}>Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender:e.target.value })} required
                style={{ padding:"10px 13px", borderRadius:8, border:"1.5px solid #e2e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a", outline:"none", appearance:"none", cursor:"pointer" }}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn variant="outline" full onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" full disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add Patient"}</Btn>
          </div>
        </form>
      </Modal>
    </CHVLayout>
  );
}