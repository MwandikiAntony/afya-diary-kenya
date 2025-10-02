// src/pages/Appointments.js
import React, { useState } from "react";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Appointments() {
  const [form, setForm] = useState({ patient: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);

  const createAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/appointments", form);
      toast.success("✅ Appointment created successfully");
      setForm({ patient: "", date: "", time: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">📅 Appointments</h1>
      <p className="text-gray-600 mb-6">
        Schedule patient visits and follow-ups easily.
      </p>

      <div className="max-w-lg bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={createAppointment} className="grid gap-4">
          <input
            placeholder="Patient ID or phone"
            value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00695C] text-white py-3 rounded-lg hover:bg-[#004D40] transition font-semibold"
          >
            {loading ? "Saving..." : "Save Appointment"}
          </button>
        </form>
      </div>
    </PatientLayout>
  );
}
