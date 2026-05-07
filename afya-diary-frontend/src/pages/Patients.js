import React, { useEffect, useState } from "react";
import Layout from "../components/PatientLayout";
import { PageHeader, Card, Btn, Inp, Table, TR, TD, EmptyState, Modal, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const EMPTY = "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ name:"", phone:"", shaNumber:"" });

  const load = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data || []);
    } catch { toast.error("Failed to load patients"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/patients", form);
      toast.success("Patient added");
      setForm({ name:"", phone:"", shaNumber:"" });
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save patient");
    } finally { setSaving(false); }
  };

  return (
    <Layout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Patients"
        title="Patients"
        subtitle="View and manage registered patient records."
        action={<Btn onClick={() => setOpen(true)}>Add Patient</Btn>}
      />

      <Card padding="0">
        {loading ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading...</div>
        ) : patients.length === 0 ? (
          <EmptyState icon={EMPTY} title="No patients found" desc="Add your first patient to get started." />
        ) : (
          <Table headers={["Name","Phone","SHA Number"]}>
            {patients.map(p => (
              <TR key={p._id}>
                <TD><span style={{ fontWeight:500 }}>{p.name}</span></TD>
                <TD muted>{p.phone}</TD>
                <TD mono muted>{p.shaNumber || "—"}</TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Patient">
        <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Inp label="Full Name" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} required placeholder="Patient full name" />
          <Inp label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone:e.target.value })} required placeholder="+2547XXXXXXXX" />
          <Inp label="SHA Number" value={form.shaNumber} onChange={e => setForm({ ...form, shaNumber:e.target.value })} placeholder="Social Health Authority Number" />
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn variant="outline" full onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" full disabled={saving}>{saving ? "Saving..." : "Add Patient"}</Btn>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}