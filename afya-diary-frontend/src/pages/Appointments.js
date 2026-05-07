import React, { useState, useEffect } from "react";
import PatientLayout from "../components/PatientLayout";
import { PageHeader, Card, CardHeader, Btn, Inp, EmptyState, Table, TR, TD, Modal, Badge, FONTS, BASE_STYLES } from "../components/Shared/UI";
import api from "../utils/api";
import toast from "react-hot-toast";

const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const EMPTY = "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ patient:"", date:"", time:"", notes:"" });

  const load = async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment booked");
      setOpen(false);
      setForm({ patient:"", date:"", time:"", notes:"" });
      load();
    } catch { toast.error("Failed to book appointment"); }
    finally { setSaving(false); }
  };

  const upcoming = appointments.filter(a => new Date(`${a.date}T${a.time||"00:00"}`) >= new Date());
  const past     = appointments.filter(a => new Date(`${a.date}T${a.time||"00:00"}`) < new Date());

  const ApptCard = ({ a }) => {
    const dt = new Date(`${a.date}T${a.time||"00:00"}`);
    const isPast = dt < new Date();
    return (
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:"16px 18px", boxShadow:"0 1px 4px rgba(0,0,0,.04)", borderLeft:`3px solid ${isPast?"#94a3b8":"#059669"}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:".9rem", fontWeight:600, color:"#0f172a", marginBottom:3 }}>
              {a.patient || "General Appointment"}
            </div>
            <div style={{ fontSize:".82rem", color:"#64748b" }}>
              {dt.toLocaleDateString("en-KE", { weekday:"short", day:"numeric", month:"long", year:"numeric" })}
              {a.time && ` at ${a.time}`}
            </div>
            {a.notes && <div style={{ fontSize:".8rem", color:"#94a3b8", marginTop:4 }}>{a.notes}</div>}
          </div>
          <Badge color={isPast ? "gray" : "green"}>{isPast ? "Past" : "Upcoming"}</Badge>
        </div>
      </div>
    );
  };

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Appointments"
        title="My Appointments"
        subtitle="Book and manage your healthcare visits."
        action={<Btn onClick={() => setOpen(true)}><Ic d="M12 5v14 M5 12h14" size={15} />Book Appointment</Btn>}
      />

      {loading ? (
        <Card><div style={{ padding:"40px", textAlign:"center", color:"#64748b", fontSize:".875rem" }}>Loading appointments...</div></Card>
      ) : appointments.length === 0 ? (
        <Card><EmptyState icon={EMPTY} title="No appointments yet" desc="Book your first appointment to start managing your healthcare visits." /></Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          {upcoming.length > 0 && (
            <div>
              <div style={{ fontSize:".74rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Upcoming</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {upcoming.map(a => <ApptCard key={a._id || a.date+a.time} a={a} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <div style={{ fontSize:".74rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Past</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {past.slice(0, 5).map(a => <ApptCard key={a._id || a.date+a.time} a={a} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Book Appointment">
        <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Inp label="Patient ID or Phone" name="patient" value={form.patient} onChange={e => setForm({ ...form, patient:e.target.value })} required placeholder="Your ID or phone number" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Inp label="Date" name="date" type="date" value={form.date} onChange={e => setForm({ ...form, date:e.target.value })} required />
            <Inp label="Time" name="time" type="time" value={form.time} onChange={e => setForm({ ...form, time:e.target.value })} required />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <label style={{ fontSize:".74rem", fontWeight:600, color:"#334155", textTransform:"uppercase", letterSpacing:".06em" }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes:e.target.value })}
              placeholder="Reason for visit or additional notes..." rows={3}
              style={{ padding:"10px 13px", borderRadius:8, border:"1.5px solid #e2e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:".875rem", color:"#0f172a", outline:"none", resize:"vertical" }}
              onFocus={e => { e.target.style.borderColor="#10b981"; e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,.1)"; }}
              onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn variant="outline" full onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" full disabled={saving}>{saving ? "Booking..." : "Book Appointment"}</Btn>
          </div>
        </form>
      </Modal>
    </PatientLayout>
  );
}