import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Reminders() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ patientId: "", message: "", dueDate: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await api.get("/reminders");
      setItems(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reminders");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reminders", form);
      toast.success("Reminder saved");
      setForm({ patientId: "", message: "", dueDate: "" });
      load();
    } catch (err) {
      console.error(err);
      toast.error("Could not save reminder");
    } finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await api.delete(`/reminders/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">⏰ Reminders</h1>
      <p className="text-gray-600 mb-4">Create SMS reminders for patients (delivery via Africa's Talking).</p>

      <div className="max-w-lg bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={save} className="grid gap-4">
          <input
            placeholder="Patient ID"
            value={form.patientId}
            onChange={e => setForm({ ...form, patientId: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
          />
          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <textarea
            placeholder="Reminder message"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C] min-h-[100px]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00695C] text-white py-3 rounded-lg hover:bg-[#004D40] transition font-semibold"
          >
            {loading ? "Sending..." : "Save reminder"}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-[#00695C] mb-2">Existing Reminders</h3>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[#3498db] text-white">
              <tr>
                <th className="text-left p-3">Patient</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Due</th>
                <th className="text-left p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map(r => (
                <tr key={r._id} className="border-b last:border-none">
                  <td className="p-3">{r.patientId?.phone || r.patientId}</td>
                  <td className="p-3">{r.message}</td>
                  <td className="p-3">{new Date(r.dueDate).toLocaleString()}</td>
                  <td className="p-3">{r.sent ? "Sent" : "Pending"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => remove(r._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500 text-center">No reminders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
